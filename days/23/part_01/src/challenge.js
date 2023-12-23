const { debug } = require('./tools')

const get_key = (x, y) => `${x},${y}`

const parse_lines = (input_lines) => {
    const game = {}

    game.y_length = input_lines.length
    game.x_length = input_lines[0].length
    for (let y = 0; y < game.y_length; y++) {
        for (let x = 0; x < game.x_length; x++) {
            const key = get_key(x, y)
            char = input_lines[y][x]
            game[key] = { x, y, key, char }
            if (y === 0 && char === '.') {
                game.start = game[key]
            }
            if (y === game.y_length-1 && char === '.') {
                game.stop = game[key]
            }
        }
    }

    return game
}

const get_possible_moves = (game, current, last) => {
    const key = get_key(current.x, current.y)
    if (game[key]) {
        const neighbours = [
            game[get_key(current.x, current.y-1)],
            game[get_key(current.x, current.y+1)],
            game[get_key(current.x-1, current.y)],
            game[get_key(current.x+1, current.y)],
        ].filter(
            (neighbour) => 
                neighbour && 
                (
                    neighbour.char === '.' || 
                    (neighbour.char === '>' && neighbour.x === current.x+1) || 
                    (neighbour.char === '<' && neighbour.x === current.x-1) || 
                    (neighbour.char === '^' && neighbour.y === current.y-1) || 
                    (neighbour.char === 'v' && neighbour.y === current.y+1)
                ) &&
                neighbour.key !== last.key
        )  
        return neighbours
    }

    return []
}

const find_longest_path = (game) => {
    const queue = [{current: game.start, last: { x: -1, y: -1, key:'' }, distance: 0}]
    let longest = null

    while (queue.length > 0) {
        const {last, current, distance} = queue.shift()
        const key = get_key(current.x, current.y)

        const neighbours = get_possible_moves(game, current, last)

        neighbours.forEach(neighbour => {
            const neighbour_key = neighbour.key
            queue.push({current: neighbour, last: current, distance: distance+1})
            if (neighbour_key === game.stop.key) {
                if (longest === null || distance+1 > longest) {
                    longest = distance+1
                }
            }
        })
    }

    return longest
}

/**
 * Template challenge for AoC. Take the input as string because all inputs are always strings.
 * Return the solution as string (because all solutions are always strings).
 * 
 * @param {String} input 
 * @returns String
 */
const challenge = (input) => {
    const input_lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    const game = parse_lines(input_lines)

    const result = find_longest_path(game)
    return `${result}`;
}

module.exports = challenge;