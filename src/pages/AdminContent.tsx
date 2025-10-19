import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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

  const [editDialog, setEditDialog] = useState(false);
  const [editType, setEditType] = useState<'service' | 'pricing' | 'gallery'>('service');
  const [editItem, setEditItem] = useState<any>({});

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

  const handleSave = async () => {
    try {
      const method = editItem.id ? 'PUT' : 'POST';
      const typeMap = { service: 'services', pricing: 'pricing', gallery: 'gallery' };
      const type = typeMap[editType];

      await fetch(`${CONTENT_API}?type=${type}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': ADMIN_PASSWORD
        },
        body: JSON.stringify(editItem)
      });
      
      toast({ title: 'Успех', description: 'Сохранено' });
      setEditDialog(false);
      setEditItem({});
      fetchAllContent();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось сохранить', variant: 'destructive' });
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm('Удалить этот элемент?')) return;
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

  const openEditDialog = (type: 'service' | 'pricing' | 'gallery', item: any = {}) => {
    setEditType(type);
    setEditItem(item);
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
            <Button onClick={() => openEditDialog('service')}>
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
                          <Icon name={service.icon} size={24} className="text-primary" />
                          <h3 className="text-xl font-bold">{service.title}</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">{service.description}</p>
                        <p className="text-lg font-semibold text-primary">{service.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditDialog('service', service)}
                        >
                          <Icon name="Edit" size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDelete('services', service.id)}
                        >
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
                      {Array.isArray(tier.features) && tier.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Icon name="Check" className="text-primary mt-1" size={16} />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openEditDialog('pricing', tier)}
                        className="flex-1"
                      >
                        <Icon name="Edit" size={16} className="mr-2" />
                        Изменить
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete('pricing', tier.id)}
                      >
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
                    {item.description && <p className="text-sm text-muted-foreground mb-4">{item.description}</p>}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openEditDialog('gallery', item)}
                        className="flex-1"
                      >
                        <Icon name="Edit" size={16} className="mr-2" />
                        Изменить
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete('gallery', item.id)}
                      >
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
                      <Label className="mb-2 block">
                        {setting.description || setting.setting_key}
                      </Label>
                      {setting.setting_type === 'textarea' ? (
                        <Textarea
                          value={setting.setting_value}
                          onChange={(e) => {
                            const updated = settings.map(s => 
                              s.setting_key === setting.setting_key 
                                ? { ...s, setting_value: e.target.value }
                                : s
                            );
                            setSettings(updated);
                          }}
                          rows={3}
                        />
                      ) : (
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
                      )}
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

        <Dialog open={editDialog} onOpenChange={setEditDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editItem.id ? 'Редактировать' : 'Добавить'}{' '}
                {editType === 'service' && 'услугу'}
                {editType === 'pricing' && 'тариф'}
                {editType === 'gallery' && 'фото'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {editType === 'service' && (
                <>
                  <div>
                    <Label>Название услуги</Label>
                    <Input
                      value={editItem.title || ''}
                      onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                      placeholder="Ремонт окон"
                    />
                  </div>
                  <div>
                    <Label>Описание</Label>
                    <Textarea
                      value={editItem.description || ''}
                      onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                      placeholder="Описание услуги"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Цена</Label>
                    <Input
                      value={editItem.price || ''}
                      onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                      placeholder="от 1500 ₽"
                    />
                  </div>
                  <div>
                    <Label>Иконка (название из lucide-react)</Label>
                    <Input
                      value={editItem.icon || ''}
                      onChange={(e) => setEditItem({ ...editItem, icon: e.target.value })}
                      placeholder="Wrench"
                    />
                  </div>
                </>
              )}

              {editType === 'pricing' && (
                <>
                  <div>
                    <Label>Название тарифа</Label>
                    <Input
                      value={editItem.name || ''}
                      onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                      placeholder="Базовый"
                    />
                  </div>
                  <div>
                    <Label>Описание</Label>
                    <Input
                      value={editItem.description || ''}
                      onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                      placeholder="Для небольших задач"
                    />
                  </div>
                  <div>
                    <Label>Цена (только число)</Label>
                    <Input
                      type="number"
                      value={editItem.price || ''}
                      onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <Label>Иконка (название из lucide-react)</Label>
                    <Input
                      value={editItem.icon || ''}
                      onChange={(e) => setEditItem({ ...editItem, icon: e.target.value })}
                      placeholder="Package"
                    />
                  </div>
                  <div>
                    <Label>Функции (одна на строку)</Label>
                    <Textarea
                      value={Array.isArray(editItem.features) ? editItem.features.join('\n') : ''}
                      onChange={(e) => setEditItem({ 
                        ...editItem, 
                        features: e.target.value.split('\n').filter(f => f.trim()) 
                      })}
                      placeholder="Консультация специалиста&#10;Выезд мастера&#10;Гарантия 1 год"
                      rows={5}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editItem.is_popular || false}
                      onChange={(e) => setEditItem({ ...editItem, is_popular: e.target.checked })}
                      id="is_popular"
                      className="w-4 h-4"
                    />
                    <Label htmlFor="is_popular">Популярный тариф</Label>
                  </div>
                </>
              )}

              {editType === 'gallery' && (
                <>
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
                      placeholder="Название работы"
                    />
                  </div>
                  <div>
                    <Label>Описание (необязательно)</Label>
                    <Textarea
                      value={editItem.description || ''}
                      onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                      placeholder="Описание работы"
                      rows={2}
                    />
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialog(false)}>Отмена</Button>
              <Button onClick={handleSave}>Сохранить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
