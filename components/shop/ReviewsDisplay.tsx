'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  verified: boolean;
  customerName: string;
  createdAt: string;
}

interface ReviewsDisplayProps {
  gemstoneId: string;
  verifiedOnly?: boolean;
}

export function ReviewsDisplay({ gemstoneId, verifiedOnly = false }: ReviewsDisplayProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const params = new URLSearchParams({
          gemstoneId,
          verifiedOnly: verifiedOnly.toString(),
        });
        const response = await fetch(`/api/reviews?${params}`);
        const data = await response.json();

        if (data.success) {
          setReviews(data.reviews);
          if (data.reviews.length > 0) {
            const avg =
              data.reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) /
              data.reviews.length;
            setAverageRating(avg);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [gemstoneId, verifiedOnly]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="h-32 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bewertungen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Noch keine Bewertungen vorhanden.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {reviews.length} {reviews.length === 1 ? 'Bewertung' : 'Bewertungen'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verifizierter Kauf
                      </Badge>
                    )}
                  </div>
                  {review.title && (
                    <CardTitle className="text-lg">{review.title}</CardTitle>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(review.createdAt)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">{review.comment}</p>
              <p className="text-xs text-muted-foreground">— {review.customerName}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

