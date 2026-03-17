import express, {Request, Response} from 'express';
import { Field, FieldStateResponse } from './types';

const app = express();
app.use(express.json());

const field: Field = [
    ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '
]
const player = 'O'
const winner = 'undetermined'

app.get('/api/field', (_req: Request, res: Response<FieldStateResponse>) => {
  res.json({
    field, player, winner 
  });
});

const PORT = process.env.PORT ?? 3112;
app.listen(PORT, () => {
  console.log(`Tic Tac Toe game running at http://localhost:${PORT}`);
});