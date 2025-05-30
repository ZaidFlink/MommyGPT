# 🚀 MommyGPT Deployment Guide

Follow these simple steps to deploy your MommyGPT website to the internet!

## Method 1: Deploy via GitHub + Vercel (Recommended)

### **Step 1: Create GitHub Repository**

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** button in the top right → **"New repository"**
3. Repository name: `mommygpt` (or any name you prefer)
4. Make it **Public** (so Vercel can access it)
5. **Don't** initialize with README (we already have code)
6. Click **"Create repository"**

### **Step 2: Push Your Code to GitHub**

Copy the commands from your new GitHub repository page and run them:

```bash
git remote add origin https://github.com/YOUR_USERNAME/mommygpt.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### **Step 3: Deploy to Vercel**

1. Go to [Vercel.com](https://vercel.com)
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub
4. Click **"Import Project"**
5. Find your `mommygpt` repository → Click **"Import"**
6. Leave all settings as default (Vercel auto-detects Next.js)
7. Click **"Deploy"**

🎉 **Your site will be live in 2-3 minutes!**

### **Step 4: Add OpenAI API Key (Optional)**

To enable real AI responses:

1. In your Vercel dashboard → Go to your project
2. Click **"Settings"** → **"Environment Variables"**
3. Add a new variable:
   - **Name**: `NEXT_PUBLIC_OPENAI_API_KEY`
   - **Value**: Your OpenAI API key
4. Click **"Save"**
5. Go to **"Deployments"** → Click **"Redeploy"** on the latest deployment

## Method 2: Quick Deploy Button (Alternative)

You can also deploy directly from GitHub:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/mommygpt)

## 🌐 Your Website Will Be Available At:

- **Free Vercel URL**: `https://mommygpt-xxx.vercel.app`
- **Custom Domain**: You can add your own domain in Vercel settings

## 🔧 Post-Deployment

### **Update Your Site**
Whenever you make changes:
```bash
git add .
git commit -m "Update MommyGPT"
git push
```
Vercel will automatically redeploy!

### **Monitor Your Site**
- **Analytics**: Available in your Vercel dashboard
- **Logs**: Check for any errors in the Functions tab
- **Performance**: Vercel provides speed insights

## 💡 Tips for Success

1. **API Key Security**: Never commit your API key to GitHub - only add it in Vercel environment variables
2. **Demo Mode**: Your site works perfectly without an API key (shows fallback responses)
3. **Custom Domain**: Add a custom domain in Vercel settings for a professional look
4. **SSL**: Vercel provides free HTTPS automatically
5. **Global CDN**: Your site will be fast worldwide

## 🆘 Troubleshooting

### **Deployment Fails**
- Check that your `package.json` has the correct scripts
- Ensure all dependencies are installed: `yarn install`
- Verify Node.js version compatibility

### **Environment Variables Not Working**
- Make sure variable name is exactly: `NEXT_PUBLIC_OPENAI_API_KEY`
- Redeploy after adding environment variables
- Check the Functions logs for errors

### **API Costs**
- **GPT-4o-mini** is the cheapest quality model ($0.15 per 1M input tokens)
- Monitor usage in OpenAI dashboard
- Set usage limits to control costs

## 🎉 Congratulations!

Your MommyGPT is now live on the internet! Share the URL with friends and family to let them experience your beautiful AI assistant! 💕 