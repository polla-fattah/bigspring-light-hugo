# Sveltia CMS Setup Guide for SURC Website

This guide will help you set up Sveltia CMS for managing content on the SURC website.

## Prerequisites

1. **GitHub Account**: You need a GitHub account to use Sveltia CMS
2. **Git Repository**: Your website code should be in a GitHub repository
3. **Local Development Server**: Hugo development server running

## Step 1: Configure GitHub Repository

1. Open `static/admin/config.yml`
2. Find the line: `repo: your-username/your-repository`
3. Replace with your actual GitHub username and repository name
   - Example: `repo: pollafattah/bigspring-light`

## Step 2: Set Up Authentication (For Production)

### Option A: Local Development (Implicit Auth)

For local testing, you can use implicit authentication. The config is already set to:
```yaml
auth_type: implicit
```

### Option B: Production Setup (OAuth)

For production, you need to set up OAuth authentication:

1. **Create GitHub OAuth App**:
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"
   - Set:
     - Application name: "SURC CMS"
     - Homepage URL: `https://your-domain.com`
     - Authorization callback URL: `https://your-domain.com/admin/`
   - Save and note the Client ID and Client Secret

2. **Deploy Sveltia CMS Authenticator**:
   - Follow instructions at: https://github.com/sveltia/sveltia-cms-auth
   - Deploy to Cloudflare Workers or similar service
   - Get the worker URL

3. **Update config.yml**:
   ```yaml
   backend:
     name: github
     repo: your-username/your-repository
     base_url: https://your-worker-url.workers.dev
     auth_type: oauth
   ```

## Step 3: Update Site URLs

In `static/admin/config.yml`, update:
- `site_url`: Your production website URL
- `display_url`: Your production website URL
- `base_url` (in backend section): Your authentication worker URL (if using OAuth)

## Step 4: Test Locally

1. Start Hugo development server:
   ```bash
   hugo server
   ```

2. Open browser and navigate to:
   ```
   http://localhost:1313/admin/
   ```

3. You should see the Sveltia CMS login interface

4. Log in with your GitHub credentials

5. You can now:
   - Create new content (Publications, Projects, Staff, Labs, etc.)
   - Edit existing content
   - Upload images
   - Manage all content through the web interface

## Step 5: Content Management

### Adding New Content

1. Log in to CMS at `/admin/`
2. Select a collection (e.g., "Publications")
3. Click "New [Collection Name]"
4. Fill in the form fields
5. Click "Save" - this will commit to your Git repository

### Editing Existing Content

1. Log in to CMS
2. Select a collection
3. Click on an existing item
4. Make changes
5. Click "Save"

### Important Notes

- **IDs**: Make sure to follow the ID patterns:
  - Publications: `pub-001`, `pub-002`, etc.
  - Projects: `project-name-here`
  - Staff: `staff-name-here`
  - Labs: `lab-category-001`
  - Datasets: `dataset-name-here`
  - Units: `unit-name-here`

- **Relationships**: When linking content:
  - Use the ID (e.g., `staff-researcher-1`, not the name)
  - For staff in publications, use staff IDs
  - For related projects, use project IDs

- **Images**: Uploaded images go to `static/images/uploads/`
  - They will be accessible at `/images/uploads/filename.jpg`

## Step 6: Automated Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Site

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.148.2'
          extended: true
      
      - name: Build
        run: hugo --minify
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

### Netlify

1. Connect your GitHub repository to Netlify
2. Build command: `hugo --gc --minify`
3. Publish directory: `public`
4. Netlify will automatically rebuild on every Git push

### Vercel

1. Import your GitHub repository to Vercel
2. Framework preset: Hugo
3. Build command: `hugo --gc --minify`
4. Output directory: `public`
5. Vercel will automatically rebuild on every Git push

## Troubleshooting

### CMS Not Loading

- Check browser console for errors
- Verify `static/admin/index.html` exists
- Verify `static/admin/config.yml` exists
- Check that Hugo is serving static files correctly

### Authentication Issues

- For local: Use `auth_type: implicit`
- For production: Ensure OAuth app is configured correctly
- Check that callback URL matches your OAuth app settings

### Content Not Saving

- Check GitHub repository permissions
- Verify repository name in config.yml is correct
- Check browser console for errors
- Ensure you're logged in to GitHub

### Images Not Uploading

- Verify `static/images/uploads/` directory exists
- Check file permissions
- Verify media_folder path in config.yml

## Security Notes

- The CMS admin interface should be protected in production
- Consider adding authentication middleware
- Regularly update Sveltia CMS to latest version
- Review and restrict GitHub repository access

## Support

For Sveltia CMS documentation:
- https://sveltiacms.app/en/docs/

For issues specific to this setup:
- Check the repository issues
- Contact the development team
