import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Trash2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithSenior } from '../services/geminiService';

const SeniorBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'senior',
      text: "Sup fresher? 🤖 Senior Bot here. I know everything about this campus. Ask me about canteens, clubs, or how to bunk effectively. Don't waste my time.",
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
  
  const handleClear = () => {
      setMessages([{
        id: Date.now().toString(),
        sender: 'senior',
        text: "Chat cleared. Memory wiped. What do you want now?",
        timestamp: new Date()
      }]);
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
          <div className="p-4 bg-cyan-950/50 border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400/50 relative">
                  <Bot className="text-cyan-400" size={20} />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-black"></div>
                </div>
                <div>
                  <h3 className="font-bold text-white">Senior Bot</h3>
                  <p className="text-[10px] text-cyan-300 font-mono tracking-wider uppercase">Online • Lvl. 99</p>
                </div>
            </div>
            <button onClick={handleClear} className="text-slate-400 hover:text-white transition-colors" title="Clear Chat">
                <Trash2 size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap font-mono ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600/90 text-white rounded-br-none shadow-[0_0_10px_rgba(8,145,178,0.3)]'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-bl-none shadow-[0_0_10px_rgba(30,41,59,0.3)]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/90 p-4 rounded-2xl rounded-bl-none border border-slate-700 flex gap-2 items-center">
                   <div className="text-xs text-cyan-400 font-mono animate-pulse">GENERATING_RESPONSE...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-700 bg-black/60 backdrop-blur-sm">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about canteens, bunking..."
                className="flex-1 bg-slate-900/80 border border-slate-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono placeholder:text-slate-600"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="p-2 bg-cyan-600 rounded-full text-white hover:bg-cyan-500 disabled:opacity-50 transition-all shadow-[0_0_10px_rgba(8,145,178,0.4)]"
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