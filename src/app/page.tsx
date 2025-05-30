'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { generateMommyResponse } from '@/lib/openai';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export default function Home() {
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
  const [searchQuery, setSearchQuery] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Get current chat
  const currentChat = chats.find(chat => chat.id === currentChatId);
  const messages = useMemo(() => currentChat?.messages || [], [currentChat?.messages]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create a new chat
  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    // Close sidebar on mobile after creating chat
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const simulateAIResponse = async (userMessage: string, chatId: string) => {
    setIsTyping(true);
    
    try {
      // Get current chat history for context
      const currentChat = chats.find(chat => chat.id === chatId);
      const conversationHistory = currentChat?.messages.map(msg => ({
        content: msg.content,
        isUser: msg.isUser
      })) || [];

      const response = await generateMommyResponse(userMessage, conversationHistory);
      
      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        content: response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, messages: [...chat.messages, aiMessage], updatedAt: new Date() }
          : chat
      ));
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback message if something goes wrong
      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        content: "Oh sweetie, I'm having a little trouble right now, but I'm here for you! Please try again in a moment. Remember, you're stronger than you know! 💕",
        isUser: false,
        timestamp: new Date(),
      };
      
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, messages: [...chat.messages, aiMessage], updatedAt: new Date() }
          : chat
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      let chatId = currentChatId;
      
      // Create new chat if none exists
      if (!chatId) {
        const newChat: Chat = {
          id: Date.now().toString(),
          title: message.slice(0, 30) + (message.length > 30 ? '...' : ''),
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setChats(prev => [newChat, ...prev]);
        chatId = newChat.id;
        setCurrentChatId(chatId);
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        content: message,
        isUser: true,
        timestamp: new Date(),
      };
      
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              messages: [...chat.messages, userMessage], 
              updatedAt: new Date(),
              title: chat.messages.length === 0 ? message.slice(0, 30) + (message.length > 30 ? '...' : '') : chat.title
            }
          : chat
      ));
      
      simulateAIResponse(message, chatId);
      setMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  };

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    // Close sidebar on mobile after selecting chat
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-pink-50 to-rose-100 overflow-hidden relative">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed md:relative z-50 md:z-auto md:translate-x-0 transition-transform duration-300 w-64 md:w-64 bg-pink-200/90 backdrop-blur-sm text-gray-800 flex flex-col overflow-hidden border-r border-pink-300 h-full`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-pink-300">
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-3 px-3 py-3 bg-pink-300/80 hover:bg-pink-400/80 rounded-lg transition-colors duration-200 text-gray-700 touch-manipulation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium">New chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-pink-300">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search chats"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-pink-300/60 text-gray-800 placeholder-gray-500 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-pink-300/80 text-sm touch-manipulation"
            />
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {filteredChats.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                {searchQuery ? 'No chats found' : 'No chats yet'}
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div 
                  key={chat.id} 
                  className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 touch-manipulation ${
                    currentChatId === chat.id 
                      ? 'bg-pink-400/80 text-gray-800' 
                      : 'hover:bg-pink-300/60 text-gray-700'
                  }`}
                  onClick={() => selectChat(chat.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {chat.title}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {formatTime(chat.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-pink-500/20 rounded transition-all duration-200 touch-manipulation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-pink-300">
          <div className="text-xs text-gray-600 text-center">
            MommyGPT v2.0
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white/50 backdrop-blur-sm border-b border-pink-200 p-3 md:p-4 flex items-center gap-3 md:gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-pink-100 rounded-lg transition-colors duration-200 touch-manipulation"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-base md:text-lg font-medium text-gray-800 truncate">
            {currentChat?.title || 'MommyGPT'}
          </h1>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-hidden">
          <div 
            ref={chatContainerRef}
            className="h-full overflow-y-auto px-3 md:px-4 py-4 md:py-6 space-y-4"
          >
            {messages.length === 0 ? (
              /* Welcome Screen */
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-4xl mx-auto px-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-gray-800 mb-2 tracking-tight leading-tight">
                    What can MommyGPT help you with Darling?
                  </h1>
                </div>
              </div>
            ) : (
              /* Chat Messages */
              <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] sm:max-w-[80%] ${msg.isUser ? '' : ''}`}>
                      {/* Message Bubble */}
                      <div className={`${
                        msg.isUser
                          ? 'bg-pink-200/90 backdrop-blur-sm border border-pink-300 text-gray-800 rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-sm'
                          : 'text-gray-800'
                      }`}>
                        <div className="text-sm md:text-base leading-relaxed">
                          <ReactMarkdown
                            components={{
                              // Paragraphs
                              p: (props) => <p className="mb-2 last:mb-0" {...props} />,
                              
                              // Bold text
                              strong: (props) => <strong className="font-semibold text-gray-900" {...props} />,
                              
                              // Italic text  
                              em: (props) => <em className="italic" {...props} />,
                              
                              // Lists
                              ul: (props) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                              ol: (props) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                              li: (props) => <li className="ml-2" {...props} />,
                              
                              // Headers
                              h1: (props) => <h1 className="text-base md:text-lg font-semibold mb-2" {...props} />,
                              h2: (props) => <h2 className="text-sm md:text-base font-semibold mb-2" {...props} />,
                              h3: (props) => <h3 className="text-sm md:text-base font-medium mb-2" {...props} />,
                              
                              // Code
                              code: (props: React.ComponentProps<'code'> & { inline?: boolean }) => 
                                props.inline 
                                  ? <code className="bg-pink-100 text-pink-800 px-1 py-0.5 rounded text-xs md:text-sm font-mono" {...props} />
                                  : <code className="block bg-pink-100 text-pink-800 p-2 rounded text-xs md:text-sm font-mono mb-2 overflow-x-auto" {...props} />,
                              
                              // Blockquotes
                              blockquote: (props) => (
                                <blockquote className="border-l-4 border-pink-300 pl-4 italic mb-2" {...props} />
                              ),
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                        <p className={`text-xs mt-2 ${
                          msg.isUser ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[85%] sm:max-w-[80%] flex-row gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium bg-white border-2 border-pink-200 text-gray-700">
                          M
                        </div>
                      </div>
                      <div className="bg-white border border-pink-100 rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Input Section */}
        <div className="border-t border-pink-200 bg-white/50 backdrop-blur-sm">
          <div className="w-full max-w-4xl mx-auto px-3 md:px-4 py-3 md:py-4">
            <form onSubmit={handleSubmit} className="relative">
              {/* Input Container */}
              <div className="relative flex items-center bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-pink-200 shadow-lg min-h-[52px] md:min-h-[60px] hover:shadow-xl transition-all duration-300">
                {/* Tools Button - Hidden on small screens */}
                <button 
                  type="button"
                  className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-3 text-gray-500 hover:text-pink-600 transition-colors duration-200 rounded-l-3xl hover:bg-pink-50 touch-manipulation"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span className="text-sm font-medium">Tools</span>
                </button>

                {/* Input Field */}
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask anything"
                  className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-base md:text-lg px-3 md:px-4 py-3 md:py-4 focus:outline-none resize-none touch-manipulation"
                  disabled={isTyping}
                />

                {/* Action Buttons Container */}
                <div className="flex items-center pr-2 md:pr-3">
                  {/* Voice Input Button */}
                  <button 
                    type="button"
                    className="p-2 text-gray-500 hover:text-pink-600 transition-colors duration-200 rounded-full hover:bg-pink-50 touch-manipulation"
                    disabled={isTyping}
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>

                  {/* Send Button (appears when typing) */}
                  {message.trim() && !isTyping && (
                    <button 
                      type="submit"
                      className="ml-1 md:ml-2 p-2 text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-full hover:from-pink-600 hover:to-rose-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl touch-manipulation"
                    >
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Text */}
              <div className="text-center mt-2 md:mt-3">
                <p className="text-xs text-gray-500">
                  MommyGPT can make mistakes. MommyGPT is not your real mommy.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
