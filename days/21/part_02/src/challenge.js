const { debug } = require('./tools')

const get_key = (x, y) => `${x},${y}`
const mod = (x, n) => (x % n + n) % n

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
            game.map[get_key(x, y)] = { x, y, char }
            if (char === 'S') {
                game.start = { x, y }
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

const display_map_positions = (game, positions) => {
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
    'N': { x: 0, y: -1 },
    'E': { x: 1, y: 0 },
    'S': { x: 0, y: 1 },
    'W': { x: -1, y: 0 },
}

const get_iteration = (game, positions, next_positions_map) => {
    const next_positions = []
    // const next_positions_map = {}
    for (const position of positions) {
        const { x, y, key } = position
        const item = game.map[key]
        for (const direction in neighbours) {
            const new_x = x + neighbours[direction].x
            const new_y = y + neighbours[direction].y
            const new_key = get_key(mod(new_x, game.x_length), mod(new_y, game.y_length))
            const neighbour = game.map[new_key]
            if (neighbour && (neighbour.char === '.' || neighbour.char === 'S')) {
                const key = get_key(new_x, new_y)
                if (!next_positions_map[key]) {
                    next_positions_map[key] = true
                    next_positions.push({ x: new_x, y: new_y, key: new_key })
                }
            }
        }
    }
    return next_positions
}

const solve_positions = (game, steps) => {
    let positions = [{ x: game.start.x, y: game.start.y, key: get_key(game.start.x, game.start.y) }]
    const next_positions_maps = { 0: {}, 1: {} }
    for (let i = 0; i < steps; i++) {
        positions = get_iteration(game, positions, next_positions_maps[i % 2])
    }
    return Object.keys(next_positions_maps[(steps - 1) % 2]).length
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

    // const positions = solve_positions(game, 1)
    // display_map_positions(game, positions)
    console.log(solve_positions(game, 65 + 131*0))
    console.log(solve_positions(game, 65 + 131*1))
    console.log(solve_positions(game, 65 + 131*2))
    const result = ''
    return `${result}`;
}

module.exports = challenge;