import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

export default function FloatingCallButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = '79234567890';
    const message = `Здравствуйте! Меня зовут ${formData.name}. Хочу заказать обратный звонок. Мой номер: ${formData.phone}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setFormData({ name: '', phone: '' });
    }, 2000);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 animate-pulse"
        size="icon"
      >
        <Icon name="Phone" size={28} />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              <Icon name="Phone" className="inline mr-2 text-primary" size={28} />
              Заказать звонок
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Оставьте ваши контакты, и мы перезвоним в течение 5 минут
            </DialogDescription>
          </DialogHeader>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">
                  Ваше имя
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Иван"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-semibold">
                  Номер телефона
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="h-12 text-base"
                />
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-600" />
                  Бесплатный выезд мастера
                </p>
                <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-600" />
                  Скидка 20% при заказе сегодня
                </p>
                <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-600" />
                  Гарантия от 1 года
                </p>
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-bold" size="lg">
                <Icon name="PhoneCall" className="mr-2" size={20} />
                Жду звонка!
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          ) : (
            <div className="py-8 text-center space-y-4">
              <Icon name="CheckCircle2" className="mx-auto text-green-600" size={64} />
              <h3 className="text-xl font-bold text-secondary">Заявка отправлена!</h3>
              <p className="text-muted-foreground">Мы свяжемся с вами в ближайшие минуты</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
