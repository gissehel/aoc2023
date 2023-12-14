const { debug } = require('./tools')

const get_key = (x,y) => `${x},${y}`

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
            const key = get_key(x,y)
            game.map[key] = {char, x, y}
        }
    }
    return game
}
const find_new_pos = (game, x, y) => {
    for (let i = y-1; i >= 0; i--) {
        if (game.game_new_pos[get_key(x,i)].char !== '.') {
            return i+1
        }
    }
    return 0
}
const make_fall = (game) => {
    game.game_new_pos = {}
    const {map, game_new_pos} = game
    Object.values(map).map((element) => {
        const {char, x, y} = element
        let new_y = y
        let new_x = x
        if (char === 'O') {
            new_y = find_new_pos(game, x, y)
        }
        element.new_x = new_x
        element.new_y = new_y
        if (new_y !== y) {
            const old_element = game_new_pos[get_key(new_x,new_y)]
            old_element.new_x = x
            old_element.new_y = y
            game_new_pos[get_key(x,y)] = old_element
        }
        game_new_pos[get_key(new_x,new_y)] = element
    })
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
    make_fall(game)
    // for (let y = 0; y < game.y_length; y++) {
    //     let line = ''
    //     for (let x = 0; x < game.x_length; x++) {
    //         const element = game.game_new_pos[get_key(x,y)]
    //         line += element.char
    //     }
    //     console.log(line)
    // }
    const result = Object.values(game.game_new_pos).filter(element => element.char === 'O').map(element => game.y_length-element.new_y).reduce((acc, value) => acc + value, 0)
    return `${result}`;
}

module.exports = challenge;