const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const packageJson = require('./package.json');

const app = express();
const db = new Database(path.join(__dirname, 'toto.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    name TEXT DEFAULT ''
  )
`);

const existingColumns = db.prepare("PRAGMA table_info(todos)").all();
if (!existingColumns.some((c) => c.name === 'name')) {
  db.exec(`ALTER TABLE todos ADD COLUMN name TEXT DEFAULT ''`);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Version/build-id för lappen, så det syns vilken deploy som är live
app.get('/version', (req, res) => {
  res.json({
    version: packageJson.version,
    commit: (process.env.RENDER_GIT_COMMIT || 'dev').slice(0, 7)
  });
});

// Hämta alla todos
app.get('/todos', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos ORDER BY id').all();
  res.json(todos);
});

// Lägg till todo
app.post('/todos', (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text) return res.status(400).json({ error: 'text saknas' });
  // Namn skickas vidare rakt av: ingen trimning, ingen längdgräns (GUI:t begränsar till 20 tecken)
  const name = req.body.name || '';
  const info = db.prepare('INSERT INTO todos (text, done, name) VALUES (?, 0, ?)').run(text, name);
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(info.lastInsertRowid);
  res.json(todo);
});

// Editera todo / markera klar
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'hittades inte' });

  const text = req.body.text !== undefined ? req.body.text : existing.text;
  const done = req.body.done !== undefined ? (req.body.done ? 1 : 0) : existing.done;
  // Annan gräns än vid skapande (15 tecken här mot ingen vid POST) och tyst trunkering utan felmeddelande
  let name = req.body.name !== undefined ? req.body.name : existing.name;
  if (name.length > 15) name = name.slice(0, 15);

  db.prepare('UPDATE todos SET text = ?, done = ?, name = ? WHERE id = ?').run(text, done, name, id);
  const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  res.json(updated);
});

// Ta bort todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const info = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'hittades inte' });
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`VASS Todo-List körs på http://localhost:${PORT}`));
