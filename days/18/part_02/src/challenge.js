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
        let z = vect / Math.sqrt(x1 * x1 + y1 * y1) / Math.sqrt(x2 * x2 + y2 * y2)
        if (z < -1) {
            z = -1
        }
        if (z > 1) {
            z = 1
        }

        anglesum += Math.asin(z)
    }
    const result = anglesum < -1 || anglesum > 1 ? true : false
    return result
}

const parse_input = (input_lines) => {
    const game = {}
    game.actions = []
    for (let y = 0; y < input_lines.length; y++) {
        const line = input_lines[y];
        const [direction, distance, color] = line.split(' ')
        const new_distance = parseInt(color.slice(2,7), 16)
        const new_direction = ({0: 'R', 1: 'D', 2: 'L', 3: 'U'})[color[7]]
        const action = { direction: new_direction, distance: new_distance}
        // const action = { direction: direction, distance: parseInt(distance)}
        game.actions.push(action)
    }
    return game
}

const get_key = (x, y) => `${x},${y}`

const directions = {
    'R': { x: 1, y: 0 },
    'L': { x: -1, y: 0 },
    'U': { x: 0, y: -1 },
    'D': { x: 0, y: 1 },
}

const get_loop = (game) => {
    let x = 0
    let y = 0
    let min_x = 0
    let max_x = 0
    let min_y = 0
    let max_y = 0
    const loop = []
    const loop_detail = []
    game.loop = loop
    game.loop_detail = loop_detail
    for (let index = 0; index < game.actions.length; index++) {
        const action = game.actions[index];
        const direction = directions[action.direction]
        const distance = action.distance
        let detail_x = x
        let detail_y = y
        for (let step = 0; step < distance; step++) {
            detail_x += direction.x
            detail_y += direction.y
            loop_detail.push({ x: detail_x, y: detail_y })
        }
        x += direction.x * distance
        y += direction.y * distance
        if (x < min_x) min_x = x
        if (x > max_x) max_x = x
        if (y < min_y) min_y = y
        if (y > max_y) max_y = y
        loop.push({ x, y })
    }
    game.min_x = min_x
    game.max_x = max_x
    game.min_y = min_y
    game.max_y = max_y
}

const find_inside = (game) => {
    const inside = []
    const loop_keys = Object.fromEntries(game.loop_detail.map(coord => [get_key(coord.x, coord.y), true]))
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
    const result = game.loop_detail.length + game.inside.length
    return `${result}`;
}

module.exports = challenge;