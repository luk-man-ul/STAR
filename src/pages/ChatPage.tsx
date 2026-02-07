import React, { useState } from 'react';
import { MessageCircle, Send, Phone, Mail } from 'lucide-react';

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Welcome to our stitching center. How can I help you today?",
      sender: 'support',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate support response
    setTimeout(() => {
      const supportResponse = {
        id: messages.length + 2,
        text: "Thank you for your message! Our team will get back to you shortly. For urgent matters, please call us directly.",
        sender: 'support',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, supportResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex items-center">
          <MessageCircle className="w-6 h-6 text-rose-600 mr-3" />
          <div>
            <h1 className="text-xl font-bold text-slate-800">Chat Support</h1>
            <p className="text-sm text-slate-600">We're here to help</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-slate-800 border border-slate-200'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === 'user' ? 'text-rose-100' : 'text-slate-500'
              }`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Options */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="mb-4">
          <h3 className="font-medium text-slate-800 mb-2">Other ways to reach us:</h3>
          <div className="flex space-x-4">
            <a
              href="tel:+1234567890"
              className="flex items-center px-3 py-2 bg-rose-50 text-rose-600 rounded-full text-sm hover:bg-rose-100 transition-colors"
            >
              <Phone className="w-4 h-4 mr-1" />
              Call Us
            </a>
            <a
              href="mailto:support@stitchingcenter.com"
              className="flex items-center px-3 py-2 bg-rose-50 text-rose-600 rounded-full text-sm hover:bg-rose-100 transition-colors"
            >
              <Mail className="w-4 h-4 mr-1" />
              Email
            </a>
          </div>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 text-base border border-slate-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white min-h-[48px]"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-4 py-3 bg-rose-600 text-white rounded-2xl hover:bg-rose-700 transition-colors min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;