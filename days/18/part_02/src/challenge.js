const { debug } = require('./tools')

const is_between = (x, x1, x2) => {
    if (x1 < x2) {
        return x >= x1 && x <= x2
    } else {
        return x >= x2 && x <= x1
    }
}

const is_inside = (x, y, loop) => {
    let anglesum = 0

    for (let index = 0; index < loop.length; index++) {
        const coord1 = loop[index]
        const coord2 = loop[(index + 1) % loop.length]
        const x1 = coord1.x - x
        const y1 = coord1.y - y
        const x2 = coord2.x - x
        const y2 = coord2.y - y

        if (is_between(x, coord1.x, coord2.x) && coord1.y === coord2.y && coord1.y === y) {
            return true
        }
        if (is_between(y, coord1.y, coord2.y) && coord1.x === coord2.x && coord1.x === x) {
            return true
        }

        const vect = x1 * y2 - y1 * x2
        const scal = x1 * x2 + y1 * y2
        let z = vect / Math.sqrt(x1 * x1 + y1 * y1) / Math.sqrt(x2 * x2 + y2 * y2)
        if (z < -1) {
            z = -1
        }
        if (z > 1) {
            z = 1
        }

        let angle = Math.asin(z)
        if (scal < 0) {
            if (angle > 0) {
                angle = Math.PI - angle
            } else {
                angle = -Math.PI - angle
            }
        }

        anglesum += angle
    }
    const result = anglesum < -1 || anglesum > 1 ? true : false
    return result
}

const has_inside = (y, loop) => {
    let count = 0
    let crosses = []
    for (let index = 0; index < loop.length; index++) {
        const coord1 = loop[index]
        const coord2 = loop[(index + 1) % loop.length]
        if (is_between(y, coord1.y, coord2.y)) {
            crosses.push(coord1.x)
            crosses.push(coord2.x)
        }
    }
    crosses = [...new Set(crosses)]
    crosses.sort((a, b) => a - b)

    for (let index = 0; index < crosses.length; index++) {
        const x = crosses[index];
        count += 1
        if (index < crosses.length - 1) {
            const next_x = crosses[index + 1]
            const distance = next_x - x - 1
            if (distance > 0) {
                if (is_inside(x + 1, y, loop)) {
                    count += distance
                }
            }
        }
    }
    return count
}

const parse_input = (input_lines) => {
    const game = {}
    game.actions = []
    for (let y = 0; y < input_lines.length; y++) {
        const line = input_lines[y];
        const [direction, distance, color] = line.split(' ')
        const new_distance = parseInt(color.slice(2, 7), 16)
        const new_direction = ({ 0: 'R', 1: 'D', 2: 'L', 3: 'U' })[color[7]]
        const action = { direction: new_direction, distance: new_distance }
        game.actions.push(action)
    }
    return game
}

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
    game.loop = loop
    for (let index = 0; index < game.actions.length; index++) {
        const action = game.actions[index];
        const direction = directions[action.direction]
        const distance = action.distance
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
    let result = 0

    const special_ys = game.loop.map(coord => coord.y).sort((a, b) => a - b).filter((y, index, array) => array.indexOf(y) === index)

    for (let index = 0; index < special_ys.length; index++) {
        const y = special_ys[index];
        result += has_inside(y, game.loop, game)
        if (index < special_ys.length - 1) {
            const next_y = special_ys[index + 1]
            const distance = next_y - y - 1
            if (distance > 0) {
                result += has_inside(y + 1, game.loop, game) * distance
            }
        }
    }

    return result
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
    const result = find_inside(game)

    return `${result}`;
}

module.exports = challenge;