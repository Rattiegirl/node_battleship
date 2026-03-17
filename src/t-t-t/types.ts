export type Cell = 'O' | 'X' | ' ';
export type Field = Cell[]
export type Winner = 'O' | 'X' | 'undetermined' | 'tie'
export type Player = 'O' | 'X'

// GET /api/field
export type FieldStateResponse = {
    field: Field;
    player: Player;
    winner: Winner;
    //@todo
    // participants
    // history
}
// POST /api/move
type MoveBody = {
    player: Player;
    coodinates: [number, number];
}
type MoveResponse = FieldStateResponse & {
    success: boolean;
    error?: string;
}
// PUT /api/field
type EmptyFieldStateResponse = FieldStateResponse & {
    field: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
}
