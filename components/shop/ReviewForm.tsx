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
        <CardTitle id="review-form-heading">Bewertung schreiben</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Live-Region für Status-Meldungen */}
        {message && (
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={`mb-4 p-3 rounded-md ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}
        {/* Progressive Enhancement: HTML-Schicht mit action/method für Fallback */}
        <form 
          onSubmit={handleSubmit} 
          action="/api/reviews" 
          method="POST"
          className="space-y-4"
          aria-label="Bewertungsformular"
          noValidate
        >
          <input type="hidden" name="gemstoneId" value={gemstoneId} />
          {orderItemId && <input type="hidden" name="orderItemId" value={orderItemId} />}
          
          <div>
            <label 
              htmlFor="review-rating" 
              className="text-sm font-medium mb-2 block"
              id="rating-label"
            >
              Bewertung <span aria-label="erforderlich">*</span>
            </label>
            <div 
              className="flex items-center gap-2"
              role="radiogroup"
              aria-labelledby="rating-label"
              aria-required="true"
            >
              {renderStars()}
            </div>
            <input 
              type="hidden" 
              name="rating" 
              value={rating || ''} 
              required 
              aria-required="true"
            />
            <span id="rating-help" className="sr-only">
              Bitte wählen Sie eine Bewertung von 1 bis 5 Sternen aus
            </span>
          </div>

          <div>
            <label 
              htmlFor="review-title" 
              className="text-sm font-medium mb-2 block"
              id="title-label"
            >
              Titel (optional)
            </label>
            <Input
              id="review-title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titel Ihrer Bewertung"
              maxLength={100}
              disabled={submitting}
              aria-labelledby="title-label"
              aria-describedby="title-help"
              autoComplete="off"
            />
            <span id="title-help" className="sr-only">
              Optional: Geben Sie einen Titel für Ihre Bewertung ein (max. 100 Zeichen)
            </span>
          </div>

          <div>
            <label 
              htmlFor="review-comment" 
              className="text-sm font-medium mb-2 block"
              id="comment-label"
            >
              Kommentar (optional)
            </label>
            <Textarea
              id="review-comment"
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Teilen Sie Ihre Erfahrungen mit..."
              rows={4}
              maxLength={1000}
              disabled={submitting}
              aria-labelledby="comment-label"
              aria-describedby="comment-help comment-counter"
              autoComplete="off"
            />
            <div className="flex justify-between items-center mt-1">
              <span id="comment-help" className="sr-only">
                Optional: Teilen Sie Ihre Erfahrungen mit diesem Edelstein (max. 1000 Zeichen)
              </span>
              <p 
                id="comment-counter"
                className="text-xs text-muted-foreground"
                aria-live="polite"
              >
                {comment.length}/1000 Zeichen
              </p>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={submitting || rating === 0}
            aria-label="Bewertung absenden"
            aria-describedby="submit-help"
          >
            <Send className="h-4 w-4 mr-2" aria-hidden="true" />
            {submitting ? (
              <span aria-live="polite" aria-busy="true">Wird gesendet...</span>
            ) : (
              'Bewertung absenden'
            )}
          </Button>
          <span id="submit-help" className="sr-only">
            Klicken Sie hier, um Ihre Bewertung zu senden. Eine Bewertung ist erforderlich.
          </span>
        </form>

        {/* Progressive Enhancement: noscript Fallback */}
        <noscript>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Hinweis:</strong> JavaScript ist deaktiviert. Das Formular wird über einen normalen Formular-Submit gesendet.
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Bitte stellen Sie sicher, dass Sie eine Bewertung ausgewählt haben, bevor Sie das Formular absenden.
            </p>
          </div>
        </noscript>
      </CardContent>
    </Card>
  );
}

