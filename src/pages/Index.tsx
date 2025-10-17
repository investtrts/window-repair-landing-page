import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { useState } from "react";

const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Спасибо! Мы свяжемся с вами в ближайшее время.");
    setFormData({ name: "", phone: "", message: "" });
  };

  const services = [
    {
      icon: "Wrench",
      title: "Ремонт фурнитуры",
      description: "Замена и регулировка оконной фурнитуры любой сложности. Быстро восстановим работу ручек, петель и замков."
    },
    {
      icon: "Wind",
      title: "Устранение продувания",
      description: "Профессиональная регулировка створок и замена уплотнителей. Ваши окна станут герметичными и теплыми."
    },
    {
      icon: "Droplets",
      title: "Замена стеклопакетов",
      description: "Установка новых энергоэффективных стеклопакетов. Решим проблему запотевания и повысим звукоизоляцию."
    },
    {
      icon: "Shield",
      title: "Гарантийное обслуживание",
      description: "Плановое ТО и устранение заводских дефектов. Продлеваем срок службы ваших окон на годы."
    },
    {
      icon: "Settings",
      title: "Регулировка окон",
      description: "Точная настройка механизмов открывания и закрывания. Окна снова будут работать как новые."
    },
    {
      icon: "Package",
      title: "Комплексный ремонт",
      description: "Полная диагностика и устранение всех неисправностей. От мелкого ремонта до капитального восстановления."
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

  return (
    <div className="min-h-screen">
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/48b3efbf-d6ac-4a23-8c03-c93fbccbb394.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-secondary">
            Профессиональный<br />ремонт окон
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Быстро устраним любые неисправности пластиковых и деревянных окон.<br />Выезд мастера — бесплатно
          </p>
          <Button size="lg" className="text-lg px-8 py-6 hover:scale-105 transition-transform" onClick={() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Вызвать мастера
            <Icon name="ArrowRight" className="ml-2" size={20} />
          </Button>
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
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in border-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Icon name={service.icon} className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-secondary">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-secondary">Почему выбирают нас</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name={benefit.icon} className="text-primary" size={36} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-secondary">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-secondary">Оставить заявку</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">Мастер приедет в удобное для вас время</p>
          
          <Card className="border-2">
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
                  Отправить заявку
                  <Icon name="Send" className="ml-2" size={20} />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Профессиональный ремонт окон</h3>
          <p className="text-white/80 mb-6">Работаем ежедневно с 8:00 до 20:00</p>
          <div className="flex justify-center gap-4 text-lg">
            <a href="tel:+79991234567" className="hover:text-primary transition-colors">
              <Icon name="Phone" className="inline mr-2" size={20} />
              +7 (999) 123-45-67
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
