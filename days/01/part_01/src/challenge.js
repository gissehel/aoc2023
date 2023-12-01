/**
 * Template challenge for AoC. Take the input as string because all inputs are always strings.
 * Return the solution as string (because all solutions are always strings).
 * 
 * @param {String} input 
 * @returns String
 */
const challenge = (input) => {
    const input_lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    const numbers = input_lines.map(line => line.replace(/[^0-9]/g, '')).map(line => line.slice(0,1)+line.slice(line.length-1)).map(line => parseInt(line))
    const sum = numbers.reduce((a,b)=>a+b,0)
    return `${sum}\n`;
}

module.exports = challenge;