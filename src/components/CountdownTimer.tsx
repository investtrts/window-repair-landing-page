import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(7200);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const savedEndTime = localStorage.getItem('discountEndTime');
    const now = Date.now();
    
    if (savedEndTime) {
      const endTime = parseInt(savedEndTime);
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(remaining);
    } else {
      const newEndTime = now + 7200 * 1000;
      localStorage.setItem('discountEndTime', newEndTime.toString());
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          const newEndTime = Date.now() + 7200 * 1000;
          localStorage.setItem('discountEndTime', newEndTime.toString());
          return 7200;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft < 600) {
      setIsPulsing(true);
    }
  }, [timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  const handleCallClick = () => {
    window.location.href = 'tel:+79999999999';
  };

  return (
    <Card className="border-4 border-destructive/30 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-pulse" />
      
      <CardContent className="p-6 md:p-8">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <Badge variant="destructive" className="text-sm md:text-base px-4 py-2 font-bold animate-pulse">
              <Icon name="Zap" size={18} className="inline mr-2" />
              СРОЧНАЯ АКЦИЯ
            </Badge>
            
            <h3 className="text-2xl md:text-4xl font-extrabold text-secondary">
              Скидка 20% на ремонт окон
            </h3>
            <p className="text-base md:text-lg text-muted-foreground font-medium">
              Акция заканчивается через:
            </p>
          </div>

          <div className="flex justify-center gap-2 md:gap-4">
            <div className={`bg-gradient-to-br from-white to-red-50 rounded-2xl p-3 md:p-6 shadow-xl border-3 border-destructive/30 min-w-[70px] md:min-w-[110px] transform transition-all ${isPulsing ? 'animate-pulse scale-105' : ''}`}>
              <div className="text-3xl md:text-6xl font-extrabold text-destructive">
                {formatNumber(hours)}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-bold mt-1 md:mt-2 uppercase tracking-wider">
                часов
              </div>
            </div>

            <div className="flex items-center text-3xl md:text-6xl font-extrabold text-destructive animate-pulse">
              :
            </div>

            <div className={`bg-gradient-to-br from-white to-orange-50 rounded-2xl p-3 md:p-6 shadow-xl border-3 border-destructive/30 min-w-[70px] md:min-w-[110px] transform transition-all ${isPulsing ? 'animate-pulse scale-105' : ''}`}>
              <div className="text-3xl md:text-6xl font-extrabold text-destructive">
                {formatNumber(minutes)}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-bold mt-1 md:mt-2 uppercase tracking-wider">
                минут
              </div>
            </div>

            <div className="flex items-center text-3xl md:text-6xl font-extrabold text-destructive animate-pulse">
              :
            </div>

            <div className={`bg-gradient-to-br from-white to-yellow-50 rounded-2xl p-3 md:p-6 shadow-xl border-3 border-destructive/30 min-w-[70px] md:min-w-[110px] transform transition-all ${isPulsing ? 'animate-pulse scale-105' : ''}`}>
              <div className="text-3xl md:text-6xl font-extrabold text-destructive animate-pulse">
                {formatNumber(seconds)}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-bold mt-1 md:mt-2 uppercase tracking-wider">
                секунд
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="bg-white/80 rounded-xl p-4 space-y-2 border-2 border-orange-200">
              <div className="flex items-center justify-center gap-2 text-lg md:text-xl font-bold text-secondary">
                <Icon name="Gift" size={24} className="text-destructive" />
                Экономия до 3 000 ₽
              </div>
              <div className="flex items-center justify-center gap-2 text-base md:text-lg font-semibold text-green-600">
                <Icon name="CheckCircle2" size={20} />
                + Бесплатный выезд мастера
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full md:w-auto text-base md:text-lg font-bold px-8 py-6 bg-destructive hover:bg-destructive/90 shadow-xl transform transition-all hover:scale-105"
              onClick={handleCallClick}
            >
              <Icon name="Phone" size={22} className="mr-2" />
              Успеть получить скидку
            </Button>

            <p className="text-xs md:text-sm text-muted-foreground italic">
              ⚠️ После окончания таймера цены вернутся к стандартным
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}