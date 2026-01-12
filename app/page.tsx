'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  async function handleExtract() {
    if (!input.trim()) {
      setError('Please enter some text to extract.');
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error('Extraction failed');

      const data = await response.json();
      setResult(data);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError('Error: Could not extract data. Check API Key.');
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center p-6 sm:p-12 font-sans">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            AI Powered
          </Badge>
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Structura V2
            </h1>
            <p className="text-muted-foreground text-lg">
              Turn messy text into perfect JSON with AI
            </p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Extract Structured Data</CardTitle>
            <CardDescription>
              Paste any invoice, receipt, or email text below and let AI extract structured information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="input-text" className="text-sm font-medium">
                Input Text
              </label>
              <Textarea
                id="input-text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Example: Invoice from Acme Corp for $1,250.00 dated 2024-01-15. Payment received."
                className="min-h-[160px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {input.length} / 10000 characters
              </p>
            </div>
            
            <Button
              onClick={handleExtract}
              disabled={loading || !input.trim()}
              className="w-full h-11 text-base font-semibold"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  Extract Structure
                  <Sparkles className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-destructive">Error</p>
                  <p className="text-sm text-destructive/90 mt-1">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Result Card */}
        {result && (
          <Card className="border-green-500/50 bg-green-500/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle className="text-green-600 dark:text-green-400">
                  Extraction Complete
                </CardTitle>
              </div>
              <CardDescription>
                Validated structured data extracted from your input
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm border">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
