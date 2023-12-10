const get_coord = (x, y) => ({ x, y, key: `${x},${y}` })
const connection_map = {
    '-': (x, y) => {
        return [
            get_coord(x - 1, y),
            get_coord(x + 1, y),
        ]
    },
    '|': (x, y) => {
        return [
            get_coord(x, y - 1),
            get_coord(x, y + 1),
        ]
    },
    'F': (x, y) => {
        return [
            get_coord(x + 1, y),
            get_coord(x, y + 1),
        ]
    },
    '7': (x, y) => {
        return [
            get_coord(x - 1, y),
            get_coord(x, y + 1),
        ]
    },
    'J': (x, y) => {
        return [
            get_coord(x - 1, y),
            get_coord(x, y - 1),
        ]
    },
    'L': (x, y) => {
        return [
            get_coord(x + 1, y),
            get_coord(x, y - 1),
        ]
    },
}
const get_connections = (char) => {
    if (connection_map[char] !== undefined) {
        return connection_map[char]
    }
    return null
}
const parse_input = (input_lines) => {
    const map = {}
    let length_x = Math.max(...input_lines.map(line => line.length))
    let length_y = input_lines.length
    const game = { map, length_x, length_y }
    input_lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            const connections = get_connections(char)
            if (connections !== null) {
                const coord = get_coord(x, y)
                map[coord.key] = { next: connections(x, y), x, y, seen: false }
            }
            if (char === 'S') {
                game.start = get_coord(x, y)
            }
        })
    })
    map[game.start.key] = { next: [], seen: true }
    for (const key in map) {
        if (map[key].next.map(connection => connection.key).indexOf(game.start.key) !== -1) {
            map[game.start.key].next.push({ x: map[key].x, y: map[key].y, key })
        }
    }
    return game
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

        const vect = x1 * y2 - y1 * x2
        
        anglesum += Math.asin(vect/Math.sqrt(x1*x1+y1*y1)/Math.sqrt(x2*x2+y2*y2))
    }
    return anglesum < -1 || anglesum > 1 ? true : false
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

    let current_position = game.start
    let count = 0
    const loop = []
    loop.push(current_position)
    while (current_position !== undefined && current_position.key !== game.start) {
        if (game.map[current_position.key] !== undefined) {
            const connections = game.map[current_position.key].next
            current_position = connections.filter(connection => game.map[connection.key] !== undefined && game.map[connection.key].seen === false && game.map[connection.key].next.map(connection => connection.key).indexOf(current_position.key) !== -1)[0]
            if (current_position !== undefined) {
                loop.push(current_position)
                game.map[current_position.key].seen = true
            }
        }
    }

    const loopkeys = Object.fromEntries(loop.map(coord => [coord.key, true]))
    // debug({ loop })
    for (let y = 0; y < game.length_y; y++) {
        for (let x = 0; x < game.length_x; x++) {
            const key = get_coord(x, y).key
            if (!loopkeys[key]) {
                const inside = is_inside(x, y, loop)
                if (inside) {
                    count += 1
                }
            }
        }
    }

    const result = count
    return `${result}`;
}

module.exports = challenge;