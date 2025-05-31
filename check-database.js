// Simple script to check if your Supabase database is set up correctly
// Run with: node check-database.js

const { createClient } = require('@supabase/supabase-js');

// Try to load from .env.local first, then .env
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.log('Make sure you have .env file with:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key');
  console.log('\nAlternatively, you can create .env.local instead of .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 Checking database setup...\n');

  try {
    // Check if tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (tablesError) {
      console.error('❌ Users table not found!');
      console.log('You need to run the SQL setup script in Supabase:');
      console.log('1. Go to Supabase SQL Editor');
      console.log('2. Copy contents from supabase-setup.sql');
      console.log('3. Click Run');
      console.log('\nError:', tablesError.message);
      return;
    }

    console.log('✅ Users table exists');

    // Check chats table
    const { error: chatsError } = await supabase
      .from('chats')
      .select('count')
      .limit(1);

    if (chatsError) {
      console.error('❌ Chats table not found!');
      console.log('Error:', chatsError.message);
      return;
    }

    console.log('✅ Chats table exists');

    // Check messages table
    const { error: messagesError } = await supabase
      .from('messages')
      .select('count')
      .limit(1);

    if (messagesError) {
      console.error('❌ Messages table not found!');
      console.log('Error:', messagesError.message);
      return;
    }

    console.log('✅ Messages table exists');
    console.log('\n🎉 Database setup looks good!');
    console.log('You can now run: yarn dev');

  } catch (error) {
    console.error('❌ Connection error:', error.message);
    console.log('Check your Supabase URL and API key');
  }
}

checkDatabase(); 