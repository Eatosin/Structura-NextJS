// Simple test script to verify API fixes
const testCases = [
  {
    name: 'Missing Content-Type header',
    test: async () => {
      const response = await fetch('http://localhost:3000/api/extract', {
        method: 'POST',
        body: JSON.stringify({ text: 'Invoice from Acme Corp for $100' }),
      });
      const data = await response.json();
      console.log('Status:', response.status);
      console.log('Response:', data);
      return response.status === 400 && data.error.includes('Content-Type');
    }
  },
  {
    name: 'Valid request with Content-Type',
    test: async () => {
      const response = await fetch('http://localhost:3000/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Invoice from Acme Corp for $100 on 2024-01-15' }),
      });
      const data = await response.json();
      console.log('Status:', response.status);
      console.log('Response:', data);
      return response.status === 200 && data.object;
    }
  },
  {
    name: 'Empty text validation',
    test: async () => {
      const response = await fetch('http://localhost:3000/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: '' }),
      });
      const data = await response.json();
      console.log('Status:', response.status);
      console.log('Response:', data);
      return response.status === 400 && data.error === 'Invalid input';
    }
  },
  {
    name: 'Text too long validation',
    test: async () => {
      const longText = 'a'.repeat(10001);
      const response = await fetch('http://localhost:3000/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: longText }),
      });
      const data = await response.json();
      console.log('Status:', response.status);
      console.log('Response:', data);
      return response.status === 400 && data.error === 'Invalid input';
    }
  }
];

async function runTests() {
  console.log('Starting API tests...\n');
  
  for (const testCase of testCases) {
    console.log(`\n=== Test: ${testCase.name} ===`);
    try {
      const passed = await testCase.test();
      console.log(passed ? '✅ PASSED' : '❌ FAILED');
    } catch (error) {
      console.log('❌ ERROR:', error.message);
    }
  }
}

runTests();
