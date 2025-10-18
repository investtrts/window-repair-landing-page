import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const CONTENT_API = 'https://functions.poehali.dev/0834ee0a-3d60-4224-ab11-b39d167e2371';
const ADMIN_PASSWORD = 'admin123';

export default function AdminContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [services, setServices] = useState<any[]>([]);
  const [pricingTiers, setPricingTiers] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminContentAuth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchAllContent();
    }
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminContentAuth', 'true');
      fetchAllContent();
    } else {
      toast({ title: 'Ошибка', description: 'Неверный пароль', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminContentAuth');
    navigate('/');
  };

  const fetchAllContent = async () => {
    try {
      const [servicesRes, pricingRes, galleryRes, settingsRes] = await Promise.all([
        fetch(`${CONTENT_API}?type=services`),
        fetch(`${CONTENT_API}?type=pricing`),
        fetch(`${CONTENT_API}?type=gallery`),
        fetch(`${CONTENT_API}?type=settings`)
      ]);

      setServices(await servicesRes.json());
      setPricingTiers(await pricingRes.json());
      setGallery(await galleryRes.json());
      setSettings(await settingsRes.json());
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const handleSaveService = async (service: any) => {
    try {
      const method = service.id ? 'PUT' : 'POST';
      await fetch(`${CONTENT_API}?type=services`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': ADMIN_PASSWORD
        },
        body: JSON.stringify(service)
      });
      toast({ title: 'Успех', description: 'Сохранено' });
      fetchAllContent();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось сохранить', variant: 'destructive' });
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm('Удалить?')) return;
    try {
      await fetch(`${CONTENT_API}?type=${type}&id=${id}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Password': ADMIN_PASSWORD }
      });
      toast({ title: 'Удалено' });
      fetchAllContent();
    } catch (error) {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const handleUpdateSetting = async (key: string, value: string) => {
    try {
      await fetch(`${CONTENT_API}?type=settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': ADMIN_PASSWORD
        },
        body: JSON.stringify({ setting_key: key, setting_value: value })
      });
      toast({ title: 'Успех', description: 'Настройка обновлена' });
    } catch (error) {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Админ-панель контента</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <Button onClick={handleLogin} className="w-full">Войти</Button>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">На главную</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Управление контентом</h1>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/admin')} variant="outline">
              <Icon name="Users" className="mr-2" size={18} />
              Отзывы
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              <Icon name="LogOut" className="mr-2" size={18} />
              Выйти
            </Button>
          </div>
        </div>

        <Tabs defaultValue="services" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="services">Услуги ({services.length})</TabsTrigger>
            <TabsTrigger value="pricing">Тарифы ({pricingTiers.length})</TabsTrigger>
            <TabsTrigger value="gallery">Галерея ({gallery.length})</TabsTrigger>
            <TabsTrigger value="settings">Настройки ({settings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            <div className="grid gap-4">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name={service.icon} size={24} className="text-primary" />
                          <h3 className="text-xl font-bold">{service.title}</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">{service.description}</p>
                        <p className="text-lg font-semibold text-primary">{service.price}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete('services', service.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {pricingTiers.map((tier) => (
                <Card key={tier.id} className={tier.is_popular ? 'border-primary' : ''}>
                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <p className="text-muted-foreground">{tier.description}</p>
                    <p className="text-3xl font-bold text-primary">{tier.price} ₽</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {Array.isArray(tier.features) && tier.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Icon name="Check" className="text-primary mt-1" size={16} />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDelete('pricing', tier.id)}
                      className="w-full"
                    >
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Удалить
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {gallery.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <img src={item.url} alt={item.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDelete('gallery', item.id)}
                      className="w-full"
                    >
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Удалить
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Настройки сайта</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.map((setting) => (
                  <div key={setting.setting_key} className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">
                        {setting.description || setting.setting_key}
                      </label>
                      <Input
                        value={setting.setting_value}
                        onChange={(e) => {
                          const updated = settings.map(s => 
                            s.setting_key === setting.setting_key 
                              ? { ...s, setting_value: e.target.value }
                              : s
                          );
                          setSettings(updated);
                        }}
                      />
                    </div>
                    <Button
                      onClick={() => handleUpdateSetting(setting.setting_key, setting.setting_value)}
                      className="mt-6"
                    >
                      Сохранить
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
