# Netlify Deployment Instructions

## 🚀 Deploy to Netlify

### Option 1: Netlify Dashboard (Recommended)
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub account
4. Select repository: `pz2372/jobboard`
5. Configure build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`

### Option 2: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# From the client directory
cd client
npm run build
netlify deploy --prod --dir=build
```

## ⚙️ Environment Variables
Netlify will automatically use the environment variables from `netlify.toml`:
- `REACT_APP_API_URL`: https://jobboard-7q35.onrender.com
- `REACT_APP_ENV`: production

## 🔗 After Deployment
1. Note your Netlify URL (e.g., `https://your-app.netlify.app`)
2. Update server CORS in Render dashboard:
   - Go to your Render service
   - Environment Variables
   - Update `CORS_ORIGIN` to include your Netlify URL

## 🧪 Testing
1. Visit your Netlify URL
2. Open browser DevTools → Console
3. Look for: "🔗 API Configuration" log
4. Test login/signup functionality