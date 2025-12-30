import { useState } from 'react';
import { Send, Sparkles, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

interface CopilotChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
}

export const CopilotChat = ({ messages, onSendMessage, isTyping }: CopilotChatProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-3 pr-1">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`animate-fade-in ${message.role === 'user' ? 'flex justify-end' : ''}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {message.role === 'assistant' ? (
              <div className="terminal-card p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot size={10} className="text-primary" />
                  </div>
                  <span className="text-[10px] text-primary font-bold">AIME</span>
                  <span className="text-[9px] text-muted-foreground">{message.timestamp}</span>
                </div>
                <p className="text-xs leading-relaxed text-foreground/90">
                  {message.content}
                </p>
              </div>
            ) : (
              <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg max-w-[85%]">
                <div className="flex items-center gap-2 mb-2 justify-end">
                  <span className="text-[9px] text-muted-foreground">{message.timestamp}</span>
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <User size={10} className="text-primary" />
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-foreground/90">
                  {message.content}
                </p>
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="terminal-card p-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles size={10} className="text-primary animate-pulse" />
              </div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Aime about the chart..."
            className="w-full bg-background border border-border rounded-lg px-4 py-3 pr-12 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send size={14} />
          </button>
        </div>
        <p className="text-[9px] text-muted-foreground mt-2 text-center">
          Aime analyzes your chart drawings and market context in real-time
        </p>
      </form>
    </div>
  );
};
