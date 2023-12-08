 const lr_indexes = { L: 0, R: 1 }
const parse_inputs = (input_lines)  => {
    const instructions = input_lines[0].trim().split('')
    const map_lines = input_lines.slice(1)
    const maps = {}
    map_lines.forEach((line) => {
        const [source, dests] = line.split(' = ')
        const [l,r] = dests.replace('(','').replace(')','').split(', ')
        maps[source] = [l,r]
    })
    return { instructions, maps }
}
class Instructions {
    constructor(instructions) {
        this.instructions = instructions
        this.index = 0
    }

    next() {
        const instruction = this.instructions[this.index%this.instructions.length]
        this.index++
        return instruction
    }

    get_index() {
        return this.index
    }
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
    const nodes = parse_inputs(input_lines)
    let position = 'AAA'
    const instructions = new Instructions(nodes.instructions)
    while (position !== 'ZZZ') {
        const instruction = instructions.next()
        position = nodes.maps[position][lr_indexes[instruction]]
    }
    const result = instructions.get_index()
    return `${result}`;
}

module.exports = challenge;