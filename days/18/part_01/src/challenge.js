const { debug } = require('./tools')

const is_inside = (x, y, loop) => {
    let anglesum = 0
    for (let index = 0; index < loop.length; index++) {
        const coord1 = loop[index]
        const coord2 = loop[(index + 1) % loop.length]
        const x1 = coord1.x - x
        const y1 = coord1.y - y
        const x2 = coord2.x - x
        const y2 = coord2.y - y

        const vect = x1 * y2 - y1 * x2

        anglesum += Math.asin(vect / Math.sqrt(x1 * x1 + y1 * y1) / Math.sqrt(x2 * x2 + y2 * y2))
    }
    return anglesum < -1 || anglesum > 1 ? true : false
}

const parse_input = (input_lines) => {
    const game = {}
    game.actions = []
    for (let y = 0; y < input_lines.length; y++) {
        const line = input_lines[y];
        const [direction, distance, color] = line.split(' ')
        const action = { direction, distance: parseInt(distance), color }
        game.actions.push(action)
    }
    return game
}

const get_key = (x, y) => `${x},${y}`

const directions = {
    'R': { x: 1, y: 0 },
    'L': { x: -1, y: 0 },
    'U': { x: 0, y: 1 },
    'D': { x: 0, y: -1 },
}

const get_loop = (game) => {
    let x = 0
    let y = 0
    let min_x = 0
    let max_x = 0
    let min_y = 0
    let max_y = 0
    const loop = []
    game.loop = loop
    for (let index = 0; index < game.actions.length; index++) {
        const action = game.actions[index];
        const direction = directions[action.direction]
        for (let step = 0; step < action.distance; step++) {
            x += direction.x
            y += direction.y
            if (x < min_x) min_x = x
            if (x > max_x) max_x = x
            if (y < min_y) min_y = y
            if (y > max_y) max_y = y
            loop.push({ x, y })
        }
    }
    game.min_x = min_x
    game.max_x = max_x
    game.min_y = min_y
    game.max_y = max_y
    return loop
}

const find_inside = (game) => {
    const inside = []
    const loop_keys = Object.fromEntries(game.loop.map(coord => [get_key(coord.x, coord.y), true]))
    for (let x = game.min_x; x <= game.max_x; x++) {
        for (let y = game.min_y; y <= game.max_y; y++) {
            const key = get_key(x, y)
            if (!loop_keys[key]) {
                if (is_inside(x, y, game.loop)) {
                    inside.push({ x, y })
                }
            }
        }
    }
    game.inside = inside
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
    get_loop(game)
    find_inside(game)
    const result = game.loop.length + game.inside.length
    return `${result}`;
}

module.exports = challenge;