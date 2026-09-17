const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(__dirname));

function load() {
  try { return JSON.parse(fs.readFileSync(DATA, 'utf8')); } catch(e) { return []; }
}
function save(entries) {
  fs.writeFileSync(DATA, JSON.stringify(entries));
}

app.get('/entries', (req, res) => res.json(load()));

app.post('/entries', (req, res) => {
  const { name, date } = req.body;
  if (!name || !date) return res.status(400).json({ error: 'Nedostaje ime ili datum.' });
  const entries = load();
  entries.push({ name, date });
  save(entries);
  res.json({ ok: true });
});

app.listen(process.env.PORT || 3000);
