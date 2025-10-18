import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

const PricingSection = () => {
  const pricingTiers = [
    {
      name: "Базовый",
      description: "Для простого ремонта",
      price: "от 800",
      popular: false,
      features: [
        "Регулировка фурнитуры",
        "Смазка механизмов",
        "Диагностика неисправностей",
        "Консультация мастера",
        "Гарантия 6 месяцев"
      ],
      icon: "Wrench"
    },
    {
      name: "Стандарт",
      description: "Самый популярный",
      price: "от 2 500",
      popular: true,
      features: [
        "Всё из пакета 'Базовый'",
        "Замена уплотнителей",
        "Ремонт фурнитуры",
        "Устранение продувания",
        "Регулировка створок",
        "Гарантия 1 год"
      ],
      icon: "Star"
    },
    {
      name: "Премиум",
      description: "Комплексное решение",
      price: "от 5 000",
      popular: false,
      features: [
        "Всё из пакета 'Стандарт'",
        "Замена стеклопакетов",
        "Полная замена фурнитуры",
        "Энергосберегающие решения",
        "Шумоизоляция",
        "Приоритетный выезд",
        "Гарантия 2 года"
      ],
      icon: "Crown"
    }
  ];

  const additionalServices = [
    { name: "Замена ручки", price: "500" },
    { name: "Замена петель", price: "800" },
    { name: "Замена уплотнителя (1 окно)", price: "600" },
    { name: "Регулировка створки", price: "400" },
    { name: "Ремонт москитной сетки", price: "300" },
    { name: "Выезд мастера", price: "Бесплатно" }
  ];

  const scrollToForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 text-base px-4 py-2">
            <Icon name="DollarSign" className="mr-2" size={16} />
            Прозрачные цены
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Расценки на услуги
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Честные цены без скрытых доплат. Окончательная стоимость после бесплатной диагностики
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier, index) => (
            <Card 
              key={index}
              className={`relative ${tier.popular ? 'border-primary shadow-xl scale-105' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white px-6 py-1 text-sm">
                    🔥 Хит продаж
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name={tier.icon as any} className="text-primary" size={32} />
                </div>
                <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                <CardDescription className="text-base">{tier.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-primary">{tier.price}</span>
                  <span className="text-muted-foreground ml-2">₽</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Icon name="Check" className="text-primary mt-0.5 flex-shrink-0" size={20} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={scrollToForm}
                  className="w-full"
                  variant={tier.popular ? "default" : "outline"}
                  size="lg"
                >
                  Заказать
                  <Icon name="ArrowRight" className="ml-2" size={18} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Дополнительные услуги
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {additionalServices.map((service, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-background rounded-lg"
                >
                  <span className="font-medium">{service.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {service.price === "Бесплатно" ? service.price : `${service.price} ₽`}
                  </Badge>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-primary/10 rounded-lg text-center">
              <p className="text-lg font-semibold mb-2">
                💡 Бесплатная диагностика при заказе ремонта
              </p>
              <p className="text-muted-foreground">
                Мастер приедет, оценит объем работ и озвучит точную стоимость
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">
            Нужна консультация или индивидуальный расчет?
          </p>
          <Button onClick={scrollToForm} size="lg" className="text-lg px-8">
            Получить расчет стоимости
            <Icon name="Calculator" className="ml-2" size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
