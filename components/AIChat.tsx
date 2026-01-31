
import React, { useState, useRef, useEffect } from 'react';
import { Send, Cross, MessageSquareQuote } from 'lucide-react';
import { getSpiritualGuidance } from '../services/geminiService';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([
    { text: "Bendiciones. Soy tu asistente espiritual. ¿En qué puedo ayudarte hoy? ¿Necesitas una oración o un consejo bíblico?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setIsTyping(true);

    const botResponse = await getSpiritualGuidance(userMsg);
    setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-blue-900 p-4 text-white flex items-center gap-3">
        <div className="p-2 bg-yellow-500 rounded-full">
          <Cross size={20} className="text-blue-900" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Capellán Digital</h3>
          <p className="text-xs text-blue-200">Guía espiritual 24/7</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-blue-50/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${m.isBot ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' : 'bg-blue-600 text-white rounded-tr-none'}`}>
              <p className="text-sm leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu petición de oración..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleSend}
          className="bg-blue-900 text-white p-2 rounded-full hover:bg-blue-800 transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default AIChat;
