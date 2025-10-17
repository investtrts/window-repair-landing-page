import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
  image: string;
}

export default function WorkflowSteps() {
  const steps: Step[] = [
    {
      number: 1,
      title: 'Оставьте заявку',
      description: 'Позвоните, напишите в чат или заполните форму на сайте. Это займёт 30 секунд.',
      icon: 'Phone',
      image: 'https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/91c37ca1-cafa-446d-9a3a-7dfa286b8bb2.jpg'
    },
    {
      number: 2,
      title: 'Приезд мастера',
      description: 'Специалист приедет в удобное время, проведёт диагностику и озвучит точную стоимость.',
      icon: 'CarFront',
      image: 'https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/163b62e8-fe4b-4776-8d71-fe9aa181e6da.jpg'
    },
    {
      number: 3,
      title: 'Выполнение работы',
      description: 'Мастер устраняет проблему на месте. Большинство работ занимает 15-60 минут.',
      icon: 'Wrench',
      image: 'https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/22bda8d9-24c4-4794-b3af-6451a77e6a15.jpg'
    },
    {
      number: 4,
      title: 'Приёмка и оплата',
      description: 'Вы принимаете работу, получаете гарантийный талон и оплачиваете только после завершения.',
      icon: 'CheckCircle2',
      image: 'https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/0e85c6e6-b513-4175-b7af-ac6663e71033.jpg'
    }
  ];

  return (
    <div className="relative">
      <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary -translate-y-1/2 z-0"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative z-10">
        {steps.map((step) => (
          <Card 
            key={step.number}
            className="border-2 border-primary/20 hover:border-primary transition-all hover:shadow-xl bg-white group"
          >
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  {step.number}
                </div>
                <div className="pt-10 pb-4">
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 mb-4">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto">
                    <Icon name={step.icon as any} className="text-primary" size={32} />
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-secondary mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

              {step.number === 1 && (
                <Badge variant="destructive" className="mt-4">
                  <Icon name="Gift" size={14} className="inline mr-1" />
                  Скидка 20% сегодня
                </Badge>
              )}
              {step.number === 2 && (
                <Badge variant="default" className="mt-4">
                  <Icon name="Check" size={14} className="inline mr-1" />
                  Выезд бесплатно
                </Badge>
              )}
              {step.number === 3 && (
                <Badge variant="secondary" className="mt-4">
                  <Icon name="Clock" size={14} className="inline mr-1" />
                  Быстро и качественно
                </Badge>
              )}
              {step.number === 4 && (
                <Badge variant="outline" className="mt-4">
                  <Icon name="Shield" size={14} className="inline mr-1" />
                  Гарантия от 1 года
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
