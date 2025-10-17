import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(7200);

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

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <Card className="border-4 border-destructive/30 bg-gradient-to-br from-red-50 to-orange-50 shadow-2xl">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <Badge variant="destructive" className="text-sm px-4 py-2 font-bold animate-pulse">
            <Icon name="Clock" size={16} className="inline mr-2" />
            АКЦИЯ ЗАКАНЧИВАЕТСЯ
          </Badge>
          
          <h3 className="text-2xl md:text-3xl font-bold text-secondary">
            Скидка 20% действует еще:
          </h3>

          <div className="flex justify-center gap-3 md:gap-6">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border-2 border-destructive/20 min-w-[80px] md:min-w-[100px]">
              <div className="text-4xl md:text-6xl font-bold text-destructive">
                {formatNumber(hours)}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-semibold mt-2">
                часов
              </div>
            </div>

            <div className="flex items-center text-4xl md:text-6xl font-bold text-destructive">
              :
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border-2 border-destructive/20 min-w-[80px] md:min-w-[100px]">
              <div className="text-4xl md:text-6xl font-bold text-destructive">
                {formatNumber(minutes)}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-semibold mt-2">
                минут
              </div>
            </div>

            <div className="flex items-center text-4xl md:text-6xl font-bold text-destructive">
              :
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border-2 border-destructive/20 min-w-[80px] md:min-w-[100px]">
              <div className="text-4xl md:text-6xl font-bold text-destructive animate-pulse">
                {formatNumber(seconds)}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-semibold mt-2">
                секунд
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <p className="text-base md:text-lg font-semibold text-secondary flex items-center justify-center gap-2">
              <Icon name="Gift" size={20} className="text-destructive" />
              Успейте сэкономить до 3000 рублей!
            </p>
            <p className="text-sm text-muted-foreground">
              После окончания акции цены вернутся к обычным
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
