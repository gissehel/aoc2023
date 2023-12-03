const get_key = (x, y) => `${x},${y}`
const fill_grid = (grid, input_lines) => {
    let x = 0, y = 0
    grid['cell'] = {}
    grid['numbers'] = []
    grid['protogears'] = []
    for (const line of input_lines) {
        let current_number = null
        for (const char of line) {
            grid['cell'][get_key(x, y)] = char
            if (char >= '0' && char <= '9') {
                if (current_number == null) {
                    current_number = { start: { x, y }, end: { x, y }, value: null }
                    current_number['value'] = parseInt(char)
                    grid['numbers'].push(current_number)
                } else {
                    current_number['end'] = { x, y }
                    current_number['value'] = current_number['value'] * 10 + parseInt(char)
                }
            } else if (current_number != null) {
                current_number = null
            }
            if (char == '*') {
                grid['protogears'].push({ x, y })
            }
            x++
        }
        x = 0
        y++
    }
}
const is_symbol = (char) => char !== undefined && (char <= '0' || char >= '9') && char != '.'
const has_symbol = (grid, x, y) => is_symbol(grid['cell'][get_key(x, y)])
const find_gears = (grid) => {
    const gears = []
    for (const protogear of grid['protogears']) {
        const x = protogear['x']
        const y = protogear['y']
        protogear['numbers'] = []
        const number_count = 0
        for (const number of grid['numbers']) {
            const start_x = number['start']['x']
            const end_x = number['end']['x']
            const number_y = number['start']['y']
            if (x >= start_x-1 && x <= end_x+1 && y >= number_y-1 && y <= number_y+1) {
                protogear['numbers'].push(number)
            }
        }
        if (protogear['numbers'].length == 2) {
            gears.push(protogear)
        }
    }
    return gears

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
    const grid = {}
    fill_grid(grid, input_lines)
    const gears = find_gears(grid)
    let result = 0
    for (const gear of gears) {
        result += gear['numbers'][0]['value'] * gear['numbers'][1]['value']
    }

    return `${result}`;
}

module.exports = challenge;