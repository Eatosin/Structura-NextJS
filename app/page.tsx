'use client';

import { useState } from 'react';
import { Sparkles, Terminal, ArrowRight, Loader2, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center space-y-6 mb-12 animate-in delay-100">
          <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Extraction
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Structura V2
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Turn messy, unstructured text into perfectly validated JSON.
            <br className="hidden md:block" />
            Powered by <span className="text-blue-600 font-semibold">Next.js</span> •{' '}
            <span className="text-purple-600 font-semibold">Gemini</span> •{' '}
            <span className="text-pink-600 font-semibold">shadcn/ui</span>
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Input Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl animate-in delay-200">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Terminal className="h-4 w-4" />
                <span className="text-sm font-semibold">INPUT</span>
              </div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste messy invoice, email, logs, or any unstructured text here...&#10;&#10;Example: 'Paid $500 to AWS yesterday for cloud hosting services'"
                className="min-h-[360px] bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-blue-400 font-mono text-sm resize-none"
                spellCheck={false}
              />

              <Button
                onClick={handleExtract}
                disabled={loading || !input.trim()}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg disabled:opacity-50"
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
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl min-h-[520px] animate-in delay-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-700">
                <Terminal className="h-4 w-4" />
                <span className="text-sm font-semibold">OUTPUT.JSON</span>
              </div>
              {result && !result.error && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full bg-gray-200" />
                  <Skeleton className="h-8 w-3/4 bg-gray-200" />
                  <Skeleton className="h-8 w-full bg-gray-200" />
                  <Skeleton className="h-8 w-5/6 bg-gray-200" />
                </div>
              ) : result ? (
                result.error ? (
                  <div className="flex items-center justify-center h-96">
                    <p className="text-red-600 text-center font-medium">Error: {result.error}</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96 custom-scrollbar border border-gray-200">
                    <JsonView
                      data={result}
                      shouldExpandNode={allExpanded}
                      style={defaultStyles}
                    />
                  </div>
                )
              ) : (
                <div className="h-96 flex flex-col items-center justify-center text-gray-400">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 animate-[spin_8s_linear_infinite] mb-4" />
                  <p className="text-lg font-medium">Waiting for input...</p>
                  <p className="text-sm mt-2">Paste some text to get started</p>
                </div>
              )}
            </div>

            {result && !result.error && (
              <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-b-lg" />
            )}
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 animate-in delay-300">
          <p>Built with ❤️ using Next.js 16, Gemini AI, and shadcn/ui</p>
        </div>
      </div>
    </main>
  );
}
