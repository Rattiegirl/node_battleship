export const SHIPS = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1] as const;
export const ROWS = 10;
export const COLS = 10;

export const totalShipDecks = SHIPS.reduce((sum, s) => sum + s, 0);
