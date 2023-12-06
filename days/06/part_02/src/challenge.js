const get_values = (input_line) => {
    return parseInt(input_line
        .split(':')[1]
        .trim()
        .replaceAll(' ', ''))
}
const get_race = (input_lines) => {
    const [time, distance] = input_lines.map(line => get_values(line))
    return {
        time,
        distance
    }

}
const find_number_combinations_for_race = ({ time, distance }) => {
    const number_of_combinations = (new Array(time)).fill(0).map((_, index) => index * (time - index)).filter(x => x > distance).length
    return number_of_combinations

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
    const race = get_race(input_lines)
    const result = find_number_combinations_for_race(race)
    return `${result}`;
}

module.exports = challenge;