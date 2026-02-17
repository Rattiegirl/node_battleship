import express from 'express';
import path from 'path';
import { getState, resetGame, playerMove } from './gameService';

const app = express();
app.use(express.json());

const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

app.get('/', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/storybook', (_req, res) => {
  res.sendFile(path.join(publicDir, 'storybook.html'));
});

app.get('/state', (_req, res) => {
  res.json(getState());
});

app.post('/reset', (_req, res) => {
  const state = resetGame();
  res.json({ message: 'You have reset the game', ...state });
});

app.post('/move', (req, res) => {
  try {
    const { coordinate } = req.body ?? {};
    if (typeof coordinate !== 'string') {
      return res.status(400).json({
        detail: 'Invalid coordinate format (use a1–j10)',
        ...getState(),
      });
    }

    const result = playerMove(coordinate);
    const state = getState();

    if (result.message === 'Game is already finished') {
      return res.json({ message: result.message, ...state });
    }
    if (result.message === "It's not your turn") {
      return res.json({ message: result.message, ...state });
    }
    if (result.message === 'Already targeted') {
      return res.json({ message: result.message, ...state });
    }

    res.json({ ...result, ...state });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid request';
    if (message.includes('Invalid coordinate')) {
      return res.status(400).json({
        detail: message,
        ...getState(),
      });
    }
    throw err;
  }
});

const PORT = process.env.PORT ?? 3111;
app.listen(PORT, () => {
  console.log(`Battleship server running at http://localhost:${PORT}`);
});
