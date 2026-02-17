export type Cell = '.' | '#' | 'X' | '~' | '-';
export type Sea = Cell[][];

export interface GameState {
  user_sea: Sea;
  user_visible: Sea;
  bot_sea: Sea;
  bot_visible: Sea;
  is_user_turn: boolean;
  game_over: boolean;
  winner: string | null;
}

export interface MoveResult {
  result: 'hit' | 'miss';
  sunk?: boolean;
  bot_result?: { result: string; sunk?: boolean; message?: string };
  message?: string;
}
