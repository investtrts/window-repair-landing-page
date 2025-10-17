import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'operator';
  time: string;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Здравствуйте! Я Анна, ваш персональный консультант. Чем могу помочь?',
      sender: 'operator',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    'Сколько стоит ремонт?',
    'Когда приедет мастер?',
    'Какая гарантия?',
    'Работаете в выходные?'
  ];

  const autoResponses: { [key: string]: string } = {
    'Сколько стоит ремонт?': 'Стоимость зависит от типа работ: регулировка от 500₽, замена уплотнителя от 800₽, замена фурнитуры от 1200₽. Сейчас действует скидка 20%! Воспользуйтесь калькулятором на сайте для точного расчета.',
    'Когда приедет мастер?': 'Мастер может приехать сегодня в течение 2-4 часов или в удобное для вас время завтра. Оставьте заявку, и мы согласуем точное время!',
    'Какая гарантия?': 'Даем официальную гарантию от 1 года на все работы. На некоторые услуги гарантия до 2-3 лет. Все прописывается в договоре.',
    'Работаете в выходные?': 'Да, работаем ежедневно с 8:00 до 20:00, включая выходные и праздники. Для срочных случаев можем выехать и позже!'
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: text,
      sender: 'user',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = autoResponses[text] || 'Спасибо за вопрос! Один момент, сейчас уточню информацию. Также можете позвонить нам: +7 (950) 577-00-33';
      
      const operatorMessage: Message = {
        id: messages.length + 2,
        text: response,
        sender: 'operator',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, operatorMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
          size="icon"
        >
          <Icon name="MessageCircle" size={28} />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] shadow-2xl flex flex-col">
          <CardHeader className="bg-primary text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Icon name="User" className="text-primary" size={20} />
                </div>
                <div>
                  <CardTitle className="text-base">Анна</CardTitle>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Онлайн
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-primary-dark"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs text-center text-muted-foreground font-semibold">Быстрые вопросы:</p>
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    variant="outline"
                    className="w-full text-left text-sm h-auto py-2 px-3 justify-start"
                    size="sm"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>

          <div className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                placeholder="Введите сообщение..."
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim()}
                size="icon"
              >
                <Icon name="Send" size={20} />
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Обычно отвечаем за 1-2 минуты
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
