const parse_input = (input_line) => {
    const [card, values] = input_line.split(':')
    const [winning_data, own_data] = values.split('|')
    const [winning, own] = [winning_data, own_data].map(

        (data) => data.split(' ').filter(data => data.length > 0).map(value => parseInt(value))
    )
    const card_no = parseInt(card.split(' ')[1])
    return { card_no, winning, own }
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
    const input_data = input_lines.map(parse_input)
    const card_values = input_data.map(({card_no, winning, own}) => {
        // const owns_win = []
        let owns_win_value = null
        own.forEach((element) => {
            if (winning.includes(element)) {
                if (owns_win_value === null) {
                    owns_win_value = 1
                } else {
                    owns_win_value *= 2
                }
            }
        })
        return owns_win_value
    })
    const result = card_values.reduce((acc, value) => acc + value, 0)
    return `${result}`;
}

module.exports = challenge;