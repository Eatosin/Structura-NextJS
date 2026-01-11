'use client';

import { useState } from 'react';
import { Sparkles, Terminal, ArrowRight, Loader2, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { JsonView, allExpanded, darkStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleExtract() {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      const data = await response.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      setResult({ error: 'Extraction failed — try again' });
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-[#030303] text-white overflow-hidden relative selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center space-y-6 mb-16 animate-fade-in">
          <Badge variant="outline" className="border-indigo-500/20 text-indigo-400">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Extraction
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Structura V2
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Turn messy, unstructured text into perfectly validated JSON.
            <br className="hidden md:block" />
            Powered by <span className="text-white font-medium">Next.js</span> •{' '}
            <span className="text-white font-medium">Gemini</span> •{' '}
            <span className="text-white font-medium">shadcn/ui</span>
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Input Card */}
          <Card className="bg-[#0A0A0A]/80 border-white/10 backdrop-blur supports-[backdrop-filter]:bg-[#0A0A0A]/60">
            <div className="p-6 space-y-6">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste messy invoice, email, logs, or any unstructured text here..."
                className="min-h-[360px] bg-transparent border-white/10 focus:border-indigo-500/50 font-mono text-sm resize-none"
                spellCheck={false}
              />

              <Button
                onClick={handleExtract}
                disabled={loading || !input.trim()}
                size="lg"
                className="w-full bg-white text-black hover:bg-neutral-200 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Extract Structure
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Output Card */}
          <Card className="bg-[#0A0A0A]/80 border-white/10 backdrop-blur supports-[backdrop-filter]:bg-[#0A0A0A]/60 min-h-[480px]">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2 text-neutral-400">
                <Terminal className="h-4 w-4" />
                <span className="text-sm font-mono">OUTPUT.JSON</span>
              </div>
              {result && !result.error && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="text-neutral-400 hover:text-white"
                >
                  {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full bg-white/5" />
                  <Skeleton className="h-8 w-3/4 bg-white/5" />
                  <Skeleton className="h-8 w-full bg-white/5" />
                </div>
              ) : result ? (
                result.error ? (
                  <p className="text-red-400 text-center">Error: {result.error}</p>
                ) : (
                  <div className="bg-black/40 rounded-lg p-4 overflow-auto max-h-96">
                    <JsonView
                      data={result}
                      shouldExpandNode={allExpanded}
                      style={darkStyles}
                    />
                  </div>
                )
              ) : (
                <div className="h-96 flex flex-col items-center justify-center text-neutral-600">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-neutral-700 animate-[spin_8s_linear_infinite]" />
                  <p className="mt-4 text-lg">Waiting for input...</p>
                </div>
              )}
            </div>

            {result && !result.error && (
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-b-lg" />
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
