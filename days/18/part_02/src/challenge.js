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

const has_inside = (y, loop) => {
    let count = 0
    const crosses = []
    for (let index = 0; index < loop.length; index++) {
        const coord1 = loop[index]
        const coord2 = loop[(index + 1) % loop.length]
        if (coord1.y === y && coord2.y === y) {
            crosses.push({x: coord1.x, exact: true})
            crosses.push({x: coord2.x, exact: true})
            // count += Math.abs(coord1.x - coord2.x) - 1
        } else if (coord1.y < y && coord2.y > y) {
            crosses.push({x: coord1.x, exact: false})
        } else if (coord1.y > y && coord2.y < y) {
            crosses.push({x: coord1.x, exact: false})
        } else if (coord1.y !== y && coord2.y === y) {
            crosses.push({x: coord1.x, exact: true})
        } else if (coord1.y === y && coord2.y !== y) {
            crosses.push({x: coord1.x, exact: true})
        }
        crosses.sort((a, b) => a.x - b.x)
        
        while (crosses.length > 1) {
            let cross1 = crosses.shift()
            let cross2 = crosses.shift()
            if (cross1.x === cross2.x) {
                cross2 = crosses.shift()
                crosses.shift()
            }
            count += Math.abs(cross1.x - cross2.x)
            if (! cross2.exact) {
                count += 1
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

    for (let y = game.min_y; y <= game.max_y; y++) {
        result += has_inside(y, game.loop)
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