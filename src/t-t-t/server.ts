import express, { Request, Response } from 'express';
import { Field, FieldStateResponse, Player, Winner } from './types';
import { MoveBody, MoveResponse } from './types';
import { fieldToWinner, move } from './logic';
import path from 'path'
const app = express();
app.use(express.json());

const publicDir = path.join(__dirname, '../..', 'public-t-t-t');
app.use(express.static(publicDir));

let field: Field = [
  ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '
]
let player: Player = 'O'
let winner: Winner = 'undetermined'
let history = []

app.get('/api/field', (_req: Request, res: Response<FieldStateResponse>) => {
  res.json({
    field, player, winner
  });
});

app.put('/api/fields', (_req: Request, res: Response<FieldStateResponse>) => {
  field = [
    ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '
  ]
  player = 'O'
  winner = 'undetermined'
  history = []
  //history[{player, coord}]
  res.json({
    field, player, winner
  });
});

app.post('/api/move', (_req: Request<MoveBody>, res: Response<MoveResponse>) => {
  // const reqPlayer = _req.body.player
  // const reqCoords = _req.body.coordinates
  if (winner !== 'undetermined') {
    return res.json({
      field, player, winner, success: false, error: "A winner is clear, the game is over"
    });
  }
  const { player: reqPlayer, coordinate } = _req.body
  if (field[coordinate] !== ' ') {
    return res.json({
      field, player, winner, success: false, error: "That coordinate is already taken."
    });
  }
  move(reqPlayer, coordinate, field)
  if (fieldToWinner(field) !== "undetermined") {
    winner = fieldToWinner(field)
    return res.json({
      field, player, winner, success: true
    });
  }
  player = player === 'X' ? 'O' : 'X'
  //todo: bot move
  res.json({
    field, player, winner, success: true
  });
});

const PORT = process.env.PORT ?? 3112;
app.listen(PORT, () => {
  console.log(`Tic Tac Toe game running at http://localhost:${PORT}`);
});