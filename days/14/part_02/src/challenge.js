const { debug } = require('./tools')

const get_key = (x, y) => `${x},${y}`

const parse_input = (input_lines) => {
    const game = {}
    game.map = {}
    game.y_length = input_lines.length
    for (let y = 0; y < input_lines.length; y++) {
        const line = input_lines[y]
        if (!(game.x_length) || game.x_length < line.length) {
            game.x_length = line.length
        }
        for (let x = 0; x < line.length; x++) {
            const char = line[x]
            const key = get_key(x, y)
            game.map[key] = { char, x, y }
        }
    }
    return game
}

directions = {
    'N': { i_init: (x, y) => y - 1, i_stop: (game, i) => i >= 0, i_next: (i) => i - 1, get_key_i: (x, y, i) => get_key(x, i), get_result: (i) => i + 1, get_default: (game, x, y) => 0 },
    'S': { i_init: (x, y) => y + 1, i_stop: (game, i) => i < game.y_length, i_next: (i) => i + 1, get_key_i: (x, y, i) => get_key(x, i), get_result: (i) => i - 1, get_default: (game, x, y) => game.y_length - 1 },
    'W': { i_init: (x, y) => x - 1, i_stop: (game, i) => i >= 0, i_next: (i) => i - 1, get_key_i: (x, y, i) => get_key(i, y), get_result: (i) => i + 1, get_default: (game, x, y) => 0 },
    'E': { i_init: (x, y) => x + 1, i_stop: (game, i) => i < game.x_length, i_next: (i) => i + 1, get_key_i: (x, y, i) => get_key(i, y), get_result: (i) => i - 1, get_default: (game, x, y) => game.x_length - 1 },
}

const find_new_pos = (game, x, y, direction) => {
    const { i_init, i_stop, i_next, get_key_i, get_result, get_default } = directions[direction]
    for (let i = i_init(x, y); i_stop(game, i); i = i_next(i)) {
        if (game.game_new_pos[get_key_i(x, y, i)].char !== '.') {
            return get_result(i)
        }
    }
    return get_default(game, x, y)
}

const range = (n) => [...Array(n).keys()]

const get_keys = (game, direction) => {
    if (direction === 'N') {
        return range(game.y_length).map(y => range(game.x_length).map(x => get_key(x, y))).flat()
    }
    if (direction === 'S') {
        return range(game.y_length).map(y => range(game.x_length).map(x => get_key(x, game.y_length - y - 1))).flat()
    }
    if (direction === 'E') {
        return range(game.x_length).map(x => range(game.y_length).map(y => get_key(game.x_length - x - 1, y))).flat()
    }
    if (direction === 'W') {
        return range(game.x_length).map(x => range(game.y_length).map(y => get_key(x, y))).flat()
    }
}

const make_fall = (game, direction) => {
    game.game_new_pos = {}
    const { map, game_new_pos } = game
    get_keys(game, direction).map((key) => {
        const element = map[key]
        const { char, x, y } = element
        let new_y = y
        let new_x = x
        if (char === 'O') {
            const new_pos = find_new_pos(game, x, y, direction)
            if (direction === 'N' || direction === 'S') {
                new_y = new_pos
            } else {
                new_x = new_pos
            }
        }
        element.new_x = new_x
        element.new_y = new_y
        if (new_y !== y || new_x !== x) {
            const old_element = game_new_pos[get_key(new_x, new_y)]
            old_element.new_x = x
            old_element.new_y = y
            game_new_pos[get_key(x, y)] = old_element
        }
        game_new_pos[get_key(new_x, new_y)] = element
    })
    Object.values(game_new_pos).forEach(element => {
        element.x = element.new_x
        element.y = element.new_y
        element.new_x = undefined
        element.new_y = undefined
    })
    game.map = {}
    for (const key of get_keys(game, direction)) {
        game.map[key] = game_new_pos[key]
    }
    game.game_new_pos = undefined
}
const get_map_to_display = (game) => {
    const lines = []
    for (let y = 0; y < game.y_length; y++) {
        let line = ''
        for (let x = 0; x < game.x_length; x++) {
            const element = game.map[get_key(x, y)]
            line += element.char
        }
        lines.push(line)
    }
    lines.push('')
    return lines.join('\n')
}

const display_map = (game) => {
    console.log(`${game.count}: ${get_map_value(game)}`)
    // console.log(get_map_to_display(game))
}

const get_map_value = (game) => Object.values(game.map).filter(element => element.char === 'O').map(element => game.y_length - element.y).reduce((acc, value) => acc + value, 0)

const dirs = ['N', 'W', 'S', 'E']

const make_cycke = (game) => {
    dirs.forEach(direction => make_fall(game, direction))
    game.count = game.count + 1
    display_map(game)
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
    // make_fall(game,'N')
    game.count = 0
    for (let i = 0; i < 1000; i++) {
        make_cycke(game)
    }
    const result = get_map_value(game)
    return `${result}`;
}

module.exports = challenge;