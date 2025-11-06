import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CountdownTimerProps {
  onActionClick?: () => void;
}

export default function CountdownTimer({ onActionClick }: CountdownTimerProps) {
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

  const handleActionClick = () => {
    if (onActionClick) {
      onActionClick();
    }
  };

  return (
    <Card className="border-4 border-destructive/30 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-pulse" />
      
      <CardContent className="p-4 sm:p-5 lg:p-6">
        <div className="text-center space-y-4 lg:space-y-5">
          <div className="space-y-2">
            <Badge variant="destructive" className="text-xs sm:text-sm px-3 py-1.5 font-bold animate-pulse">
              <Icon name="Zap" size={16} className="inline mr-1.5" />
              СРОЧНАЯ АКЦИЯ
            </Badge>
            
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-secondary leading-tight">
              Скидка 20%<br className="sm:hidden" /> на ремонт окон
            </h3>
            <p className="text-sm lg:text-base text-muted-foreground font-medium">
              Акция заканчивается через:
            </p>
          </div>

          <div className="flex justify-center gap-1.5 sm:gap-2">
            <div className={`bg-gradient-to-br from-white to-red-50 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 shadow-lg border-2 border-destructive/30 w-[70px] sm:w-[85px] lg:w-[95px] transform transition-all ${isPulsing ? 'animate-pulse scale-105' : ''}`}>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-destructive">
                {formatNumber(hours)}
              </div>
              <div className="text-[9px] sm:text-[10px] lg:text-xs text-muted-foreground font-bold mt-0.5 sm:mt-1 uppercase tracking-wider">
                часов
              </div>
            </div>

            <div className="flex items-center text-xl sm:text-2xl lg:text-3xl font-extrabold text-destructive animate-pulse">
              :
            </div>

            <div className={`bg-gradient-to-br from-white to-orange-50 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 shadow-lg border-2 border-destructive/30 w-[70px] sm:w-[85px] lg:w-[95px] transform transition-all ${isPulsing ? 'animate-pulse scale-105' : ''}`}>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-destructive">
                {formatNumber(minutes)}
              </div>
              <div className="text-[9px] sm:text-[10px] lg:text-xs text-muted-foreground font-bold mt-0.5 sm:mt-1 uppercase tracking-wider">
                минут
              </div>
            </div>

            <div className="flex items-center text-xl sm:text-2xl lg:text-3xl font-extrabold text-destructive animate-pulse">
              :
            </div>

            <div className={`bg-gradient-to-br from-white to-yellow-50 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 shadow-lg border-2 border-destructive/30 w-[70px] sm:w-[85px] lg:w-[95px] transform transition-all ${isPulsing ? 'animate-pulse scale-105' : ''}`}>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-destructive animate-pulse">
                {formatNumber(seconds)}
              </div>
              <div className="text-[9px] sm:text-[10px] lg:text-xs text-muted-foreground font-bold mt-0.5 sm:mt-1 uppercase tracking-wider">
                секунд
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="bg-white/80 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-1.5 border-2 border-orange-200">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base lg:text-lg font-bold text-secondary">
                <Icon name="Gift" size={18} className="text-destructive flex-shrink-0" />
                <span>Экономия до 3 000 ₽</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base font-semibold text-green-600">
                <Icon name="CheckCircle2" size={16} className="flex-shrink-0" />
                <span>+ Бесплатный выезд</span>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full text-sm sm:text-base font-bold px-6 py-5 bg-destructive hover:bg-destructive/90 shadow-xl transform transition-all hover:scale-105"
              onClick={handleActionClick}
            >
              <Icon name="Gift" size={18} className="mr-2" />
              Успеть получить скидку
            </Button>

            <p className="text-[10px] sm:text-xs text-muted-foreground italic leading-tight">
              ⚠️ После окончания таймера цены вернутся к стандартным
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}