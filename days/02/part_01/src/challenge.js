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
                const {count, color} = color_info
                return count <= criteria[color]
            }
        ).reduce((previous, current) => previous && current)
    ).reduce((previous, current) => previous && current)
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
    // console.log(JSON.stringify(games, null, 2))
    const valid_games  = games.filter(filter_game).map((game) => game.game_id).map(x=>parseInt(x)).reduce((a,b)=>a+b)

    return `${valid_games}`;
}

module.exports = challenge;