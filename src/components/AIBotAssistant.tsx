import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Bot, 
  Send, 
  User, 
  Mic,
  MoreVertical,
  HelpCircle,
  Lightbulb,
  TrendingUp,
  Droplets,
  Leaf
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export const AIBotAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm AquaBot, your AI assistant for groundwater monitoring. I can help you with water conservation tips, explain data trends, and answer questions about groundwater management. How can I assist you today?",
      timestamp: new Date(),
      suggestions: [
        "Water conservation tips",
        "Explain my water data",
        "Rainwater harvesting",
        "Irrigation efficiency"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    {
      icon: Droplets,
      question: "How can I conserve water at home?",
      category: "Conservation"
    },
    {
      icon: TrendingUp,
      question: "What do my water level trends mean?",
      category: "Analysis"
    },
    {
      icon: Leaf,
      question: "Best practices for rainwater harvesting?",
      category: "Sustainability"
    },
    {
      icon: HelpCircle,
      question: "How does groundwater depletion affect crops?",
      category: "Agriculture"
    }
  ];

  const botResponses: Record<string, string> = {
    "water conservation": "Here are some effective water conservation tips:\n\n1. **Fix leaks immediately** - A dripping tap can waste 15 liters per day\n2. **Use water-efficient fixtures** - Install low-flow faucets and dual-flush toilets\n3. **Collect rainwater** - Set up simple collection systems for garden use\n4. **Reuse greywater** - Use washing machine water for plants\n5. **Time your irrigation** - Water plants early morning or evening\n\nWould you like specific tips for your user type?",
    
    "water data": "Based on your location data, here's what your water trends indicate:\n\n📉 **Current Status**: Your local groundwater level is at 42.5m depth\n📊 **Trend**: Declining by 2.7m over the past week\n⚠️ **Alert Level**: Warning - requires attention\n\n**What this means**:\n- Water table is dropping faster than normal\n- Consider implementing conservation measures\n- Monitor usage patterns\n\nWould you like specific recommendations for your area?",
    
    "rainwater harvesting": "Rainwater harvesting is a great way to supplement groundwater! Here's how to get started:\n\n🏠 **For Homes**:\n- Install roof gutters with downspouts\n- Set up storage tanks (1000L minimum)\n- Add first-flush diverters for quality\n\n🌾 **For Farms**:\n- Create contour bunds to slow runoff\n- Build farm ponds for collection\n- Use drip irrigation with collected water\n\n💧 **Benefits**:\n- Reduces groundwater dependence\n- Provides backup water source\n- Helps recharge local aquifers\n\nNeed help designing a system for your property?",
    
    "crop irrigation": "Smart irrigation can reduce water usage by 30-50%! Here are the best practices:\n\n🌱 **Drip Irrigation**:\n- Direct water to root zones\n- Reduces evaporation losses\n- Can be automated with timers\n\n📅 **Timing**:\n- Early morning (5-7 AM) is best\n- Avoid midday watering\n- Check soil moisture before watering\n\n🌾 **Crop Selection**:\n- Choose drought-resistant varieties\n- Practice crop rotation\n- Use mulching to retain moisture\n\nWhat type of crops are you growing?",
    
    "default": "I understand you're asking about groundwater management. While I may not have specific information about that topic, I can help you with:\n\n• Water conservation strategies\n• Understanding water level data\n• Rainwater harvesting techniques\n• Irrigation best practices\n• Environmental impact assessment\n\nCould you rephrase your question or choose from these topics?"
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('conserv') || lowerMessage.includes('save') || lowerMessage.includes('tips')) {
      return botResponses["water conservation"];
    }
    if (lowerMessage.includes('data') || lowerMessage.includes('level') || lowerMessage.includes('trend')) {
      return botResponses["water data"];
    }
    if (lowerMessage.includes('rainwater') || lowerMessage.includes('harvest') || lowerMessage.includes('collect')) {
      return botResponses["rainwater harvesting"];
    }
    if (lowerMessage.includes('crop') || lowerMessage.includes('farm') || lowerMessage.includes('irrigat')) {
      return botResponses["crop irrigation"];
    }
    
    return botResponses["default"];
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate and add bot response
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: generateResponse(content),
      timestamp: new Date(),
      suggestions: content.toLowerCase().includes('conserv') ? [
        "Drip irrigation setup",
        "Greywater systems",
        "Smart meters",
        "Leak detection"
      ] : undefined
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">AquaBot Assistant</h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="p-4 bg-muted/30">
          <h3 className="text-sm font-medium mb-3">Quick Questions</h3>
          <div className="grid grid-cols-1 gap-2">
            {quickQuestions.map((item, index) => {
              const Icon = item.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto p-3 text-left"
                  onClick={() => handleQuickQuestion(item.question)}
                >
                  <Icon className="w-4 h-4 mr-3 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{item.question}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[80%] rounded-lg p-3 
                    ${message.type === 'user' 
                      ? 'bg-primary text-primary-foreground ml-12' 
                      : 'bg-card border border-border mr-12'
                    }
                  `}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'bot' && (
                      <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium">Suggested follow-ups:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary/10"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-lg p-3 mr-12">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4 pb-24">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about water conservation, data analysis, or any groundwater topic..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            className="h-10 px-4 bg-gradient-to-r from-primary to-secondary"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};