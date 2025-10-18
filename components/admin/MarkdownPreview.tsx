'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Code } from 'lucide-react';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Vorschau</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2"
          >
            {isPreview ? (
              <>
                <Code className="h-4 w-4" />
                Markdown
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Vorschau
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isPreview ? (
          <MarkdownRenderer content={content} />
        ) : (
          <pre className="whitespace-pre-wrap text-sm font-mono text-muted-foreground bg-muted p-4 rounded-lg overflow-x-auto">
            {content}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}


