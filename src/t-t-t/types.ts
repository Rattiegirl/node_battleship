export type Cell = 'O' | 'X' | ' ';
export type Field = Cell[]
export type Winner = 'O' | 'X' | 'undetermined' | 'tie'
export type Player = 'O' | 'X'
export type History = {}

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
export type MoveBody = {
    player: Player;
    coodinate: number
}
export type MoveResponse = FieldStateResponse & {
    success: boolean;
    error?: string;
}
// PUT /api/field
export type EmptyFieldStateResponse = FieldStateResponse & {
    field: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
}
