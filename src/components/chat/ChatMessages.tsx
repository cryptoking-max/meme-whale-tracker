
import { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle } from 'lucide-react';

interface Message {
  timestamp: Date;
  type: 'visitor' | 'admin';
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isOpen: boolean;
}

// Function to check if a string contains only emojis
const isEmojiOnly = (text: string): boolean => {
  const emojiRegex = /^[\p{Emoji}\s]+$/u;
  const trimmedText = text.trim();
  return emojiRegex.test(trimmedText) && trimmedText.length > 0;
};

export const ChatMessages = ({ messages, isOpen }: ChatMessagesProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or chat opens
  useEffect(() => {
    if (messagesEndRef.current && (messages.length > 0 || isOpen)) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            <MessageCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>Start a conversation!</p>
            <p className="text-xs mt-1">Messages are sent via WebSocket for real-time support.</p>
          </div>
        ) : (
          messages.map((message) => {
            const isEmoji = isEmojiOnly(message.content);
            
            return (
              <div
                key={`${message.timestamp.getTime()}-${message.type}`}
                className={`flex ${message.type === 'visitor' ? 'justify-end' : 'justify-start'}`}
              >
                {isEmoji ? (
                  // Large emoji display without background
                  <div className="text-4xl py-2">
                    {message.content}
                  </div>
                ) : (
                  // Regular message with background
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                      message.type === 'visitor'
                        ? 'bg-glow-green text-midnight rounded-br-md'
                        : 'bg-muted/80 text-foreground rounded-bl-md border border-muted/40'
                    }`}
                  >
                    <div className="break-words">{message.content}</div>
                    <div className={`text-xs mt-1.5 opacity-70 ${message.type === 'visitor' ? 'text-midnight/70' : 'text-muted-foreground'}`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                      {message.type === 'admin' && (
                        <span className="ml-1 font-medium">• Support</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
