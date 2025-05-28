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
import recipeListHandler from './api/recipeList.js';
import userListHandler from './api/userList.js';
import session from 'express-session';
import argon2 from 'argon2';
import otpRequestHandler from './api/otp/request.js';
import otpVerifyHandler from './api/otp/verify.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())

app.use(cors(corsOption));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

function requireLogin(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
}

app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get('/api/key', keyHandler);     
app.get('/api/reset', resetHandler); 
app.get('/api/keyList', keyListHandler);
app.get('/api/recipeList', recipeListHandler);
app.get('/api/userList', userListHandler);
app.post('/api/otp/request', otpRequestHandler);
app.post('/api/otp/verify', otpVerifyHandler);

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL) {
          console.log('a')
            const valid = await argon2.verify(process.env.HASHED_ADMIN_PASSWORD, password);
            if (valid) {
                req.session.loggedIn = true;
                return res.status(200).send('Logged in!');
            }
          console.log('b')
        }

        res.status(401).send('Invalid credentials');
    } catch(e){
        console.error('Error:', e);
        res.status(500).json({ error: 'Failed to login' });
    }
})

app.get('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.send('Logged out');
  });
});

app.get('/api/isLoggedIn', (req, res) => {
  if (req.session.loggedIn) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});



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