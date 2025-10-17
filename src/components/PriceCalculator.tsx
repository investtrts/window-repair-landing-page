import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface CalculatorState {
  serviceType: string;
  windowCount: number;
  urgency: string;
}

export default function PriceCalculator() {
  const [state, setState] = useState<CalculatorState>({
    serviceType: '',
    windowCount: 1,
    urgency: 'standard'
  });

  const [showResult, setShowResult] = useState(false);

  const services = [
    { id: 'adjustment', name: 'Регулировка окон', basePrice: 500 },
    { id: 'seal', name: 'Замена уплотнителя', basePrice: 800 },
    { id: 'hardware', name: 'Замена фурнитуры', basePrice: 1200 },
    { id: 'glass', name: 'Замена стеклопакета', basePrice: 3500 },
    { id: 'handle', name: 'Замена ручки', basePrice: 400 },
    { id: 'sill', name: 'Ремонт подоконника', basePrice: 1500 }
  ];

  const urgencyMultiplier = {
    standard: 1,
    today: 1.3,
    urgent: 1.5
  };

  const calculatePrice = () => {
    const service = services.find(s => s.id === state.serviceType);
    if (!service) return 0;

    const baseTotal = service.basePrice * state.windowCount;
    const urgencyFactor = urgencyMultiplier[state.urgency as keyof typeof urgencyMultiplier];
    const total = baseTotal * urgencyFactor;

    const discount = 0.2;
    return Math.round(total * (1 - discount));
  };

  const getOriginalPrice = () => {
    const service = services.find(s => s.id === state.serviceType);
    if (!service) return 0;

    const baseTotal = service.basePrice * state.windowCount;
    const urgencyFactor = urgencyMultiplier[state.urgency as keyof typeof urgencyMultiplier];
    return Math.round(baseTotal * urgencyFactor);
  };

  const handleCalculate = () => {
    if (state.serviceType) {
      setShowResult(true);
    }
  };

  return (
    <Card className="border-2 border-primary/20 shadow-2xl max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-yellow-50 border-b-2 border-primary/20">
        <div className="text-center">
          <Badge variant="default" className="mb-3 text-sm px-4 py-1">
            <Icon name="Calculator" size={16} className="inline mr-1" />
            Онлайн-калькулятор
          </Badge>
          <CardTitle className="text-2xl md:text-3xl font-bold text-secondary">
            Узнайте стоимость ремонта за 30 секунд
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">Точный расчёт без скрытых платежей</p>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-semibold text-secondary">
            1️⃣ Выберите тип услуги
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {services.map(service => (
              <button
                key={service.id}
                onClick={() => {
                  setState({ ...state, serviceType: service.id });
                  setShowResult(false);
                }}
                className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                  state.serviceType === service.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <p className="font-semibold text-secondary">{service.name}</p>
                <p className="text-sm text-muted-foreground">от {service.basePrice} ₽</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-secondary">
            2️⃣ Количество окон
          </Label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setState({ ...state, windowCount: Math.max(1, state.windowCount - 1) })}
              className="h-12 w-12"
            >
              <Icon name="Minus" size={20} />
            </Button>
            <div className="flex-1 text-center">
              <p className="text-4xl font-bold text-primary">{state.windowCount}</p>
              <p className="text-sm text-muted-foreground">окон(о)</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setState({ ...state, windowCount: Math.min(20, state.windowCount + 1) })}
              className="h-12 w-12"
            >
              <Icon name="Plus" size={20} />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-secondary">
            3️⃣ Срочность выполнения
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => {
                setState({ ...state, urgency: 'standard' });
                setShowResult(false);
              }}
              className={`p-4 rounded-lg border-2 text-center transition-all hover:shadow-md ${
                state.urgency === 'standard'
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Icon name="Calendar" className="mx-auto mb-2 text-primary" size={24} />
              <p className="font-semibold text-secondary">Обычная</p>
              <p className="text-xs text-muted-foreground">1-2 дня</p>
            </button>
            <button
              onClick={() => {
                setState({ ...state, urgency: 'today' });
                setShowResult(false);
              }}
              className={`p-4 rounded-lg border-2 text-center transition-all hover:shadow-md ${
                state.urgency === 'today'
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Icon name="Clock" className="mx-auto mb-2 text-primary" size={24} />
              <p className="font-semibold text-secondary">Сегодня</p>
              <p className="text-xs text-muted-foreground">+30% к цене</p>
            </button>
            <button
              onClick={() => {
                setState({ ...state, urgency: 'urgent' });
                setShowResult(false);
              }}
              className={`p-4 rounded-lg border-2 text-center transition-all hover:shadow-md ${
                state.urgency === 'urgent'
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Icon name="Zap" className="mx-auto mb-2 text-primary" size={24} />
              <p className="font-semibold text-secondary">Срочно</p>
              <p className="text-xs text-muted-foreground">2-4 часа, +50%</p>
            </button>
          </div>
        </div>

        <Button
          onClick={handleCalculate}
          disabled={!state.serviceType}
          className="w-full h-14 text-lg font-bold"
          size="lg"
        >
          <Icon name="Calculator" className="mr-2" size={24} />
          Рассчитать стоимость
        </Button>

        {showResult && state.serviceType && (
          <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-3">
              <Icon name="CheckCircle2" className="mx-auto text-green-600" size={48} />
              <p className="text-lg font-semibold text-secondary">Стоимость ремонта:</p>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground line-through">
                  Без скидки: {getOriginalPrice().toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-5xl font-bold text-green-600">
                  {calculatePrice().toLocaleString('ru-RU')} ₽
                </p>
                <Badge variant="destructive" className="text-sm px-3 py-1">
                  Скидка 20% применена!
                </Badge>
              </div>
              <div className="pt-4 space-y-2">
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Icon name="Check" size={16} className="text-green-600" />
                  Выезд мастера бесплатно
                </p>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Icon name="Check" size={16} className="text-green-600" />
                  Гарантия от 1 года
                </p>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Icon name="Check" size={16} className="text-green-600" />
                  Оплата после работы
                </p>
              </div>
              <Button
                onClick={() => {
                  const phone = '79234567890';
                  const message = `Здравствуйте! Рассчитал стоимость: ${calculatePrice().toLocaleString('ru-RU')} ₽. Хочу оформить заказ.`;
                  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="w-full mt-4 h-12 text-base font-bold"
                size="lg"
              >
                <Icon name="MessageCircle" className="mr-2" size={20} />
                Заказать по этой цене
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
