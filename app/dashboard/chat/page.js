'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Bot, Loader } from 'lucide-react';
import { opportunities } from '@/lib/mockData';
import OpportunityCard from '@/components/OpportunityCard';
import GlowButton from '@/components/GlowButton';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 'msg-0',
      role: 'ai',
      content: 'Welcome to LEO AI! 🤖 I\'m your intelligent assistant and I can help you with:\n\n💼 Career opportunities - internships, jobs, hackathons\n📚 Learning & development advice\n💡 Technical questions\n🎯 General queries and guidance\n\nWhat would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // Call the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: history
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      
      // Check for opportunities mentioned in response
      let opportunities_mentioned = [];
      if (data.message && data.message.toLowerCase().includes('oppor')) {
        opportunities_mentioned = opportunities.slice(0, 3).map(o => o.id);
      }

      const aiMsg = {
        id: `msg-${Date.now() + 1}`,
        role: 'ai',
        content: data.message,
        opportunities: opportunities_mentioned,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat Error:', error);
      
      const errorMsg = {
        id: `msg-${Date.now() + 1}`,
        role: 'ai',
        content: '❌ Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto w-full relative">
      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-6 pb-32">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-[10px] font-bold mr-3 mt-1 flex-shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                🤖
              </div>
            )}
            <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-[rgba(59,130,246,0.15)] text-white'
                    : 'bg-[rgba(17,17,17,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] text-[var(--text-primary)]'
                }`}
                style={{
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
                }}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                
                {msg.opportunities && msg.opportunities.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {msg.opportunities.map(id => {
                      const opp = opportunities.find(o => o.id === id);
                      if (!opp) return null;
                      return (
                        <div key={id} className="w-full max-w-sm">
                          <OpportunityCard opportunity={opp} compact={true} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1 mx-1">
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start items-end"
          >
            <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-[10px] font-bold mr-3 mt-1 flex-shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              🤖
            </div>
            <div className="bg-[rgba(17,17,17,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] px-4 py-3" style={{ borderRadius: '16px 16px 16px 4px' }}>
              <div className="flex space-x-1">
                <motion.div className="w-2 h-2 rounded-full bg-[var(--text-secondary)]" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                <motion.div className="w-2 h-2 rounded-full bg-[var(--text-secondary)]" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                <motion.div className="w-2 h-2 rounded-full bg-[var(--text-secondary)]" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent">
        <div className="glass-card rounded-2xl flex items-end p-2 border border-[rgba(255,255,255,0.08)] bg-[rgba(17,17,17,0.8)] backdrop-blur-xl shadow-lg">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(input);
              }
            }}
            placeholder="Ask LEO AI anything... (jobs, learning, advice, etc.)"
            className="w-full bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] resize-none py-3 px-4 max-h-32 text-sm leading-relaxed"
            rows={1}
            style={{ minHeight: '48px' }}
            disabled={isLoading}
          />
          <GlowButton
            variant="primary"
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 p-0 rounded-xl flex items-center justify-center shrink-0 mb-1 mr-1"
          >
            {isLoading ? <Loader size={18} className="animate-spin" /> : <ArrowUp size={18} />}
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
