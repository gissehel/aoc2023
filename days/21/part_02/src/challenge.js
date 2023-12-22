const { debug } = require('./tools')

const get_key = (x, y) => `${x},${y}`

const parse_input = (input_lines) => {
    const game = {}
    game.map = {}
    game.y_length = input_lines.length
    game.x_length = 0
    for (let y = 0; y < game.y_length; y++) {
        const line = input_lines[y]
        if (game.x_length < line.length) {
            game.x_length = line.length
        }
        for (let x = 0; x < game.x_length; x++) {
            const char = line[x]
            game.map[get_key(x, y)] = {x, y, char}
            if (char === 'S') {
                game.start = {x, y}
            }
        }
    }
    return game
}

const display_map = (game) => {
    let output = ''
    for (let y = 0; y < game.y_length; y++) {
        for (let x = 0; x < game.x_length; x++) {
            const char = game.map[get_key(x, y)].char
            output += char
        }
        output += '\n'
    }
    console.log(output)
}

const display_map_positions = (game,positions) => {
    let output = ''
    for (let y = 0; y < game.y_length; y++) {
        for (let x = 0; x < game.x_length; x++) {
            let char = game.map[get_key(x, y)].char
            if (positions.includes(get_key(x, y))) {
                char = 'O'
            }
            output += char
        }
        output += '\n'
    }
    console.log(output)
}

const neighbours = {
    'N': {x: 0, y: -1},
    'E': {x: 1, y: 0},
    'S': {x: 0, y: 1},
    'W': {x: -1, y: 0},
}

const mod = (x, n) => (x % n + n) % n

const get_iteration = (game, positions) => {
    const next_positions = []
    const next_positions_map = {}
    for (const position of positions) {
        const item = game.map[position]
        for (const direction in neighbours) {
            const neighbour = game.map[get_key(mod(item.x + neighbours[direction].x, game.x_length), mod(item.y + neighbours[direction].y, game.y_length))]
            if (neighbour && (neighbour.char === '.' || neighbour.char === 'S') ) {
                const key = get_key(neighbour.x, neighbour.y)
                if (!next_positions_map[key]) {
                    next_positions_map[key] = true
                    next_positions.push(key)
                }
            }
        }
    }
    return next_positions
}

const solve_positions = (game, steps) => {
    let positions = [get_key(game.start.x, game.start.y)]
    for (let i = 0; i < steps; i++) {
        positions = get_iteration(game, positions)
    }
    return positions
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
    const game = parse_input(input_lines)

    const positions = solve_positions(game, 26501365)
    // display_map_positions(game, positions)
    const result = positions.length
    return `${result}`;
}

module.exports = challenge;