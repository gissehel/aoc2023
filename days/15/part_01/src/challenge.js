const get_hash = (line) => {
    let result = 0
    for (let i = 0; i < line.length; i++) {
        const value = line.charCodeAt(i)
        result += value
        result *= 17
        result %= 256
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
    const input_lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0)

    const line = input_lines[0]
    const result = line.split(',').map(part => get_hash(part)).reduce((a, b) => a + b, 0)
    
    return `${result}`;
}

module.exports = challenge;