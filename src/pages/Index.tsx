import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";
import { useState, useEffect } from "react";

const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });
  
  const [timeLeft, setTimeLeft] = useState(3600);
  const [showPopup, setShowPopup] = useState(false);
  const [popupFormData, setPopupFormData] = useState({ name: "", phone: "" });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const popupTimer = setTimeout(() => {
      setShowPopup(true);
    }, 30000);
    return () => clearTimeout(popupTimer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Спасибо! Мы свяжемся с вами в ближайшее время.");
    setFormData({ name: "", phone: "", message: "" });
  };

  const handlePopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Отлично! Ваша скидка 30% активирована. Мы перезвоним в течение 5 минут!");
    setPopupFormData({ name: "", phone: "" });
    setShowPopup(false);
  };

  const services = [
    {
      icon: "Wrench",
      title: "Ремонт фурнитуры",
      description: "Замена и регулировка оконной фурнитуры любой сложности. Быстро восстановим работу ручек, петель и замков.",
      price: "от 500 ₽"
    },
    {
      icon: "Wind",
      title: "Устранение продувания",
      description: "Профессиональная регулировка створок и замена уплотнителей. Ваши окна станут герметичными и теплыми.",
      price: "от 800 ₽"
    },
    {
      icon: "Droplets",
      title: "Замена стеклопакетов",
      description: "Установка новых энергоэффективных стеклопакетов. Решим проблему запотевания и повысим звукоизоляцию.",
      price: "от 2500 ₽"
    },
    {
      icon: "Shield",
      title: "Гарантийное обслуживание",
      description: "Плановое ТО и устранение заводских дефектов. Продлеваем срок службы ваших окон на годы.",
      price: "от 1000 ₽"
    },
    {
      icon: "Settings",
      title: "Регулировка окон",
      description: "Точная настройка механизмов открывания и закрывания. Окна снова будут работать как новые.",
      price: "от 600 ₽"
    },
    {
      icon: "Package",
      title: "Комплексный ремонт",
      description: "Полная диагностика и устранение всех неисправностей. От мелкого ремонта до капитального восстановления.",
      price: "от 1500 ₽"
    }
  ];

  const benefits = [
    {
      icon: "Clock",
      title: "Быстрый выезд",
      description: "Выезжаем на следующий день после заявки"
    },
    {
      icon: "Award",
      title: "Опыт 15 лет",
      description: "Более 10 000 отремонтированных окон"
    },
    {
      icon: "CheckCircle",
      title: "Гарантия качества",
      description: "Официальная гарантия на все работы до 2 лет"
    },
    {
      icon: "DollarSign",
      title: "Честные цены",
      description: "Фиксированная стоимость без скрытых доплат"
    }
  ];

  const testimonials = [
    {
      name: "Мария Петрова",
      text: "Отличная работа! Окна перестали продувать, в квартире стало намного теплее. Мастер приехал на следующий день, работал аккуратно.",
      rating: 5
    },
    {
      name: "Сергей Иванов",
      text: "Заменили стеклопакет за 2 часа. Цена фиксированная, без накруток. Очень доволен качеством и сервисом!",
      rating: 5
    },
    {
      name: "Елена Смирнова",
      text: "Быстро отремонтировали фурнитуру. Окна снова закрываются идеально. Спасибо за профессионализм!",
      rating: 5
    }
  ];

  const gallery = [
    {
      url: "https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/0c645a17-1f9e-4386-98b3-638136b20256.jpg",
      title: "До и после ремонта"
    },
    {
      url: "https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/4b6ee88a-5d9c-4661-b110-bf00616bc1f0.jpg",
      title: "Замена фурнитуры"
    },
    {
      url: "https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/d4cb5b72-ef31-460f-8387-cc5842a640ec.jpg",
      title: "Довольный клиент"
    }
  ];

  return (
    <div className="min-h-screen">
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              🎁 Специальное предложение!
            </DialogTitle>
            <DialogDescription className="text-center">
              <Badge variant="destructive" className="mb-4 text-base px-4 py-2">
                🔥 СКИДКА 30% только сейчас!
              </Badge>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Оставьте заявку прямо сейчас и получите дополнительную скидку 10%!
            </p>
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-center font-semibold text-primary mb-2">Вы экономите до 3000 ₽</p>
              <p className="text-center text-sm text-muted-foreground">⏰ Предложение действует 15 минут</p>
            </div>
            <form onSubmit={handlePopupSubmit} className="space-y-4">
              <Input
                placeholder="Ваше имя"
                value={popupFormData.name}
                onChange={(e) => setPopupFormData({ ...popupFormData, name: e.target.value })}
                required
                className="h-12"
              />
              <Input
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={popupFormData.phone}
                onChange={(e) => setPopupFormData({ ...popupFormData, phone: e.target.value })}
                required
                className="h-12"
              />
              <Button type="submit" size="lg" className="w-full">
                Получить скидку 30%
                <Icon name="Gift" className="ml-2" size={20} />
              </Button>
            </form>
            <p className="text-xs text-center text-muted-foreground">
              ✓ Перезвоним за 5 минут  •  ✓ Выезд бесплатно  •  ✓ Гарантия 2 года
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <header className="absolute top-0 left-0 right-0 z-30 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <img 
            src="https://cdn.poehali.dev/files/01b9a170-845c-485a-9ca0-417c6563b809.png" 
            alt="MAX" 
            className="h-16 md:h-20"
          />
          <a href="tel:+79505770033" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold">
            <Icon name="Phone" size={20} />
            <span className="hidden sm:inline">+7 (950) 577-00-33</span>
            <span className="sm:hidden">Позвонить</span>
          </a>
        </div>
      </header>

      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/48b3efbf-d6ac-4a23-8c03-c93fbccbb394.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        
        <div className="absolute top-24 right-4 z-20 animate-fade-in">
          <Card className="bg-destructive text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Icon name="Flame" size={24} />
                <div>
                  <p className="text-xs font-semibold">АКЦИЯ! Скидка 20%</p>
                  <p className="text-xs">До конца: {formatTime(timeLeft)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
          <Badge className="mb-4 text-sm px-4 py-2">✓ Выезд мастера БЕСПЛАТНО</Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-secondary">
            Профессиональный<br />ремонт окон
          </h1>
          <p className="text-lg text-primary font-semibold mb-4">
            <Icon name="MapPin" className="inline mr-2" size={20} />
            г. Междуреченск
          </p>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Быстро устраним любые неисправности пластиковых и деревянных окон
          </p>
          <p className="text-lg font-semibold text-primary mb-8">
            🔥 Только сегодня — скидка 20% на все работы!
          </p>
          <Button size="lg" className="text-lg px-8 py-6 hover:scale-105 transition-transform animate-pulse" onClick={() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Вызвать мастера со скидкой
            <Icon name="ArrowRight" className="ml-2" size={20} />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">⚡ Осталось 3 места на завтра</p>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-secondary">Наши услуги</h2>
          <p className="text-center text-muted-foreground mb-16 text-lg">Решим любую проблему с вашими окнами</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in border-2 relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-4 right-4">
                  <Badge variant="destructive">-20%</Badge>
                </div>
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Icon name={service.icon} className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-secondary">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                  <p className="text-2xl font-bold text-primary">{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-secondary">Наши работы</h2>
          <p className="text-center text-muted-foreground mb-16 text-lg">Фото выполненных проектов</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {gallery.map((item, index) => (
              <div 
                key={index} 
                className="animate-fade-in overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <img 
                  src={item.url} 
                  alt={item.title}
                  className="w-full h-80 object-cover"
                />
                <div className="p-4 bg-card">
                  <p className="font-semibold text-center text-secondary">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-secondary">Отзывы клиентов</h2>
          <p className="text-center text-muted-foreground mb-16 text-lg">Более 2000 довольных клиентов</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="animate-scale-in border-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6 pb-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon key={i} name="Star" className="text-yellow-500 fill-yellow-500" size={20} />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <p className="font-semibold text-secondary">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-yellow-50 to-background relative overflow-hidden">
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="hidden md:block flex-1 h-1 bg-gradient-to-r from-transparent to-yellow-400"></div>
            <h2 className="text-4xl md:text-6xl font-bold text-center text-secondary uppercase">
              Наши преимущества
            </h2>
            <div className="hidden md:block flex-1 h-1 bg-gradient-to-l from-transparent to-yellow-400"></div>
          </div>
          
          <p className="text-center text-lg md:text-xl text-muted-foreground mb-12 max-w-4xl mx-auto">
            Наши клиенты всегда довольны и рекомендуют нас на протяжении 15 лет.<br />
            Эта заслуга опытных специалистов, налаженного сервиса и отличного оборудования
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto mb-12">
            <div className="text-center animate-fade-in">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full opacity-10"></div>
                <div className="absolute inset-2 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Icon name="Award" className="text-primary" size={48} />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Опыт работы</h3>
              <p className="text-xl md:text-2xl font-semibold text-primary">15 лет</p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full opacity-10"></div>
                <div className="absolute inset-2 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Icon name="Zap" className="text-primary" size={48} />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Быстро</h3>
              <p className="text-xl md:text-2xl font-semibold text-primary">за 15-30 мин</p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full opacity-10"></div>
                <div className="absolute inset-2 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Icon name="CheckCircle2" className="text-primary" size={48} />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Качественные</h3>
              <p className="text-xl md:text-2xl font-semibold text-primary">материалы</p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full opacity-10"></div>
                <div className="absolute inset-2 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Icon name="ShieldCheck" className="text-primary" size={48} />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Контроль</h3>
              <p className="text-xl md:text-2xl font-semibold text-primary">качества</p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full opacity-10"></div>
                <div className="absolute inset-2 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Icon name="TrendingDown" className="text-primary" size={48} />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Цены выгоднее</h3>
              <p className="text-xl md:text-2xl font-semibold text-primary">до 30-50%</p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '500ms' }}>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full opacity-10"></div>
                <div className="absolute inset-2 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Icon name="Shield" className="text-primary" size={48} />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Гарантия</h3>
              <p className="text-xl md:text-2xl font-semibold text-primary">1 год</p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full opacity-10"></div>
                <div className="absolute inset-2 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Icon name="Lock" className="text-primary" size={48} />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Фиксируем</h3>
              <p className="text-xl md:text-2xl font-semibold text-primary">цену!</p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: '700ms' }}>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full opacity-10"></div>
                <div className="absolute inset-2 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Icon name="Percent" className="text-primary" size={48} />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Скидки</h3>
              <p className="text-xl md:text-2xl font-semibold text-primary">и акции</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <Card className="border-4 border-primary/20 bg-white shadow-2xl">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-3xl md:text-5xl font-bold text-destructive mb-4">
                  Ремонт пластиковых окон и дверей<br />
                  по <span className="underline decoration-4">адекватным ценам</span>
                </h3>
                <p className="text-xl md:text-3xl text-secondary font-semibold">
                  понятная цена БЕЗ НАКРУТОК<br />
                  вы экономите на ремонте минимум 30-50%
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-gradient-to-br from-primary/10 to-secondary/5">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <Badge variant="destructive" className="mb-4 text-base px-6 py-2">🔥 АКЦИЯ! Скидка 20% при заказе сегодня</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">Оставить заявку</h2>
            <p className="text-muted-foreground mb-2 text-lg">Мастер приедет в удобное для вас время</p>
            <p className="text-primary font-semibold">⏰ Осталось всего 3 свободных места на завтра!</p>
          </div>
          
          <Card className="border-2 shadow-2xl">
            <CardContent className="pt-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-secondary">Ваше имя</label>
                  <Input 
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-secondary">Телефон</label>
                  <Input 
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-secondary">Описание проблемы (необязательно)</label>
                  <Textarea 
                    placeholder="Опишите, что случилось с окном..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full text-lg py-6">
                  Получить скидку 20%
                  <Icon name="Gift" className="ml-2" size={20} />
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  ✓ Выезд мастера бесплатно  •  ✓ Гарантия 2 года  •  ✓ Оплата после работы
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-secondary">Наш офис</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            <Icon name="MapPin" className="inline mr-2" size={20} />
            г. Междуреченск
          </p>
          
          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden border-2">
              <CardContent className="p-0">
                <iframe
                  src="https://yandex.ru/map-widget/v1/?ll=88.063889%2C53.693889&z=13&l=map&pt=88.063889,53.693889,pm2rdm"
                  width="100%"
                  height="450"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full"
                  title="Карта Междуреченска"
                />
              </CardContent>
            </Card>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <Card>
                <CardContent className="pt-6 pb-6">
                  <Icon name="MapPin" className="text-primary mx-auto mb-3" size={32} />
                  <h3 className="font-semibold text-secondary mb-2">Адрес</h3>
                  <p className="text-muted-foreground">г. Междуреченск</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 pb-6">
                  <Icon name="Phone" className="text-primary mx-auto mb-3" size={32} />
                  <h3 className="font-semibold text-secondary mb-2">Телефон</h3>
                  <a href="tel:+79505770033" className="text-primary hover:underline">+7 (950) 577-00-33</a>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 pb-6">
                  <Icon name="Clock" className="text-primary mx-auto mb-3" size={32} />
                  <h3 className="font-semibold text-secondary mb-2">Время работы</h3>
                  <p className="text-muted-foreground">Ежедневно<br />8:00 — 20:00</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Профессиональный ремонт окон в Междуреченске</h3>
          <p className="text-white/80 mb-6">Работаем ежедневно с 8:00 до 20:00</p>
          <div className="flex justify-center gap-4 text-lg mb-4">
            <a href="tel:+79505770033" className="hover:text-primary transition-colors">
              <Icon name="Phone" className="inline mr-2" size={20} />
              +7 (950) 577-00-33
            </a>
          </div>
          <p className="text-sm text-white/60">© 2024 Все права защищены</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;