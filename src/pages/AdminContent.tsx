import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const CONTENT_API = 'https://functions.poehali.dev/0834ee0a-3d60-4224-ab11-b39d167e2371';
const ADMIN_PASSWORD = 'admin123';

interface Service {
  id?: number;
  icon: string;
  title: string;
  description: string;
  price: string;
  display_order?: number;
}

interface PricingTier {
  id?: number;
  name: string;
  description: string;
  price: string;
  icon: string;
  is_popular: boolean;
  features: string[];
  display_order?: number;
}

interface GalleryItem {
  id?: number;
  url: string;
  title: string;
  description?: string;
  display_order?: number;
}

interface SiteSetting {
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description?: string;
}

export default function AdminContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [services, setServices] = useState<Service[]>([]);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  
  const [editDialog, setEditDialog] = useState(false);
  const [editType, setEditType] = useState<'services' | 'pricing' | 'gallery' | 'settings'>('services');
  const [editItem, setEditItem] = useState<any>(null);

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
      toast({ title: 'Ошибка', description: 'Не удалось загрузить контент', variant: 'destructive' });
    }
  };

  const handleSave = async (type: string, item: any) => {
    try {
      const method = item.id ? 'PUT' : 'POST';
      const response = await fetch(`${CONTENT_API}?type=${type}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': ADMIN_PASSWORD
        },
        body: JSON.stringify(item)
      });

      if (response.ok) {
        toast({ title: 'Успех', description: 'Изменения сохранены' });
        fetchAllContent();
        setEditDialog(false);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось сохранить', variant: 'destructive' });
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm('Удалить этот элемент?')) return;

    try {
      const response = await fetch(`${CONTENT_API}?type=${type}&id=${id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Password': ADMIN_PASSWORD
        }
      });

      if (response.ok) {
        toast({ title: 'Успех', description: 'Элемент удален' });
        fetchAllContent();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось удалить', variant: 'destructive' });
    }
  };

  const openEditDialog = (type: 'services' | 'pricing' | 'gallery' | 'settings', item: any = null) => {
    setEditType(type);
    setEditItem(item || {});
    setEditDialog(true);
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
          <h1 className="text-3xl font-bold">Управление контентом сайта</h1>
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
            <TabsTrigger value="services">Услуги</TabsTrigger>
            <TabsTrigger value="pricing">Тарифы</TabsTrigger>
            <TabsTrigger value="gallery">Галерея</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            <Button onClick={() => openEditDialog('services')}>
              <Icon name="Plus" className="mr-2" size={18} />
              Добавить услугу
            </Button>
            <div className="grid gap-4">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name={service.icon as any} size={24} className="text-primary" />
                          <h3 className="text-xl font-bold">{service.title}</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">{service.description}</p>
                        <p className="text-lg font-semibold text-primary">{service.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog('services', service)}>
                          <Icon name="Edit" size={16} />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete('services', service.id!)}>
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Button onClick={() => openEditDialog('pricing')}>
              <Icon name="Plus" className="mr-2" size={18} />
              Добавить тариф
            </Button>
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
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Icon name="Check" className="text-primary mt-1" size={16} />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog('pricing', tier)} className="flex-1">
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete('pricing', tier.id!)}>
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <Button onClick={() => openEditDialog('gallery')}>
              <Icon name="Plus" className="mr-2" size={18} />
              Добавить фото
            </Button>
            <div className="grid md:grid-cols-3 gap-4">
              {gallery.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <img src={item.url} alt={item.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog('gallery', item)} className="flex-1">
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete('gallery', item.id!)}>
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
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
                      <Label>{setting.description || setting.setting_key}</Label>
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
                      onClick={() => handleSave('settings', setting)}
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

        <Dialog open={editDialog} onOpenChange={setEditDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editItem?.id ? 'Редактировать' : 'Добавить'} {
                  editType === 'services' ? 'услугу' :
                  editType === 'pricing' ? 'тариф' :
                  editType === 'gallery' ? 'фото' : 'настройку'
                }
              </DialogTitle>
            </DialogHeader>
            
            {editType === 'services' && (
              <div className="space-y-4">
                <div>
                  <Label>Иконка (название из lucide-react)</Label>
                  <Input
                    value={editItem.icon || ''}
                    onChange={(e) => setEditItem({ ...editItem, icon: e.target.value })}
                    placeholder="Wrench"
                  />
                </div>
                <div>
                  <Label>Название</Label>
                  <Input
                    value={editItem.title || ''}
                    onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea
                    value={editItem.description || ''}
                    onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Цена</Label>
                  <Input
                    value={editItem.price || ''}
                    onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                    placeholder="от 500 ₽"
                  />
                </div>
                <Button onClick={() => handleSave('services', editItem)} className="w-full">
                  Сохранить
                </Button>
              </div>
            )}

            {editType === 'gallery' && (
              <div className="space-y-4">
                <div>
                  <Label>URL изображения</Label>
                  <Input
                    value={editItem.url || ''}
                    onChange={(e) => setEditItem({ ...editItem, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label>Название</Label>
                  <Input
                    value={editItem.title || ''}
                    onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                  />
                </div>
                <Button onClick={() => handleSave('gallery', editItem)} className="w-full">
                  Сохранить
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
