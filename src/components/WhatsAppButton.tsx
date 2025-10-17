import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const phoneNumber = '79999999999';
    const message = encodeURIComponent('Здравствуйте! Хочу узнать о ремонте окон и получить скидку 20%');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      size="lg"
      className="fixed bottom-6 right-6 z-50 rounded-full w-16 h-16 md:w-auto md:h-auto md:px-6 md:py-6 bg-green-500 hover:bg-green-600 shadow-2xl transform transition-all hover:scale-110 group"
      aria-label="Написать в WhatsApp"
    >
      <Icon name="MessageCircle" size={28} className="md:mr-0 group-hover:animate-bounce" />
      <span className="hidden md:inline ml-3 text-base font-bold">
        Написать в WhatsApp
      </span>
      
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
    </Button>
  );
}
