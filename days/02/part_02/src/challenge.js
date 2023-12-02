const criteria = {
    red: 12,
    green: 13,
    blue: 14,
}
const parse_line = (line) => {
    const [game_part, data_part] = line.split(':')
    const game_id = parseInt(game_part.split('Game ')[1])
    const reveals = data_part.split(';').map(
        (reveal_string) => reveal_string.split(',').map(
            (color_string) => {
                const [count_string, color] = color_string.replace(/^ +/, '').replace(/ +$/, '').split(' ')
                const count = parseInt(count_string)
                return { count, color }
            }
        )
    )
    return { game_id, reveals }
}

const filter_game = (game) => {
    const { game_id, reveals } = game
    return reveals.map(
        (reveal) => reveal.map(
            (color_info) => {
                const { count, color } = color_info
                return count <= criteria[color]
            }
        ).reduce((previous, current) => previous && current)
    ).reduce((previous, current) => previous && current)
}

const update_minimum_set = (minimum_set, color_info) => {
    const { count, color } = color_info
    if ((minimum_set[color] === undefined) || (minimum_set[color] < count)) {
        minimum_set[color] = count
    }
}

const update_minimum_set_reveal = (minimum_set, reveal) => {
    reveal.forEach(color_info => update_minimum_set(minimum_set, color_info));
}

const update_minimum_set_game = (minimum_set, game) => {
    game.reveals.forEach((reveal) => update_minimum_set_reveal(minimum_set, reveal))
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
    const games = input_lines.map(parse_line)
    const result = games.map((game) => {
        const minimum_set = {}
        update_minimum_set_game(minimum_set, game)
        return minimum_set['blue']*minimum_set['green']*minimum_set['red']
    }).reduce((a,b)=>a+b)

    return `${result}`;
}

module.exports = challenge;