import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface VideoReview {
  id: number;
  thumbnail: string;
  title: string;
  author: string;
  rating: number;
  videoUrl: string;
}

export default function VideoReviews() {
  const reviews: VideoReview[] = [
    {
      id: 1,
      thumbnail: 'https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/2a658843-9501-4fad-88b4-f7a12d5be2af.jpg',
      title: 'Отличный ремонт окон в новостройке',
      author: 'Марина Петрова',
      rating: 5,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: 2,
      thumbnail: 'https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/f6e182ea-4d07-4a6e-86bc-b49b23e4e84b.jpg',
      title: 'Быстро заменили фурнитуру',
      author: 'Алексей Смирнов',
      rating: 5,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: 3,
      thumbnail: 'https://cdn.poehali.dev/projects/2f1f8425-5be9-4c47-ae8b-739ef6314b65/files/52f2bf59-4bcb-4f7a-93b2-435a0f4f92fc.jpg',
      title: 'Устранили сквозняк за час',
      author: 'Елена Иванова',
      rating: 5,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Icon
            key={index}
            name="Star"
            size={18}
            className={index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {reviews.map((review) => (
        <Card 
          key={review.id}
          className="border-2 border-primary/20 hover:border-primary transition-all hover:shadow-xl group overflow-hidden cursor-pointer"
          onClick={() => window.open(review.videoUrl, '_blank')}
        >
          <CardContent className="p-0">
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              <img
                src={review.thumbnail}
                alt={review.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon name="Play" className="text-primary ml-1" size={32} />
                </div>
              </div>
              <div className="absolute top-3 right-3">
                <Badge variant="destructive" className="text-xs px-2 py-1 font-bold">
                  <Icon name="Video" size={14} className="inline mr-1" />
                  ВИДЕО
                </Badge>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold">
                2:15
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-base text-secondary line-clamp-2">{review.title}</h3>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <Icon name="User" className="text-primary" size={16} />
                  </div>
                  <span className="text-sm text-muted-foreground">{review.author}</span>
                </div>
                {renderStars(review.rating)}
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Icon name="CheckCircle2" size={16} className="text-green-600" />
                  Проверенный отзыв
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
