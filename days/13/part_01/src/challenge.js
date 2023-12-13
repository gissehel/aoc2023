const { debug } = require('./tools')
const parse_lines = (input_lines) => {
    const result = { patterns: [] }
    current_pattern = { lines: [], columns: [] }
    for (const line of input_lines) {
        if (line === '') {
            result.patterns.push(current_pattern)
            current_pattern = { lines: [], columns: [] }
        } else {
            current_pattern.lines.push(line)
            for (let i = 0; i < line.length; i++) {
                if (current_pattern.columns.length <= i) {
                    current_pattern.columns.push('')
                }
                current_pattern.columns[i] += line[i]
            }
        }
    }
    if (current_pattern.lines.length > 0) {
        result.patterns.push(current_pattern)
    }
    return result
}
const check_reflection = (lines, main_index) => {
    const m = Math.min(lines.length - main_index - 1, main_index + 1)
    for (let sub_index = 1; sub_index < m; sub_index++) {
        if (lines[main_index - sub_index] !== lines[main_index + sub_index + 1]) {
            return false
        }
    }
    return true
}
const find_reflections = (lines) => {
    for (let main_index = 0; main_index < lines.length - 1; main_index++) {
        if (lines[main_index] === lines[main_index + 1]) {
            if (check_reflection(lines, main_index)) {
                return main_index + 1
            }
        }
    }
    return null
}
const find_reflections_on_all = (game) => {
    let result = 0
    for (const pattern of game.patterns) {
        let sub_result = 0
        sub_result = find_reflections(pattern.lines)
        if (sub_result !== null) {
            result += sub_result * 100
        } else {
            sub_result = find_reflections(pattern.columns)
            if (sub_result !== null) {
                result += sub_result
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
    const input_lines = input.split('\n').map(line => line.trim())
    const game = parse_lines(input_lines)
    const result = find_reflections_on_all(game)
    return `${result}`;
}

module.exports = challenge;