const raw_numbers = {
    'one': '1', 
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9',
}

const extract_numbers = (line) => {
    const numbers = []
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char >= '0' && char <= '9') {
            numbers.push(char)
        } else {
            for (const key in raw_numbers) {
                if (line.startsWith(key, i)) {
                    numbers.push(raw_numbers[key])
                }
            }
        }
    }
    return numbers
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
    const numbers = input_lines.map(line => extract_numbers(line)).map(line => line.slice(0,1)+line.slice(line.length-1)).map(line => parseInt(line))
    const sum = numbers.reduce((a,b)=>a+b,0)
    return `${sum}`;
}

module.exports = challenge;