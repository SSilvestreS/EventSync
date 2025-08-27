'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User,
  Loader2,
  HelpCircle,
  Calendar,
  Users,
  Settings,
  FileText
} from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [suggestions] = useState([
    'Como criar um evento?',
    'Como gerenciar participantes?',
    'Como gerar QR codes?',
    'Como ver relatórios?',
    'Configurações da conta',
    'Suporte técnico'
  ]);

  // Mensagem inicial
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          type: 'bot',
          content: 'Olá! Sou o assistente virtual do EventSync. Como posso ajudá-lo hoje?',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simular resposta do chatbot com NLP
  const generateBotResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    let response = '';
    
    // Análise simples de intenção (simulando NLP)
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('criar') && lowerMessage.includes('evento')) {
      response = 'Para criar um evento, acesse "Ações Rápidas" > "Criar Evento" ou vá para a página de eventos. Você precisará preencher: nome, data, local, descrição e configurações básicas.';
    } else if (lowerMessage.includes('participantes') || lowerMessage.includes('gerenciar')) {
      response = 'Para gerenciar participantes, vá para "Ações Rápidas" > "Gerenciar Participantes". Lá você pode ver inscrições, fazer check-in, enviar notificações e exportar listas.';
    } else if (lowerMessage.includes('qr') || lowerMessage.includes('código')) {
      response = 'Para gerar QR codes, acesse "Ações Rápidas" > "Gerar QR Codes". Você pode criar códigos para eventos específicos, check-in ou validação de ingressos.';
    } else if (lowerMessage.includes('relatório') || lowerMessage.includes('relatórios')) {
      response = 'Os relatórios estão disponíveis em "Ações Rápidas" > "Ver Relatórios". Você encontrará métricas de eventos, participantes, conversões e análises detalhadas.';
    } else if (lowerMessage.includes('configuração') || lowerMessage.includes('conta')) {
      response = 'Para acessar suas configurações, vá para "Configurações" no menu principal. Lá você pode ajustar notificações, privacidade, tema e integrações.';
    } else if (lowerMessage.includes('ajuda') || lowerMessage.includes('suporte')) {
      response = 'Estou aqui para ajudar! Você pode me perguntar sobre qualquer funcionalidade do EventSync. Se precisar de suporte técnico, entre em contato conosco.';
    } else {
      response = 'Entendo sua pergunta. Posso ajudá-lo com: criação de eventos, gerenciamento de participantes, geração de QR codes, relatórios, configurações e muito mais. Pode reformular sua pergunta?';
    }
    
    return response;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Gerar resposta do bot
    const botResponse = await generateBotResponse(inputValue);
    
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: botResponse,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chatbot */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
            <div className="flex items-center space-x-3">
              <Bot className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Assistente EventSync</h3>
                <p className="text-xs opacity-90">Online • Pronto para ajudar</p>
              </div>
            </div>
            <button
              onClick={toggleChatbot}
              className="text-white hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Digitando...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Sugestões rápidas:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 4).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
