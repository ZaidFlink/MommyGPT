# MommyGPT v2 Setup Guide

This guide will help you set up MommyGPT v2 with user authentication and persistent chat storage using Supabase.

## Features

- ✨ User authentication (signup/login with email and password)
- 💾 Persistent chat storage in Supabase PostgreSQL database
- 🔐 Row-level security ensuring users can only access their own data
- 💬 Real-time chat interface with MommyGPT AI
- 📱 Responsive design that works on mobile and desktop
- 🎨 Beautiful pink-themed UI

## Prerequisites

- Node.js 18+ 
- Yarn package manager
- A Supabase account (free tier available)
- An OpenAI API key

## Setup Instructions

### 1. Supabase Setup

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Sign up/login and create a new project
   - Wait for the project to be fully provisioned

2. **Get Your Supabase Credentials:**
   - Go to Project Settings → API
   - Copy your `Project URL` and `anon public` key
   - You'll need these for your environment variables

3. **Set Up Database Schema:**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase-setup.sql` and run it
   - This will create all necessary tables, indexes, and security policies

4. **Configure Authentication:**
   - Go to Authentication → Settings
   - Enable Email authentication
   - Optionally configure email templates and other settings

### 2. Environment Configuration

1. **Create Environment File:**
   ```bash
   cp .env.example .env.local
   ```

2. **Add Your Environment Variables:**
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key
   ```

   **Where to find these values:**
   - `NEXT_PUBLIC_SUPABASE_URL`: Project Settings → API → Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project Settings → API → Project API keys → anon public
   - `SUPABASE_SERVICE_ROLE_KEY`: Project Settings → API → Project API keys → service_role (keep this secret!)
   - `OPENAI_API_KEY`: Get from [OpenAI Platform](https://platform.openai.com/api-keys)

### 3. Install Dependencies

```bash
yarn install
```

### 4. Run the Development Server

```bash
yarn dev
```

Your app should now be running at `http://localhost:3000`!

## Usage

### For Users

1. **Sign Up:** Visit the app and click "Create Account"
2. **Sign In:** Use your email and password to sign in
3. **Start Chatting:** Create a new chat and start talking to MommyGPT
4. **Chat History:** All your chats are automatically saved and synced across devices

### For Developers

The app is structured as follows:

```
src/
├── app/
│   ├── layout.tsx          # Root layout with AuthProvider
│   ├── page.tsx            # Main chat interface
│   └── globals.css         # Global styles
├── lib/
│   ├── auth/
│   │   └── AuthProvider.tsx # Authentication context
│   ├── hooks/
│   │   └── useChats.ts     # Chat management hooks
│   ├── supabase/
│   │   ├── client.ts       # Browser Supabase client
│   │   └── server.ts       # Server Supabase client
│   ├── types/
│   │   └── database.ts     # TypeScript types
│   └── openai.ts           # OpenAI integration
└── components/
    └── auth/
        └── AuthModal.tsx   # Login/signup modal
```

## Database Schema

The app uses three main tables:

- **users**: Extended user profiles linked to Supabase auth
- **chats**: User's chat sessions with titles and metadata
- **messages**: Individual messages within chats

All tables have Row Level Security (RLS) enabled to ensure data privacy.

## Security Features

- 🔐 Row Level Security ensures users can only access their own data
- 🛡️ Server-side API routes for sensitive operations
- 🔑 Secure authentication with Supabase Auth
- 📧 Email verification (configurable)

## Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Deploy on Vercel:**
   - Connect your GitHub repo to Vercel
   - Add your environment variables in Vercel dashboard
   - Deploy!

### Other Platforms

The app is a standard Next.js application and can be deployed on:
- Netlify
- Railway
- Render
- Any platform that supports Node.js

## Troubleshooting

### Common Issues

1. **"RLS policy violation" errors:**
   - Make sure you ran the `supabase-setup.sql` script
   - Check that RLS policies are properly configured

2. **Authentication not working:**
   - Verify your Supabase URL and anon key
   - Check that email authentication is enabled in Supabase

3. **OpenAI API errors:**
   - Verify your OpenAI API key is correct
   - Ensure you have credits/quota remaining

4. **Environment variables not loading:**
   - Make sure your `.env.local` file is in the project root
   - Restart your development server after adding env vars

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Check the Supabase logs in your dashboard
3. Verify all environment variables are correctly set

## Cost Estimates

### Supabase (Free Tier)
- Up to 50,000 monthly active users
- 500MB database storage
- 1GB file storage
- 2GB bandwidth

### OpenAI API
- GPT-3.5-turbo: ~$0.002 per 1k tokens
- GPT-4: ~$0.03 per 1k tokens
- Estimated cost: $1-10/month for moderate usage

## License

This project is for educational/personal use. Please respect OpenAI's and Supabase's terms of service. 