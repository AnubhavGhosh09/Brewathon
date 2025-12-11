import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithSenior } from '../services/geminiService';

const SeniorBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'senior',
      text: "Sup fresher? 🤖 I'm Senior Bot. I run on Canteen Gobi Manchurian and pure chaos. Listen up: Maintain 85% attendance or you're absolutely cooked. No cap. What's the tea?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Convert chat history for API
      const history = messages.map(m => ({
        role: m.sender,
        content: m.text
      }));

      const responseText = await chatWithSenior(userMsg.text, history);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'senior',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-cyan-600'
        }`}
      >
        {isOpen ? <X className="text-white" /> : <MessageCircle className="text-white" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] h-[500px] glass-panel border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-40 animate-[slideUp_0.3s_ease-out]">
          {/* Header */}
          <div className="p-4 bg-cyan-950/50 border-b border-cyan-500/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400/50">
              <Bot className="text-cyan-400" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white">Senior Bot</h3>
              <p className="text-xs text-cyan-300">Online • Sarcastic Mode</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none flex gap-1">
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-700 bg-black/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about canteens, bunking..."
                className="flex-1 bg-slate-900/80 border border-slate-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="p-2 bg-cyan-600 rounded-full text-white hover:bg-cyan-500 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SeniorBot;