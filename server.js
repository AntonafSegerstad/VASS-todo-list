const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const db = new Database(path.join(__dirname, 'toto.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  )
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Hämta alla todos
app.get('/todos', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos ORDER BY id').all();
  res.json(todos);
});

// Lägg till todo
app.post('/todos', (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text) return res.status(400).json({ error: 'text saknas' });
  const info = db.prepare('INSERT INTO todos (text, done) VALUES (?, 0)').run(text);
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

  db.prepare('UPDATE todos SET text = ?, done = ? WHERE id = ?').run(text, done, id);
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
app.listen(PORT, () => console.log(`VASS Toto-List körs på http://localhost:${PORT}`));
