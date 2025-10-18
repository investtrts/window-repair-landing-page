import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface Review {
  id: number;
  author_name: string;
  rating: number;
  review_text: string;
  service_type?: string;
  created_at: string;
  is_approved: boolean;
  admin_comment?: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminToken] = useState('admin123');

  const REVIEWS_API = 'https://functions.poehali.dev/afe6fe8d-2c7e-4d6c-8f95-7f955f5bfb7e';

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchAllReviews();
    }
  }, []);

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      fetchAllReviews();
    } else {
      alert('Неверный пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setReviews([]);
    setPassword('');
    navigate('/');
  };

  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${REVIEWS_API}?all=true`, {
        headers: {
          'X-Admin-Token': adminToken,
        },
      });
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number, approve: boolean) => {
    try {
      const response = await fetch(REVIEWS_API, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken,
        },
        body: JSON.stringify({
          id,
          is_approved: approve,
        }),
      });

      if (response.ok) {
        fetchAllReviews();
      }
    } catch (error) {
      console.error('Ошибка обновления отзыва:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот отзыв?')) return;

    try {
      const response = await fetch(REVIEWS_API, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken,
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchAllReviews();
      }
    } catch (error) {
      console.error('Ошибка удаления отзыва:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={16}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Админ-панель</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Введите пароль"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Войти
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              Вернуться на сайт
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">Управление отзывами</h1>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/admin/content')} variant="outline">
              <Icon name="Settings" className="mr-2" size={18} />
              Контент
            </Button>
            <Button onClick={() => navigate('/')} variant="outline">
              <Icon name="Home" size={18} className="mr-2" />
              На сайт
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-4">
            <Badge variant="outline" className="text-base px-4 py-2">
              Всего: {reviews.length}
            </Badge>
            <Badge variant="default" className="text-base px-4 py-2 bg-green-600">
              Одобрено: {reviews.filter(r => r.is_approved).length}
            </Badge>
            <Badge variant="destructive" className="text-base px-4 py-2">
              На модерации: {reviews.filter(r => !r.is_approved).length}
            </Badge>
          </div>
          <Button onClick={fetchAllReviews} variant="outline" disabled={loading}>
            <Icon name="RefreshCw" size={18} className={loading ? "animate-spin mr-2" : "mr-2"} />
            Обновить
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Icon name="Loader2" size={48} className="animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Загрузка...</p>
          </div>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg text-muted-foreground">Отзывов пока нет</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className={review.is_approved ? 'border-green-200' : 'border-orange-200'}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-secondary">{review.author_name}</h3>
                        <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                        {review.is_approved ? (
                          <Badge variant="default" className="bg-green-600">Опубликован</Badge>
                        ) : (
                          <Badge variant="destructive">На модерации</Badge>
                        )}
                      </div>
                      {review.service_type && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Услуга: {review.service_type}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mb-3">
                        {new Date(review.created_at).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-muted-foreground">{review.review_text}</p>
                  </div>

                  <div className="flex gap-2">
                    {!review.is_approved ? (
                      <Button
                        onClick={() => handleApprove(review.id, true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Icon name="CheckCircle" size={18} className="mr-2" />
                        Одобрить
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleApprove(review.id, false)}
                        variant="outline"
                      >
                        <Icon name="XCircle" size={18} className="mr-2" />
                        Снять с публикации
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDelete(review.id)}
                      variant="destructive"
                    >
                      <Icon name="Trash2" size={18} className="mr-2" />
                      Удалить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}