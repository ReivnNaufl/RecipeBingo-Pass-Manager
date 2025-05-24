import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
const corsOption = {
  origin: ["http://localhost:5173"],
};
import keyHandler from './api/key.js';
import resetHandler from './api/reset.js';
import keyListHandler from './api/keyList.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors(corsOption));

app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get('/api/key', keyHandler);     
app.get('/api/reset', resetHandler); 
app.get('/api/keyList', keyListHandler);

const keyToEnv = {
  key01: 'PASS1',
  key02: 'PASS2',
  key03: 'PASS3',
  key04: 'PASS4',
  key05: 'PASS5',
  key06: 'PASS6',
  key07: 'PASS7',
  key08: 'PASS8',
  key09: 'PASS9',
  key10: 'PASS10',
};

app.get('/api/key/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'Missing key ID' });
  }
  const id = req.params.id;
  const envKey = keyToEnv[id];
  if (!envKey) {
    return res.status(404).json({ error: 'No mapping for this key ID' });
  }

  const value = process.env[envKey];
  if (!value) {
    return res.status(404).json({ error: 'Env variable not found' });
  }

  res.json({ value });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  // Optional: Graceful shutdown
  // server.close(() => process.exit(1));
});