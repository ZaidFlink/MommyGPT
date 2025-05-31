'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Chat, Message } from '@/lib/types/database';

// Convert database message to app message format
const convertMessage = (dbMessage: {
  id: string;
  content: string;
  is_user: boolean;
  created_at: string;
}): Message => ({
  id: dbMessage.id,
  content: dbMessage.content,
  is_user: dbMessage.is_user,
  created_at: dbMessage.created_at,
});

// Convert database chat to app chat format
const convertChat = (dbChat: {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: Array<{
    id: string;
    content: string;
    is_user: boolean;
    created_at: string;
  }>;
}): Chat => ({
  id: dbChat.id,
  user_id: dbChat.user_id,
  title: dbChat.title,
  created_at: dbChat.created_at,
  updated_at: dbChat.updated_at,
  messages: dbChat.messages?.map(convertMessage) || [],
});

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createClient();

  // Load user's chats
  const loadChats = useCallback(async () => {
    if (!user) {
      setChats([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          messages (*)
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const convertedChats = data?.map(convertChat) || [];
      setChats(convertedChats);
    } catch (err) {
      console.error('Error loading chats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  // Create a new chat
  const createChat = useCallback(async (title: string): Promise<{ chat?: Chat; error?: Error }> => {
    if (!user) return { error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('chats')
      .insert([{ 
        user_id: user.id, 
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) return { error: error as Error };

    const newChat = convertChat({ ...data, messages: [] });
    setChats(prev => [newChat, ...prev]);
    return { chat: newChat };
  }, [user, supabase]);

  // Add a message to a chat
  const addMessage = useCallback(async (chatId: string, content: string, isUser: boolean): Promise<Message | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          content,
          is_user: isUser,
        })
        .select()
        .single();

      if (error) throw error;

      const newMessage = convertMessage(data);
      
      // Update local state
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              messages: [...(chat.messages || []), newMessage],
              updated_at: new Date().toISOString()
            }
          : chat
      ));

      // Update chat's updated_at timestamp
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);

      return newMessage;
    } catch (err) {
      console.error('Error adding message:', err);
      setError(err instanceof Error ? err.message : 'Failed to add message');
      return null;
    }
  }, [user, supabase]);

  // Update chat title
  const updateChatTitle = useCallback(async (chatId: string, title: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('chats')
        .update({ 
          title: title.slice(0, 100),
          updated_at: new Date().toISOString()
        })
        .eq('id', chatId)
        .eq('user_id', user.id);

      if (error) throw error;

      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, title: title.slice(0, 100) }
          : chat
      ));

      return true;
    } catch (err) {
      console.error('Error updating chat title:', err);
      setError(err instanceof Error ? err.message : 'Failed to update chat');
      return false;
    }
  }, [user, supabase]);

  // Delete a chat
  const deleteChat = useCallback(async (chatId: string): Promise<{ error?: Error }> => {
    if (!user) return { error: new Error('User not authenticated') };

    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId)
      .eq('user_id', user.id);

    if (error) return { error: error as Error };

    setChats(prev => prev.filter(chat => chat.id !== chatId));
    return {};
  }, [user, supabase]);

  // Load chats when user changes
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  return {
    chats,
    loading,
    error,
    createChat,
    addMessage,
    updateChatTitle,
    deleteChat,
    refreshChats: loadChats,
  };
} 