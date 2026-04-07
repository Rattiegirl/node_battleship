import { Field, Player, Winner, History } from "./types"

const combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

export const fieldToWinner = (field: Field): Winner => {
    for (const combination of combinations) {
        const [a, b, c] = combination
        if (field[a] === field[b] && field[b] === field[c]) {
            const side = field[a]
            if (side == "X" || side == "O") {
                return side
            }
        }
    }
    for (const cell of field) {
        if (cell == " ") {
            return 'undetermined'
        }
    }
    return 'tie'
}

export const move = (player: Player, moveCoord: number, field: Field): Field => {
    // const moveCoord = (3 * (coordinateX - 1) + (coordinateY - 1))
    if (field[moveCoord] !== ' ') {
        throw new Error(`There already is a "${field[moveCoord]}" move at coordinate: (${moveCoord})`)
    }
    field[moveCoord] = player
    // history.push(`${player} at ${coordinateX}, ${coordinateY}`)
    return field
}

//bot
