const get_key = (x, y) => `${x},${y}`

const parse_input = (input_lines) => {
    const universe = { map: {}}
    const y_length = input_lines.length
    let x_length = 0
    for (let y = 0; y < input_lines.length; y++) {
        const line = input_lines[y]
        if (line.length > x_length) {
            x_length = line.length
        }
        for (let x = 0; x < line.length; x++) {
            if (line[x] === '#') {
                const key = get_key(x, y)
                universe.map[key] = { x, y, state: '#' }
            }
        }
    }
    universe.x_length = x_length
    universe.y_length = y_length
    return universe
}

const all = (array, predicate) => {
    for (const element of array) {
        if (!predicate(element)) {
            return false
        }
    }
    return true
}

const find_expansion = (universe) => {
    const positions = Object.values(universe.map)
    universe.expansion_x = []
    universe.expansion_y = []
    positions.forEach(position => {
        position.new_x = position.x
        position.new_y = position.y
    })
    for (let x = 0; x < universe.x_length; x++) {
        if (all(positions, position => position.x !== x)) {
            universe.expansion_x.push(x)
            positions.forEach(position => {
                if (position.x > x) {
                    position.new_x++
                }
            })
        }
    }
    for (let y = 0; y < universe.y_length; y++) {
        if (all(positions, position => position.y !== y)) {
            universe.expansion_y.push(y)
            positions.forEach(position => {
                if (position.y > y) {
                    position.new_y++
                }
            })
        }
    }
}

const find_distance = (universe) => {
    const positions = Object.values(universe.map)
    let result = 0
    for (let index1 = 1; index1 <= positions.length; index1++) {
        const position1 = positions[index1-1]
        for (let index2 = index1 + 1; index2 <= positions.length; index2++) {
            const position2 = positions[index2-1]
            const distance = Math.abs(position1.new_x - position2.new_x)+Math.abs(position1.new_y - position2.new_y)
            result += distance
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
    const universe = parse_input(input_lines)
    find_expansion(universe)
    const result = find_distance(universe)
    return `${result}`;
}

module.exports = challenge;