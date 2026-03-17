import { fieldToWinner, move } from "./logic"
import { Field } from "./types"

try {
    const field1: Field = [
        'X', 'X', 'O',
        ' ', 'O', ' ',
        'O', ' ', ' ',
    ]

    const field2: Field = [
        'X', 'X', 'O',
        ' ', 'X', 'O',
        'O', 'X', ' ',
    ]

    const field3: Field = [
        'O', 'X', 'O',
        'X', 'X', 'O',
        'O', 'O', 'X',
    ]

    const field4: Field = [
        ' ', ' ', 'O',
        ' ', 'X', 'O',
        ' ', ' ', 'X',
    ]

    const field5: Field = [
        ' ', ' ', ' ',
        ' ', ' ', ' ',
        ' ', ' ', ' ',
    ]

    console.log(fieldToWinner(field1))
    console.log(fieldToWinner(field2))
    console.log(fieldToWinner(field3))
    console.log(fieldToWinner(field4))
    console.log(move('O', 1, 2, field5))
    console.log(move('X', 2, 2, field5))
    console.log(move('O', 1, 1, field5))
    console.log(move('O', 1, 3, field5))
    console.log(move('X', 1, 1, field5))
    console.log(fieldToWinner(field5))


} catch (err) {
    const error = err as Error
    console.log(error.message)
}

process.exit()