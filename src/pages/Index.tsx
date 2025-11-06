import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Icon from "@/components/ui/icon";
import FloatingCallButton from "@/components/FloatingCallButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import VideoReviews from "@/components/VideoReviews";
import CountdownTimer from "@/components/CountdownTimer";
import LiveChat from "@/components/LiveChat";
import WorkflowSteps from "@/components/WorkflowSteps";
import Certificates from "@/components/Certificates";
import ReviewsSection from "@/components/ReviewsSection";
import PricingSection from "@/components/PricingSection";
import { useState, useEffect } from "react";

const CONTENT_API = 'https://functions.poehali.dev/0834ee0a-3d60-4224-ab11-b39d167e2371';
const REVIEWS_API = 'https://functions.poehali.dev/afe6fe8d-2c7e-4d6c-8f95-7f955f5bfb7e';

const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });
  
  const [timeLeft, setTimeLeft] = useState(3600);
  const [showPopup, setShowPopup] = useState(false);
  const [popupFormData, setPopupFormData] = useState({ name: "", phone: "" });
  
  const [services, setServices] = useState<any[]>([]);
  const [benefits, setBenefits] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [servicesRes, benefitsRes, galleryRes, reviewsRes] = await Promise.all([
          fetch(`${CONTENT_API}?type=services`),
          fetch(`${CONTENT_API}?type=benefits`),
          fetch(`${CONTENT_API}?type=gallery`),
          fetch(REVIEWS_API)
        ]);
        
        const servicesData = await servicesRes.json();
        const benefitsData = await benefitsRes.json();
        const galleryData = await galleryRes.json();
        const reviewsData = await reviewsRes.json();
        
        setServices(servicesData);
        setBenefits(benefitsData);
        setGallery(galleryData);
        setReviews(reviewsData.reviews || []);
      } catch (error) {
        console.error('Ошибка загрузки контента:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
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









  return (
    <div className="min-h-screen">
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              🎁 Специальное предложение!
            </DialogTitle>
            <DialogDescription className="text-center">
              <div className="flex justify-center mt-2">
                <Badge variant="destructive" className="mb-4 text-base px-4 py-2">
                  🔥 СКИДКА 30% только сейчас!
                </Badge>
              </div>
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
        
        <div className="absolute top-24 right-4 lg:right-8 z-20 animate-fade-in w-[320px] sm:w-[340px] md:w-[380px] lg:w-[420px] hidden sm:block">
          <CountdownTimer onActionClick={() => setShowPopup(true)} />
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

      <section className="py-6 md:py-12 bg-gradient-to-br from-yellow-50 to-white border-y-2 border-yellow-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={32} />
                <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={32} />
                <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={32} />
                <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={32} />
                <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={32} />
              </div>
              <p className="text-3xl md:text-5xl font-bold text-secondary mb-1">4.9</p>
              <p className="text-sm md:text-base text-muted-foreground">Рейтинг на Яндекс</p>
              <p className="text-xs md:text-sm text-muted-foreground">152 отзыва</p>
            </div>

            <div className="hidden md:block h-20 w-px bg-border"></div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={32} />
                <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={32} />
                <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={32} />
                <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={32} />
                <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={32} />
              </div>
              <p className="text-3xl md:text-5xl font-bold text-secondary mb-1">5.0</p>
              <p className="text-sm md:text-base text-muted-foreground">Рейтинг на 2ГИС</p>
              <p className="text-xs md:text-sm text-muted-foreground">87 отзывов</p>
            </div>

            <div className="hidden md:block h-20 w-px bg-border"></div>

            <div className="text-center">
              <Icon name="Users" className="text-primary mx-auto mb-2" size={48} />
              <p className="text-3xl md:text-5xl font-bold text-secondary mb-1">2000+</p>
              <p className="text-sm md:text-base text-muted-foreground">Довольных клиентов</p>
              <p className="text-xs md:text-sm text-muted-foreground">за 15 лет работы</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16 bg-white border-y-2 md:border-y-4 border-yellow-400">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6 max-w-7xl mx-auto">
            <Card className="border-2 border-primary/20 hover:border-primary transition-all hover:shadow-xl">
              <CardContent className="pt-4 pb-4 md:pt-6 md:pb-6 text-center">
                <Icon name="Settings" className="text-primary mx-auto mb-2 md:mb-3" size={32} />
                <p className="text-sm md:text-base font-semibold text-secondary leading-tight">
                  Ремонт окон любых производителей и профильных систем
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 hover:border-primary transition-all hover:shadow-xl">
              <CardContent className="pt-4 pb-4 md:pt-6 md:pb-6 text-center">
                <Icon name="CarFront" className="text-primary mx-auto mb-2 md:mb-3" size={32} />
                <p className="text-sm md:text-base font-semibold text-secondary leading-tight">
                  Выезд мастера бесплатно
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 hover:border-primary transition-all hover:shadow-xl">
              <CardContent className="pt-4 pb-4 md:pt-6 md:pb-6 text-center">
                <Icon name="ShieldCheck" className="text-primary mx-auto mb-2 md:mb-3" size={32} />
                <p className="text-sm md:text-base font-semibold text-secondary leading-tight">
                  Гарантия на все работы от 1 года
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 hover:border-primary transition-all hover:shadow-xl">
              <CardContent className="pt-4 pb-4 md:pt-6 md:pb-6 text-center">
                <Icon name="Briefcase" className="text-primary mx-auto mb-2 md:mb-3" size={32} />
                <p className="text-sm md:text-base font-semibold text-secondary leading-tight">
                  Работаем с физ. и юр. лицами
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-destructive/20 hover:border-destructive transition-all hover:shadow-xl bg-destructive/5 sm:col-span-2 lg:col-span-1">
              <CardContent className="pt-4 pb-4 md:pt-6 md:pb-6 text-center">
                <Icon name="Heart" className="text-destructive mx-auto mb-2 md:mb-3" size={32} />
                <p className="text-sm md:text-base font-semibold text-destructive leading-tight">
                  Пенсионерам, инвалидам, многодетным семьям скидка 10%
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-base px-6 py-2">🎯 Как мы работаем</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-secondary">Схема работы</h2>
            <p className="text-muted-foreground text-lg">Всего 4 простых шага до идеальных окон</p>
          </div>
          <WorkflowSteps />
        </div>
      </section>

      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="hidden md:block flex-1 h-1 bg-gradient-to-r from-transparent to-yellow-400"></div>
            <h2 className="text-4xl md:text-6xl font-bold text-center text-secondary uppercase">
              Наши услуги
            </h2>
            <div className="hidden md:block flex-1 h-1 bg-gradient-to-l from-transparent to-yellow-400"></div>
          </div>
          
          <p className="text-center text-lg md:text-xl text-muted-foreground mb-12 max-w-4xl mx-auto">
            У вас сломалось окно, не закрывается дверь? Зимой из окон дует, а летом не дают покоя комары?<br />
            Днем некуда скрыться от солнца, а по ночам не дает спать шум с улицы?<br />
            <span className="font-semibold text-secondary">Тогда Вы попали по адресу! Доверьте нам решить Вашу проблему:</span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 max-w-6xl mx-auto">
            <div className="animate-fade-in">
              <div 
                className="h-48 rounded-3xl shadow-xl mb-4 bg-cover bg-center"
                style={{ backgroundImage: `url('https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/61083214-4ae5-4ea4-9a68-3aa1b87a8e54.jpg')` }}
              ></div>
              <h3 className="text-2xl md:text-3xl font-bold text-center text-secondary">
                Ремонт пластиковых<br />окон и дверей
              </h3>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div 
                className="h-48 rounded-3xl shadow-xl mb-4 bg-cover bg-center"
                style={{ backgroundImage: `url('https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/838a1ea3-1e36-4f5e-80be-c4fc73b59698.jpg')` }}
              ></div>
              <h3 className="text-2xl md:text-3xl font-bold text-center text-secondary">
                Утепление<br />окон и дверей
              </h3>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div 
                className="h-48 rounded-3xl shadow-xl mb-4 bg-cover bg-center"
                style={{ backgroundImage: `url('https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/63a05add-6dd5-4c81-8bce-96da8b0f665c.jpg')` }}
              ></div>
              <h3 className="text-2xl md:text-3xl font-bold text-center text-secondary">
                Замена стекол<br />и стеклопакетов
              </h3>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Icon name="Loader2" size={48} className="animate-spin mx-auto text-primary mb-4" />
              <p className="text-muted-foreground">Загрузка услуг...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
              {services.map((service, index) => (
                <Card key={service.id || index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Icon name={service.icon} className="text-primary mb-4" size={48} />
                    <h3 className="text-xl font-bold mb-2 text-secondary">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <p className="text-2xl font-bold text-primary">{service.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 max-w-6xl mx-auto">
            {[
              { icon: 'Settings', title: 'Установка\nаксессуаров' },
              { icon: 'Square', title: 'Установка\nоткосов' },
              { icon: 'Wrench', title: 'Ремонт и замена\nфурнитуры' }
            ].map((item, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${300 + index * 100}ms` }}>
                <div className="h-48 rounded-3xl shadow-xl mb-4 bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center">
                  <Icon name={item.icon} className="text-primary" size={80} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-center text-secondary whitespace-pre-line">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
            {[
              { icon: 'Droplets', title: 'Устранение\nконденсата' },
              { icon: 'Layers', title: 'Установка\nподоконников' },
              { icon: 'Bug', title: 'Установка\nмоскитных сеток' }
            ].map((item, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${600 + index * 100}ms` }}>
                <div className="h-48 rounded-3xl shadow-xl mb-4 bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center">
                  <Icon name={item.icon} className="text-primary" size={80} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-center text-secondary whitespace-pre-line">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto text-center mb-16">
            <Badge variant="outline" className="mb-4 text-base px-6 py-2">📸 Реальные результаты</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-secondary">Наши работы: До и После</h2>
            <p className="text-muted-foreground text-lg mb-12">
              Посмотрите, как выглядят окна после профессионального ремонта
            </p>
            <BeforeAfterGallery />
          </div>

          <div className="max-w-4xl mx-auto text-center mb-12 mt-16">
            <h3 className="text-3xl md:text-5xl font-bold text-destructive mb-6">
              Мы любим свою работу и гордимся<br />
              тем, что делаем ее хорошо.
            </h3>
            <p className="text-xl md:text-3xl text-secondary font-semibold">
              Поможем починить окно, устранить сквозняк,<br />
              скрипа, сделать дом теплее и уютнее
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="border-4 border-secondary shadow-2xl">
              <CardContent className="pt-8 pb-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="tel"
                    placeholder="Введите телефон"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="h-16 text-center text-2xl font-bold border-2 border-secondary"
                  />
                  <Button type="submit" size="lg" className="w-full text-2xl py-8 font-bold">
                    Вызвать мастера
                  </Button>
                  <p className="text-center text-lg font-semibold text-secondary">
                    Нажмите кнопку, мы перезвоним вам
                  </p>
                </form>
              </CardContent>
            </Card>
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
          
          {loading ? (
            <div className="text-center py-12">
              <Icon name="Loader2" size={48} className="animate-spin mx-auto text-primary mb-4" />
              <p className="text-muted-foreground">Загрузка отзывов...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {reviews.map((review, index) => (
                <Card 
                  key={review.id || index} 
                  className="animate-scale-in border-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="pt-6 pb-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Icon key={i} name="Star" className="text-yellow-500 fill-yellow-500" size={20} />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{review.review_text}"</p>
                    <p className="font-semibold text-secondary">{review.author_name}</p>
                    {review.service_type && (
                      <p className="text-sm text-muted-foreground mt-2">{review.service_type}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Отзывы скоро появятся</p>
            </div>
          )}
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
          
          {loading ? (
            <div className="text-center py-12">
              <Icon name="Loader2" size={48} className="animate-spin mx-auto text-primary mb-4" />
              <p className="text-muted-foreground">Загрузка...</p>
            </div>
          ) : benefits.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto mb-12">
              {benefits.map((benefit, index) => (
                <div key={benefit.id || index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full opacity-10"></div>
                    <div className="absolute inset-2 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <Icon name={benefit.icon} className="text-primary" size={48} />
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-secondary mb-2">{benefit.title}</h3>
                  <p className="text-base md:text-lg text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          ) : (
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
              <p className="text-xl md:text-2xl font-semibold text-primary">до 30%</p>
            </div>
          </div>
          )}
        </div>
      </section>

      <ReviewsSection />

      <PricingSection />

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

      <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-base px-6 py-2">🎥 Видео-отзывы</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-secondary">Что говорят наши клиенты</h2>
            <p className="text-muted-foreground text-lg">Реальные люди, реальные истории ремонта</p>
          </div>
          <VideoReviews />
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-base px-6 py-2">📜 Документы</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-secondary">Сертификаты и лицензии</h2>
            <p className="text-muted-foreground text-lg">Работаем официально, все документы в порядке</p>
          </div>
          <Certificates />
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-base px-6 py-2">💬 Ответы на вопросы</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-secondary">Часто задаваемые вопросы</h2>
            <p className="text-muted-foreground text-lg">Всё, что нужно знать о ремонте окон</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border-2 rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:no-underline">
                Сколько стоит выезд мастера?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Выезд мастера на диагностику полностью бесплатный! Специалист приедет в удобное для вас время, определит проблему и назван точную стоимость ремонта. Оплата только после выполнения работ.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-2 rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:no-underline">
                Как быстро приедет мастер?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                В зависимости от загруженности, мастер может приехать в день обращения или на следующий день. Обычно выезжаем в течение 2-4 часов после заявки. Вы можете выбрать удобное время для визита.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-2 rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:no-underline">
                Какая гарантия на выполненные работы?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Мы даём официальную гарантию от 1 года на все виды работ. На некоторые виды услуг гарантия может достигать 2-3 лет. Все условия прописываются в договоре.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-2 rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:no-underline">
                Сколько времени занимает ремонт?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Большинство работ выполняется за 15-30 минут прямо на месте. Более сложные случаи (замена стеклопакетов, фурнитуры) могут занять 1-2 часа. Точное время мастер озвучит после диагностики.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-2 rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:no-underline">
                Работаете ли вы с юридическими лицами?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Да, мы работаем как с физическими, так и с юридическими лицами. Предоставляем все необходимые документы: договор, акт выполненных работ, счёт-фактуру. Возможна оплата по безналичному расчёту.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-2 rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:no-underline">
                Какие окна вы ремонтируете?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Мы ремонтируем пластиковые окна и двери любых производителей и профильных систем: KBE, Rehau, Veka, Proplex и другие. Работаем с любыми типами фурнитуры и механизмов.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border-2 rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:no-underline">
                Как действуют скидки и акции?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                При заказе сегодня действует скидка 20%. Пенсионерам, инвалидам и многодетным семьям предоставляем дополнительную скидку 10%. Скидки суммируются! Для активации скидки просто укажите это при заявке.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-secondary">Наш офис</h2>
          <p className="text-center text-muted-foreground mb-8 md:mb-12 text-lg">
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

      <FloatingCallButton />
      <LiveChat />
      <WhatsAppButton />

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