'use client';

import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// Toast wird über window.alert ersetzt, falls kein Toast-System vorhanden

interface ReviewFormProps {
  gemstoneId: string;
  orderItemId?: string;
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ gemstoneId, orderItemId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setMessage({ type: 'error', text: 'Bitte wählen Sie eine Bewertung aus.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gemstoneId,
          orderItemId,
          rating,
          title: title.trim() || undefined,
          comment: comment.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Ihre Bewertung wurde erfolgreich gespeichert.' });
        setTimeout(() => setMessage(null), 3000);
        setRating(0);
        setTitle('');
        setComment('');
        onReviewSubmitted?.();
      } else {
        setMessage({ type: 'error', text: data.error || 'Fehler beim Erstellen der Bewertung.' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage({ type: 'error', text: 'Fehler beim Erstellen der Bewertung.' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= (hoveredRating || rating);

      return (
        <button
          key={i}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none"
          disabled={submitting}
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } ${submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
          />
        </button>
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bewertung schreiben</CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <div
            className={`mb-4 p-3 rounded-md ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Bewertung *</label>
            <div className="flex items-center gap-2">{renderStars()}</div>
          </div>

          <div>
            <label htmlFor="review-title" className="text-sm font-medium mb-2 block">
              Titel (optional)
            </label>
            <Input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titel Ihrer Bewertung"
              maxLength={100}
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="review-comment" className="text-sm font-medium mb-2 block">
              Kommentar (optional)
            </label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Teilen Sie Ihre Erfahrungen mit..."
              rows={4}
              maxLength={1000}
              disabled={submitting}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/1000 Zeichen
            </p>
          </div>

          <Button type="submit" disabled={submitting || rating === 0}>
            <Send className="h-4 w-4 mr-2" />
            {submitting ? 'Wird gesendet...' : 'Bewertung absenden'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

