import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Certificate {
  id: number;
  image: string;
  title: string;
  description: string;
  icon: string;
}

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const certificates: Certificate[] = [
    {
      id: 1,
      image: 'https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/2bb0f5b8-35e5-4e0b-a29e-1a917ef41efc.jpg',
      title: 'Лицензия на осуществление деятельности',
      description: 'Официальная лицензия на право выполнения ремонтных работ',
      icon: 'FileText'
    },
    {
      id: 2,
      image: 'https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/50a9f911-a344-44fc-8c43-c8349989e9a1.jpg',
      title: 'Сертификат качества',
      description: 'Подтверждение соответствия работ стандартам качества',
      icon: 'Award'
    },
    {
      id: 3,
      image: 'https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/13010d9a-36a8-44ea-80f7-c1cdef289b61.jpg',
      title: 'Страхование ответственности',
      description: 'Полис страхования профессиональной ответственности',
      icon: 'Shield'
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <Card
            key={cert.id}
            className="border-2 border-primary/20 hover:border-primary transition-all hover:shadow-xl cursor-pointer group overflow-hidden"
            onClick={() => setSelectedCert(cert)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-blue-50 to-white">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <Icon name="ZoomIn" className="text-white mx-auto mb-2" size={32} />
                    <p className="text-white font-semibold">Нажмите для увеличения</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="default" className="text-xs px-2 py-1">
                    <Icon name={cert.icon as any} size={14} className="inline mr-1" />
                    Официально
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-base text-secondary line-clamp-2">{cert.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{cert.description}</p>
                <div className="flex items-center gap-2 text-xs text-green-600 font-semibold pt-2">
                  <Icon name="CheckCircle2" size={16} />
                  <span>Действующий документ</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <Icon name="Shield" className="mx-auto mb-2 text-green-600" size={32} />
            <p className="text-sm font-semibold text-secondary">15 лет</p>
            <p className="text-xs text-muted-foreground">на рынке</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Icon name="Users" className="mx-auto mb-2 text-blue-600" size={32} />
            <p className="text-sm font-semibold text-secondary">2000+</p>
            <p className="text-xs text-muted-foreground">довольных клиентов</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Icon name="Award" className="mx-auto mb-2 text-orange-600" size={32} />
            <p className="text-sm font-semibold text-secondary">100%</p>
            <p className="text-xs text-muted-foreground">гарантия качества</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Icon name="FileCheck" className="mx-auto mb-2 text-purple-600" size={32} />
            <p className="text-sm font-semibold text-secondary">Договор</p>
            <p className="text-xs text-muted-foreground">на каждый заказ</p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-3xl p-0">
          {selectedCert && (
            <div className="space-y-4 p-6">
              <div className="text-center space-y-2">
                <Badge variant="default" className="mb-2">
                  <Icon name={selectedCert.icon as any} size={16} className="inline mr-1" />
                  Официальный документ
                </Badge>
                <h3 className="text-2xl font-bold text-secondary">{selectedCert.title}</h3>
                <p className="text-muted-foreground">{selectedCert.description}</p>
              </div>

              <div className="aspect-[3/4] overflow-hidden rounded-lg border-2 border-primary/30">
                <img
                  src={selectedCert.image}
                  alt={selectedCert.title}
                  className="w-full h-full object-contain bg-white"
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-semibold">
                <Icon name="CheckCircle2" size={18} />
                <p>Документ действителен и проверен</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
