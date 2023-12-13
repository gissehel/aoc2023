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

const equal_or_differ_by_one = (a, b) => {
    if (a === b) {
        return 0
    }
    if (a.length !== b.length) {
        return null
    }
    let differences = 0
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            differences++
            if (differences > 1) {
                return null
            }
        }
    }
    return differences
}

const check_reflection = (lines, main_index, differences) => {
    const m = Math.min(lines.length - main_index - 1, main_index + 1)
    for (let sub_index = 1; sub_index < m; sub_index++) {
        const difference = equal_or_differ_by_one(lines[main_index - sub_index], lines[main_index + sub_index + 1])
        if (difference === null) {
            return false
        }
        differences += difference
        if (differences > 1) {
            return false
        }
    }
    return differences === 1
}

const find_reflections = (lines) => {

    for (let main_index = 0; main_index < lines.length - 1; main_index++) {
        const difference = equal_or_differ_by_one(lines[main_index], lines[main_index + 1])
        if (difference !== null) {
            if (check_reflection(lines, main_index, difference)) {
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