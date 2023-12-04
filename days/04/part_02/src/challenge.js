const parse_input = (input_line) => {
    const [card, values] = input_line.split(':')
    const [winning_data, own_data] = values.split('|')
    const [winning, own] = [winning_data, own_data].map(
        (data) => data.split(' ').filter(data => data.length > 0).map(value => parseInt(value))
    )
    const card_no = parseInt(card.split(' ').slice(-1))
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
        let count = 0
        own.forEach((element) => {
            if (winning.includes(element)) {
                count++
            }
        })
        return { card_no, count }
    })
    const coefs = {}
    card_values.forEach(({card_no, count}) => {
        coefs[card_no] = 1
    })
    card_values.forEach(({card_no, count}) => {
        for (let i = 1; i <= count; i++) {
            if (coefs[card_no+i] !== undefined ) {
                coefs[card_no+i] += coefs[card_no]
            }
        }
    })
    const result = Object.values(coefs).reduce((acc, value) => acc + value, 0)
    return `${result}`;
}

module.exports = challenge;