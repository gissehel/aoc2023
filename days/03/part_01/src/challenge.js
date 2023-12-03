const get_key = (x, y) => `${x},${y}`
const fill_grid = (grid, input_lines) => {
    let x = 0, y = 0
    grid['cell'] = {}
    grid['numbers'] = []
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
            x++
        }
        x = 0
        y++
    }
}
const is_symbol = (char) => char !== undefined && (char <= '0' || char >= '9') && char != '.'
const has_symbol = (grid, x, y) => is_symbol(grid['cell'][get_key(x, y)])
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
    let result = 0
    for (const number of grid['numbers']) {
        const start_x = number['start']['x']
        const end_x = number['end']['x']
        const y = number['start']['y']
        let next_to_symbol = false
        for (let x = start_x-1; x <= end_x +1; x++) {
            next_to_symbol = next_to_symbol || has_symbol(grid, x, y-1) 
            next_to_symbol = next_to_symbol || has_symbol(grid, x, y+1) 
        }
        next_to_symbol = next_to_symbol || has_symbol(grid, start_x-1, y) 
        next_to_symbol = next_to_symbol || has_symbol(grid, end_x+1, y) 
        if (next_to_symbol) {
            result += number['value']
        }
    }

    
    return `${result}`;
}

module.exports = challenge;