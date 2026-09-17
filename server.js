const express = require('express');
const app = express();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

app.use(express.json());
app.use(express.static(__dirname));

async function supabase(method, body) {
  console.log('Supabase call:', method, SUPABASE_URL ? 'URL ok' : 'URL MISSING', SUPABASE_KEY ? 'KEY ok' : 'KEY MISSING');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/entries`, {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=minimal' : ''
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (method === 'GET') return res.json();
  return res;
}

app.get('/entries', async (req, res) => {
  try {
    const data = await supabase('GET');
    console.log('GET entries:', JSON.stringify(data).slice(0,100));
    res.json(data);
  } catch(e) {
    console.log('GET error:', e.message);
    res.status(500).json([]);
  }
});

app.post('/entries', async (req, res) => {
  const { name, date } = req.body;
  if (!name || !date) return res.status(400).json({ error: 'Nedostaje ime ili datum.' });
  try {
    const r = await supabase('POST', { name, date });
    console.log('POST status:', r.status);
    res.json({ ok: true });
  } catch(e) {
    console.log('POST error:', e.message);
    res.status(500).json({ error: 'Greška pri spremanju.' });
  }
});

app.listen(process.env.PORT || 3000);
