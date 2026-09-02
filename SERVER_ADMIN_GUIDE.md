# 🛠️ Salahaddin University-Erbil (SURC) - Production Server Admin Guide & Command Cheat Sheet

This reference guide collects all server management commands, SSL certificates, SMTP email credentials, process management, and maintenance tips for `rc.su.edu.krd`.

---

## 🔒 1. SSL / HTTPS Activation (Let's Encrypt Certbot)

Run this once your DNS domain `rc.su.edu.krd` points to the server IP:

```bash
# Obtain and install SSL Certificate automatically for Nginx
certbot --nginx -d rc.su.edu.krd

# Test automatic SSL certificate renewal
certbot renew --dry-run
```

---

## ✉️ 2. Configuring Real Email Dispatch (Nodemailer & SUE Email)

To allow the portal to send real 6-digit verification code emails to `@su.edu.krd` users:

1. Open the backend environment configuration file:
   ```bash
   nano /var/www/surc/dynamic/backend/.env
   ```
2. Replace `CHANGE_TO_YOUR_ACTUAL_EMAIL_PASSWORD` with your password for `polla.fattah@su.edu.krd`:
   ```env
   SMTP_HOST=smtp.office365.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=polla.fattah@su.edu.krd
   SMTP_PASS=YourActualEmailPasswordHere
   SMTP_FROM="SURC Research Center" <polla.fattah@su.edu.krd>
   ```
3. Restart backend services to apply:
   ```bash
   pm2 restart all
   ```

---

## ⚙️ 3. Process Management (PM2)

Manage the frontend web portal and backend API background processes:

```bash
# View live status of all background processes
pm2 status

# View real-time application logs
pm2 logs

# View logs for backend API only
pm2 logs surc-backend

# View logs for frontend portal only
pm2 logs surc-frontend

# Restart both frontend and backend
pm2 restart all

# Save PM2 process list to start automatically on server reboot
pm2 save
```

---

## 🗄️ 4. Database & User Management (PostgreSQL & Prisma)

```bash
# Connect directly to the PostgreSQL database CLI
sudo -u postgres psql -d surc_db

# Run database migrations manually (if schema changes)
cd /var/www/surc/dynamic/backend
npx prisma migrate deploy

# Upgrade polla.fattah@su.edu.krd to superadmin role manually
cd /var/www/surc/dynamic/backend
node prisma/make_polla_superadmin.js
```

---

## 🌐 5. Web Server Configuration (Nginx)

```bash
# Test Nginx configuration file for syntax errors
nginx -t

# Reload Nginx configuration without downtime
systemctl reload nginx

# Restart Nginx web server
systemctl restart nginx

# View Nginx site configuration file
cat /etc/nginx/sites-available/rc.su.edu.krd.conf
```

---

## 🔄 6. Future Code Updates (Deploying New Git Commits)

When you make updates to the code on GitHub in the future, run these commands on the server to update:

```bash
# 1. Navigate to application folder
cd /var/www/surc

# 2. Pull latest code from GitHub
git pull origin main

# 3. Build Backend API
cd dynamic/backend
npm install
npx prisma db push
npm run build

# 4. Build Frontend Web Portal
cd ../frontend
npm install
npm run build

# 5. Restart services
pm2 restart all
```
