const { debug } = require('./tools')
const get_key = (x, y) => `${x},${y}`
const connection_map = {
    '-': (x, y) => {
        return [
            get_key(x - 1, y),
            get_key(x + 1, y),
        ]
    },
    '|': (x, y) => {
        return [
            get_key(x, y - 1),
            get_key(x, y + 1),
        ]
    },
    'F': (x, y) => {
        return [
            get_key(x + 1, y),
            get_key(x, y + 1),
        ]
    },
    '7': (x, y) => {
        return [
            get_key(x - 1, y),
            get_key(x, y + 1),
        ]
    },
    'J': (x, y) => {
        return [
            get_key(x - 1, y),
            get_key(x, y - 1),
        ]
    },
    'L': (x, y) => {
        return [
            get_key(x + 1, y),
            get_key(x, y - 1),
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
    const game = { map }
    input_lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            const connections = get_connections(char)
            if (connections !== null) {
                const key = get_key(x, y)
                map[key] = { next: connections(x, y), seen: false }
            }
            if (char === 'S') {
                game.start = get_key(x, y)
            }
        })
    })
    map[game.start] = { next: [], seen: true}
    for (const key in map) {
        if (map[key].next.indexOf(game.start) !== -1) {
            map[game.start].next.push(key)
        }   
    }
    return game
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

    current_positions = [game.start]
    let count = 0

    while (current_positions.length > 0) {
        const new_positions = []
        current_positions.forEach((position) => {
            if (game.map[position] !== undefined) {
                const connections = game.map[position].next
                connections.forEach((connection) => {
                    if (game.map[connection] !== undefined && game.map[connection].seen === false && game.map[connection].next.indexOf(position) !== -1) {
                        new_positions.push(connection)
                        game.map[connection].seen = true
                    }
                })
            }
        })
        current_positions = new_positions
        count++
    }

    const result = count-1
    return `${result}`;
}

module.exports = challenge;