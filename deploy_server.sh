#!/usr/bin/env bash
# ==============================================================================
# SALAHADDIN UNIVERSITY-ERBIL RESEARCH CENTER (SURC) AUTOMATED SERVER DEPLOYMENT
# Domain: rc.su.edu.krd
# Repository: git@github.com:polla-fattah/surc.git
# ==============================================================================

set -e

GREEN='\030[0;32m'
MAROON='\033[0;31m'
GOLD='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${GOLD}"
echo "=========================================================================="
echo "      Salahaddin University-Erbil - SURC Production Deployment            "
echo "      Target Domain: rc.su.edu.krd                                       "
echo "=========================================================================="
echo -e "${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${MAROON}Error: Please run this script as root (e.g. sudo bash deploy_server.sh)${NC}"
  exit 1
fi

# 1. UPDATE SYSTEM & INSTALL REQUIRED PACKAGES
echo -e "${GREEN}[1/8] Updating package index and installing system tools...${NC}"
apt-get update -y
apt-get install -y curl git nginx certbot python3-certbot-nginx build-essential postgresql postgresql-contrib

# 2. INSTALL NODE.JS 20 & PM2
if ! command -v node &> /dev/null; then
  echo -e "${GREEN}[2/8] Installing Node.js v20 LTS...${NC}"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
else
  echo -e "${GREEN}[2/8] Node.js is already installed ($(node -v)).${NC}"
fi

if ! command -v pm2 &> /dev/null; then
  echo -e "${GREEN}Installing PM2 Process Manager globally...${NC}"
  npm install -g pm2
fi

# 3. PREPARE DEPLOYMENT DIRECTORY & CLONE REPOSITORY
APP_DIR="/var/www/surc"
echo -e "${GREEN}[3/8] Setting up application directory at ${APP_DIR}...${NC}"

if [ -d "$APP_DIR" ]; then
  echo "Existing directory found. Pulling latest code from GitHub..."
  cd "$APP_DIR"
  git pull origin main
else
  echo "Cloning repository git@github.com:polla-fattah/surc.git..."
  mkdir -p /var/www
  git clone git@github.com:polla-fattah/surc.git "$APP_DIR"
  cd "$APP_DIR"
fi

# 4. SETUP POSTGRESQL DATABASE & ENVIRONMENT VARIABLES
echo -e "${GREEN}[4/8] Configuring PostgreSQL Database & Environment Variables...${NC}"

# Generate cryptographically strong random DB password & NextAuth secret
DB_PASS=$(openssl rand -hex 16)
SECRET_KEY=$(openssl rand -base64 32)

# Ensure PostgreSQL service is running and create database/user if needed
if command -v psql &> /dev/null; then
  echo "Setting up PostgreSQL database 'surc_db' and user 'surc_user'..."
  systemctl restart postgresql || systemctl start postgresql || true
  sudo -u postgres psql -c "CREATE USER surc_user WITH PASSWORD '${DB_PASS}';" 2>/dev/null || true
  sudo -u postgres psql -c "ALTER USER surc_user WITH PASSWORD '${DB_PASS}';" 2>/dev/null || true
  sudo -u postgres psql -c "CREATE DATABASE surc_db OWNER surc_user;" 2>/dev/null || true
  sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE surc_db TO surc_user;" 2>/dev/null || true
fi

cat <<EOF > "$APP_DIR/dynamic/backend/.env"
NODE_ENV=production
ALLOWED_ORIGIN="https://rc.su.edu.krd"
DATABASE_URL="postgresql://surc_user:${DB_PASS}@localhost:5432/surc_db?schema=public"

# Nodemailer SMTP Setup (Defaulting to Dr. Polla's email; update password in .env)
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=polla.fattah@su.edu.krd
SMTP_PASS=CHANGE_TO_YOUR_ACTUAL_EMAIL_PASSWORD
SMTP_FROM="SURC Research Center" <polla.fattah@su.edu.krd>
EOF

cat <<EOF > "$APP_DIR/dynamic/frontend/.env"
NODE_ENV=production
NEXT_PUBLIC_API_URL=""
INTERNAL_BACKEND_URL="http://127.0.0.1:3000"
NEXTAUTH_URL="https://rc.su.edu.krd"
NEXTAUTH_SECRET="${SECRET_KEY}"
AUTH_SECRET="${SECRET_KEY}"
AUTH_TRUST_HOST="true"
EOF

echo "Environment configuration files created."

# 5. BUILD BACKEND & DATABASE MIGRATIONS
echo -e "${GREEN}[5/8] Building Backend API and running database migrations...${NC}"
cd "$APP_DIR/dynamic/backend"
npm install
npx prisma db push --accept-data-loss
node prisma/seed_all_content_data.js || true
npm run build

# 6. BUILD FRONTEND WEB PORTAL & PRESERVE UPLOADS DIRECTORY
echo -e "${GREEN}[6/8] Building Frontend Web Portal...${NC}"
mkdir -p "$APP_DIR/dynamic/frontend/public/images/uploads"
chmod -R 777 "$APP_DIR/dynamic/frontend/public/images/uploads" 2>/dev/null || true

cd "$APP_DIR/dynamic/frontend"
npm install
npm run build

# 7. CONFIGURE PM2 PROCESS MANAGEMENT
echo -e "${GREEN}[7/8] Starting production processes with PM2...${NC}"
pm2 delete surc-backend 2>/dev/null || true
pm2 delete surc-frontend 2>/dev/null || true

cd "$APP_DIR/dynamic/backend"
pm2 start npm --name "surc-backend" -- run start -- --port 3000

cd "$APP_DIR/dynamic/frontend"
pm2 start npm --name "surc-frontend" -- run start -- --port 3001

pm2 save
pm2 startup systemd -u root --hp /root || true

# 8. CONFIGURE NGINX REVERSE PROXY & FIREWALL FOR CLOUDFLARE
echo -e "${GREEN}[8/8] Configuring Nginx Reverse Proxy for rc.su.edu.krd (Ports 80 & 443)...${NC}"

# Ensure HTTP (80) and HTTPS (443) firewall ports are open
ufw allow 80/tcp 2>/dev/null || true
ufw allow 443/tcp 2>/dev/null || true
iptables -I INPUT -p tcp --dport 80 -j ACCEPT 2>/dev/null || true
iptables -I INPUT -p tcp --dport 443 -j ACCEPT 2>/dev/null || true

# Generate instant SSL certificate for Port 443 (Cloudflare Full SSL Compatibility)
mkdir -p /etc/ssl/certs /etc/ssl/private
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
  -keyout /etc/ssl/private/surc-selfsigned.key \
  -out /etc/ssl/certs/surc-selfsigned.crt \
  -subj "/CN=rc.su.edu.krd" 2>/dev/null || true

# Remove any conflicting default or Virtualmin site files for rc.su.edu.krd
rm -f /etc/nginx/sites-enabled/*rc.su.edu.krd* 2>/dev/null || true
rm -f /etc/nginx/sites-available/*rc.su.edu.krd* 2>/dev/null || true
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

NGINX_CONF="/etc/nginx/conf.d/surc_rc.conf"
cat <<EOF > "$NGINX_CONF"
server {
    listen 80;
    listen 443 ssl default_server;
    server_name rc.su.edu.krd www.rc.su.edu.krd;

    ssl_certificate /etc/ssl/certs/surc-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/surc-selfsigned.key;

    # Route Backend Specific Auth Endpoints to Port 3000
    location = /api/auth/login {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location = /api/auth/register {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location = /api/auth/verify {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Route NextAuth Session & Callback Endpoints to Frontend (Port 3001)
    location /api/auth/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Route All Other /api/ requests to local Backend (Port 3000)
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Route Web & Admin pages to local Frontend (Port 3001)
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

systemctl enable nginx
nginx -t
systemctl restart nginx

echo -e "${GOLD}"
echo "=========================================================================="
echo "  SUCCESS! SURC Production System deployed on http://rc.su.edu.krd         "
echo "=========================================================================="
echo -e "${NC}"
echo "Next steps:"
echo "1. Run Let's Encrypt SSL activation: certbot --nginx -d rc.su.edu.krd"
echo "2. Edit SMTP email credentials in /var/www/surc/dynamic/backend/.env"
echo "3. Restart services if needed with: pm2 restart all"
