const all = (array, predicate) => {
    for (let i = 0; i < array.length; i++) {
        if (!predicate(array[i])) {
            return false;
        }
    }
    return true;
}

const is_last_sequence = (sequence) => {
    return all(sequence, (number) => number === 0) || sequence.length === 1
}

const find_next = (sequence) => {
    const sequences = []
    let current_sequence = [ ...sequence ]
    sequences.push(current_sequence)
    while (!is_last_sequence(current_sequence)) {
        const new_sequence = []
        for (let i = 1; i < current_sequence.length; i++) {
            new_sequence.push(current_sequence[i]-current_sequence[i-1])
        }
        current_sequence = new_sequence
        sequences.push(current_sequence)
    }
    return sequences.map(sequence => sequence[sequence.length-1]).reduce((a,b)=>a+b,0)
}

const parse_input = (input_lines) => {
    return input_lines.map((line) => line.split(' ').filter(word => word.length > 0).map(word => parseInt(word)))
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
    const sequences = parse_input(input_lines)

    const result = sequences.map(sequence => find_next(sequence)).reduce((a,b)=>a+b,0)
    return `${result}`;
}

module.exports = challenge;