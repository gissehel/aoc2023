const get_values = (input_line) => {
    return input_line
        .split(':')[1]
        .trim()
        .split(' ')
        .filter(word => word.length > 0)
        .map(word => word.trim()).map(x=>parseInt(x))
}
const get_races = (input_lines) => {
    const [times, distances] = input_lines.map(line => get_values(line))
    return times.map((time, index) => {
        return {
            time: time,
            distance: distances[index]
        }
    })
}
const find_number_combinations_for_race = ({time, distance}) => {
    const number_of_combinations = (new Array(time)).fill(0).map((_, index) => index*(time-index)).filter(x=>x>distance).length
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
    const races = get_races(input_lines)
    const result = races.map(find_number_combinations_for_race).reduce((acc, value) => acc*value, 1)
    return `${result}`;
}

module.exports = challenge;