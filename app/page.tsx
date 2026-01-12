'use client';
import { useState, useRef, useEffect } from 'react';

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
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-6 sm:p-12 font-sans">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-block px-3 py-1 text-xs font-medium bg-blue-900/30 text-blue-400 rounded-full border border-blue-800">
            AI Powered
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Structura V2</h1>
          <p className="text-zinc-400">Turn messy text into perfect JSON.</p>
        </div>

        <div className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste invoice or email text here..."
            className="w-full h-40 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all placeholder:text-zinc-600"
          />
          
          <button
            onClick={handleExtract}
            disabled={loading || !input}
            className="w-full bg-white text-black hover:bg-zinc-200 disabled:opacity-50 font-bold py-3 rounded-xl transition-all"
          >
            {loading ? 'Processing...' : 'Extract Structure →'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4">
            <label className="text-sm font-medium text-green-400">✅ Validated Output</label>
            <pre className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl overflow-x-auto text-sm text-zinc-300">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
