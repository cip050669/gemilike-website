'use client';

import { useEffect, useState } from 'react';
import { Star, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  verified: boolean;
  customerName: string;
  customerEmail: string | null;
  gemstone: {
    id: string;
    name: string;
    slug: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams();
      if (filter === 'verified') params.append('status', 'verified');
      if (filter === 'unverified') params.append('status', 'unverified');

      const response = await fetch(`/api/admin/reviews?${params}`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (reviewId: string, verified: boolean) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified }),
      });

      const data = await response.json();
      if (data.success) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diese Bewertung löschen möchten?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reviews?id=${reviewId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800/50 p-8">
        <div className="container mx-auto">
          <div className="text-white">Lade Bewertungen...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">Bewertungen</h1>
          <p className="text-gray-300">Verwalten Sie alle Produktbewertungen</p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Alle ({reviews.length})
          </Button>
          <Button
            variant={filter === 'verified' ? 'default' : 'outline'}
            onClick={() => setFilter('verified')}
          >
            Verifiziert ({reviews.filter((r) => r.verified).length})
          </Button>
          <Button
            variant={filter === 'unverified' ? 'default' : 'outline'}
            onClick={() => setFilter('unverified')}
          >
            Nicht verifiziert ({reviews.filter((r) => !r.verified).length})
          </Button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      {review.verified ? (
                        <Badge variant="secondary">Verifiziert</Badge>
                      ) : (
                        <Badge variant="outline">Nicht verifiziert</Badge>
                      )}
                    </div>
                    {review.title && (
                      <CardTitle className="text-lg">{review.title}</CardTitle>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!review.verified && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerify(review.id, true)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Verifizieren
                      </Button>
                    )}
                    {review.verified && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerify(review.id, false)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Verifizierung entfernen
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{review.comment}</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>Kunde:</strong> {review.customerName}
                    {review.customerEmail && ` (${review.customerEmail})`}
                  </p>
                  {review.gemstone && (
                    <p>
                      <strong>Produkt:</strong>{' '}
                      <Link
                        href={`/de/shop/${review.gemstone.slug}`}
                        className="text-blue-500 hover:underline"
                      >
                        {review.gemstone.name}
                      </Link>
                    </p>
                  )}
                  <p>
                    <strong>Datum:</strong> {formatDate(review.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          {reviews.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Keine Bewertungen gefunden.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

