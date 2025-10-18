import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Review {
  id: number;
  author_name: string;
  rating: number;
  review_text: string;
  service_type?: string;
  created_at: string;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    author_name: '',
    rating: 5,
    review_text: '',
    service_type: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const REVIEWS_API = 'https://functions.poehali.dev/afe6fe8d-2c7e-4d6c-8f95-7f955f5bfb7e';

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(REVIEWS_API);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch(REVIEWS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage('✅ Спасибо! Ваш отзыв отправлен на модерацию и появится после проверки администратором.');
        setFormData({ author_name: '', rating: 5, review_text: '', service_type: '' });
        setShowForm(false);
        setTimeout(() => setSubmitMessage(''), 5000);
      } else {
        setSubmitMessage('❌ Ошибка отправки. Проверьте заполненность полей.');
      }
    } catch (error) {
      setSubmitMessage('❌ Ошибка соединения с сервером.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name={i < rating ? "Star" : "Star"}
        size={20}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-base px-6 py-2 bg-white">
            💬 Отзывы клиентов
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
            Что говорят наши клиенты
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Реальные отзывы от людей, которые доверили нам свои окна
          </p>
        </div>

        {submitMessage && (
          <div className="mb-6 p-4 bg-white border-2 border-primary rounded-lg text-center font-medium">
            {submitMessage}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reviews.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Пока нет отзывов. Будьте первым!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-lg text-secondary">{review.author_name}</h4>
                      {review.service_type && (
                        <p className="text-sm text-muted-foreground">{review.service_type}</p>
                      )}
                    </div>
                    <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                  </div>
                  <p className="text-muted-foreground mb-3">{review.review_text}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {!showForm ? (
          <div className="text-center">
            <Button
              size="lg"
              onClick={() => setShowForm(true)}
              className="text-lg px-8 py-6"
            >
              <Icon name="PenSquare" size={20} className="mr-2" />
              Оставить отзыв
            </Button>
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto border-2 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-6 text-secondary">Ваш отзыв</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ваше имя *</label>
                  <Input
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="Иван Петров"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Оценка *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="focus:outline-none"
                      >
                        <Icon
                          name="Star"
                          size={32}
                          className={
                            star <= formData.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Вид услуги</label>
                  <Input
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                    placeholder="Например: Регулировка окон"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ваш отзыв *</label>
                  <Textarea
                    value={formData.review_text}
                    onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                    placeholder="Расскажите о вашем опыте..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    disabled={isSubmitting}
                  >
                    Отмена
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  * Отзыв будет опубликован после проверки администратором
                </p>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
