import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! I'm Nasuo AI. How can I help you today?", sender: 'bot' }]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input, sender: 'user' }]);
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "Thanks! I'll connect you to a supply chain expert soon.", sender: 'bot' }]);
    }, 500);
    setInput('');
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-[#1F5C4A] p-4 text-white shadow-2xl"
        aria-label="Open AI assistant"
        title="AI Assistant"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M8.5 10.5a3.5 3.5 0 1 1 7 0v3.5h-7v-3.5Z" />
          <circle cx="10.2" cy="11.2" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="13.8" cy="11.2" r="0.8" fill="currentColor" stroke="none" />
          <path d="M9.5 15.8c.7.6 1.5.9 2.5.9s1.8-.3 2.5-.9" />
          <path d="M12 3v2.2" />
        </svg>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 100, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 100, scale: 0.9 }} className="fixed bottom-24 right-6 w-96 max-w-[90vw] glass-panel rounded-2xl shadow-2xl z-50 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-white/20"><span className="font-bold text-primary">Nasuo AI Assistant</span><button onClick={() => setIsOpen(false)}>&times;</button></div>
            <div className="h-80 overflow-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-2 rounded-xl ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-white/30'}`}>{msg.text}</div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/20 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 bg-white/20 rounded-full px-4 py-2 outline-none"
              />
              <button onClick={sendMessage} className="bg-primary text-white px-4 py-2 rounded-full">Send</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
