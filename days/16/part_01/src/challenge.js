const { debug } = require('./tools')

const get_key = (x, y) => `${x},${y}`

const read_game = (input_lines) => {
    const game = {}

    game.y_length = input_lines.length
    game.map = {}
    game.beams = []

    for (let y = 0; y < game.y_length; y++) {
        const line = input_lines[y]
        const x_length = line.length
        if (game.x_length === undefined || game.x_length < x_length) {
            game.x_length = x_length
        }
        for (let x = 0; x < game.x_length; x++) {
            const char = line[x]
            game.map[get_key(x, y)] = { x, y, char, has_beams: {} }
        }

    }
    return game
}

const get_display_game = (game) => {
    let result = ''
    for (let y = 0; y < game.y_length; y++) {
        for (let x = 0; x < game.x_length; x++) {
            const char = game.map[get_key(x, y)].char
            result += char
        }
        result += '\n'
    }
    return result
}

const display_game = (game) => {
    console.log(get_display_game(game))
}

const get_direction_key = (direction) => direction.join(',')

const add_beam = (game, x, y, direction) => {
    const key = get_key(x, y)
    if (game.map[key] === undefined) {
        return
    }
    if (! game.map[key].has_beams[get_direction_key(direction)]) {
        game.map[key].has_beams[get_direction_key(direction)] = true
        game.beams.push({ x, y, direction })
    }
}

const resolve_next_beams = (game, beam) => {
    const result = []
    const x = beam.x + beam.direction[0]
    const y = beam.y + beam.direction[1]
    const key = get_key(x, y)
    const element = game.map[key]
    if (element !== undefined) {
        if (element.char === '.' || (element.char === '|' && beam.direction[0] === 0) || (element.char === '-' && beam.direction[1] === 0)) {
            add_beam(game, x, y, beam.direction)
        } else if (element.char === '/' && beam.direction[0] === 1 && beam.direction[1] === 0) {
            add_beam(game, x, y, [0, -1])
        } else if (element.char === '/' && beam.direction[0] === 0 && beam.direction[1] === 1) {
            add_beam(game, x, y, [-1, 0])
        } else if (element.char === '/' && beam.direction[0] === -1 && beam.direction[1] === 0) {
            add_beam(game, x, y, [0, 1])
        } else if (element.char === '/' && beam.direction[0] === 0 && beam.direction[1] === -1) {
            add_beam(game, x, y, [1, 0])
        } else if (element.char === '\\' && beam.direction[0] === 1 && beam.direction[1] === 0) {
            add_beam(game, x, y, [0, 1])
        } else if (element.char === '\\' && beam.direction[0] === 0 && beam.direction[1] === 1) {
            add_beam(game, x, y, [1, 0])
        } else if (element.char === '\\' && beam.direction[0] === -1 && beam.direction[1] === 0) {
            add_beam(game, x, y, [0, -1])
        } else if (element.char === '\\' && beam.direction[0] === 0 && beam.direction[1] === -1) {
            add_beam(game, x, y, [-1, 0])
        } else if (element.char === '|' && beam.direction[1] === 0) {
            add_beam(game, x, y, [0, 1])
            add_beam(game, x, y, [0, -1])
        } else if (element.char === '-' && beam.direction[0] === 0) {
            add_beam(game, x, y, [1, 0])
            add_beam(game, x, y, [-1, 0])
        }
    }
    return result
}

const resolve_beams = (game) => {
    while (game.beams.length > 0) {
        const beams = [...game.beams.splice(0)]
        for (const beam of beams) {
            resolve_next_beams(game, beam)
        }
    }
}

const reset_game = (game) => {
    Object.values(game.map).forEach(element => {
        element.has_beams = {}
    })
}

const count_beams = (game) => {
    let result = 0
    for (let y = 0; y < game.y_length; y++) {
        for (let x = 0; x < game.x_length; x++) {
            const element = game.map[get_key(x, y)]
            if (Object.values(element.has_beams).filter(value => value).length > 0) {
                result++
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
    const game = read_game(input_lines)
    add_beam(game, 0, 0, [1, 0])
    // display_game(game)
    resolve_beams(game)
    // display_game(game)
    const result = count_beams(game)
    return `${result}`;
}

module.exports = challenge;