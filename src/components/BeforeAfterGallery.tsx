import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface BeforeAfterImage {
  id: number;
  before: string;
  after: string;
  title: string;
  description: string;
}

export default function BeforeAfterGallery() {
  const [selectedImage, setSelectedImage] = useState<BeforeAfterImage | null>(null);
  const [activeTab, setActiveTab] = useState<{ [key: number]: 'before' | 'after' }>({});

  const images: BeforeAfterImage[] = [
    {
      id: 1,
      before: 'https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/2a658843-9501-4fad-88b4-f7a12d5be2af.jpg',
      after: 'https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/2a658843-9501-4fad-88b4-f7a12d5be2af.jpg',
      title: 'Замена уплотнителя',
      description: 'Устранение сквозняков и улучшение теплоизоляции'
    },
    {
      id: 2,
      before: 'https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/f6e182ea-4d07-4a6e-86bc-b49b23e4e84b.jpg',
      after: 'https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/f6e182ea-4d07-4a6e-86bc-b49b23e4e84b.jpg',
      title: 'Замена фурнитуры',
      description: 'Восстановление работы механизма открывания'
    },
    {
      id: 3,
      before: 'https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/52f2bf59-4bcb-4f7a-93b2-435a0f4f92fc.jpg',
      after: 'https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/52f2bf59-4bcb-4f7a-93b2-435a0f4f92fc.jpg',
      title: 'Регулировка створок',
      description: 'Устранение провисания и плотное прилегание'
    }
  ];

  const toggleTab = (id: number) => {
    setActiveTab(prev => ({
      ...prev,
      [id]: prev[id] === 'after' ? 'before' : 'after'
    }));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((image) => {
          const currentView = activeTab[image.id] || 'before';
          return (
            <Card 
              key={image.id} 
              className="border-2 border-primary/20 hover:border-primary transition-all hover:shadow-xl cursor-pointer group overflow-hidden"
              onClick={() => setSelectedImage(image)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={currentView === 'before' ? image.before : image.after}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <Badge 
                      variant={currentView === 'before' ? 'destructive' : 'default'}
                      className="text-sm px-3 py-1 font-bold"
                    >
                      {currentView === 'before' ? '❌ ДО' : '✅ ПОСЛЕ'}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <Icon name="ZoomIn" className="text-white mx-auto mb-2" size={32} />
                      <p className="text-white text-center font-semibold">Нажмите для увеличения</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-lg text-secondary">{image.title}</h3>
                  <p className="text-sm text-muted-foreground">{image.description}</p>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTab(image.id);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors font-semibold text-primary"
                  >
                    <Icon name="Repeat" size={20} />
                    Переключить {currentView === 'before' ? 'на ПОСЛЕ' : 'на ДО'}
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0">
          {selectedImage && (
            <div className="space-y-4 p-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-secondary">{selectedImage.title}</h3>
                <p className="text-muted-foreground">{selectedImage.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="destructive" className="text-sm px-3 py-1 font-bold">
                    ❌ ДО ремонта
                  </Badge>
                  <div className="aspect-[4/3] overflow-hidden rounded-lg border-2 border-destructive/30">
                    <img
                      src={selectedImage.before}
                      alt="До ремонта"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="default" className="text-sm px-3 py-1 font-bold">
                    ✅ ПОСЛЕ ремонта
                  </Badge>
                  <div className="aspect-[4/3] overflow-hidden rounded-lg border-2 border-primary/30">
                    <img
                      src={selectedImage.after}
                      alt="После ремонта"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
                <Icon name="Info" size={16} />
                <p>Реальные фотографии наших работ</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
