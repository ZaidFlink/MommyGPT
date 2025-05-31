# MommyGPT 💕

A caring AI assistant with a motherly touch, featuring user authentication and persistent chat history. Built with Next.js 15, Supabase, and OpenAI.

![MommyGPT Interface](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js) ![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green?style=for-the-badge&logo=supabase) ![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=for-the-badge&logo=typescript)

## ✨ Features

### 🎯 Core Functionality
- **Smart AI Assistant**: Warm, caring, and understanding virtual companion
- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Persistent Chat History**: All conversations saved and synced across devices
- **Multi-Chat Management**: Create, search, and organize multiple conversations
- **Real-time Updates**: Instant message delivery and status updates

### 🎨 User Experience
- **ChatGPT-style Interface**: Familiar and intuitive chat design
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **Beautiful UI**: Modern glass-morphism effects with pink theme
- **Fast Performance**: Optimized with Next.js 15 and React 18
- **Touch-Friendly**: Designed for mobile-first interaction

### 🔐 Security & Privacy
- **Row-Level Security**: Users can only access their own data
- **Secure Authentication**: Powered by Supabase Auth
- **Data Isolation**: Complete separation between user accounts
- **Type Safety**: Full TypeScript implementation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and Yarn
- OpenAI API key
- Supabase account (free tier works great!)

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/mommygpt.git
cd mommygpt/MommyGPT
yarn install
```

### 2. Environment Setup
Create a `.env` file in the MommyGPT directory:

```bash
# OpenAI API
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
1. Create a new Supabase project
2. Run the SQL script from `supabase-setup.sql` in your Supabase SQL editor
3. Disable email confirmation in Supabase Auth settings (optional, for easier testing)

### 4. Run Development Server
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see MommyGPT in action!

## 📖 Detailed Setup

For comprehensive setup instructions, see our documentation:
- **[SETUP.md](SETUP.md)** - Complete setup guide
- **[QUICK-START.md](QUICK-START.md)** - 5-minute setup checklist
- **[DATABASE-FLOW.md](DATABASE-FLOW.md)** - Database architecture explanation

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o-mini
- **State Management**: React Context + Custom Hooks
- **Type Safety**: Full TypeScript coverage

### Database Schema
```
auth.users (Supabase managed)
└── public.users (user profiles)
    └── public.chats
        └── public.messages
```

### Key Features
- **Automatic Profile Creation**: Database triggers handle user profile setup
- **Row-Level Security**: Postgres RLS policies ensure data privacy
- **Real-time Updates**: Optimistic UI updates with database sync
- **Error Handling**: Comprehensive error boundaries and fallbacks

## 🎛️ Configuration

### OpenAI Settings
- **Model**: GPT-4o-mini (cost-optimized)
- **Personality**: Comfort-focused with advice when requested
- **Context**: Maintains conversation history for better responses

### Supabase Features Used
- **Authentication**: Email/password with optional email verification
- **Database**: PostgreSQL with RLS
- **Real-time**: Automatic UI updates (can be enabled)
- **Storage**: Ready for file uploads (future enhancement)

## 🔧 Development

### Available Scripts
```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn type-check   # Run TypeScript check
```

### Code Structure
```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   └── auth/           # Authentication components
├── lib/                # Core utilities
│   ├── auth/           # Auth context and providers
│   ├── supabase/       # Database clients
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript definitions
└── styles/             # Global styles
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on each push

### Environment Variables for Production
```bash
NEXT_PUBLIC_OPENAI_API_KEY=your_production_openai_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Configuration
- Set up custom domain (optional)
- Configure email templates
- Set up proper CORS settings
- Enable row-level security policies

## 🛠️ Troubleshooting

### Common Issues
1. **Build Errors**: Run `yarn build` to check for TypeScript issues
2. **Auth Problems**: Verify Supabase keys and URL
3. **Database Issues**: Check RLS policies and user permissions
4. **API Errors**: Confirm OpenAI API key and quota

### Debug Tools
- Use `check-database.js` script to test database connection
- Enable Supabase debug mode in development
- Check browser console for detailed error messages

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing code style
- Add proper error handling
- Update documentation as needed
- Test on multiple devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for the powerful GPT models
- **Supabase** for the amazing backend-as-a-service
- **Vercel** for the excellent deployment platform
- **Next.js team** for the fantastic React framework

## 📞 Support

- Create an issue for bug reports
- Join discussions for feature requests
- Check existing issues before creating new ones

---

Built with 💕 by developers who believe technology should be caring and human-centered.
