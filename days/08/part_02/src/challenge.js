const { debug } = require('./tools')
const lr_indexes = { L: 0, R: 1 }
const parse_inputs = (input_lines) => {
    const instructions = input_lines[0].trim().split('')
    const map_lines = input_lines.slice(1)
    const maps = {}
    map_lines.forEach((line) => {
        const [source, dests] = line.split(' = ')
        const [l, r] = dests.replace('(', '').replace(')', '').split(', ')
        maps[source] = [l, r]
    })
    return { instructions, maps }
}
class Instructions {
    constructor(instructions) {
        this.instructions = instructions
        this.index = 0
    }

    next() {
        const instruction = this.instructions[this.index % this.instructions.length]
        this.index++
        return instruction
    }

    get_index() {
        return this.index
    }
}
const all = (arr, predicate) => arr.reduce((acc, item) => acc && predicate(item), true)

/**
 * Template challenge for AoC. Take the input as string because all inputs are always strings.
 * Return the solution as string (because all solutions are always strings).
 * 
 * @param {String} input 
 * @returns String
 */
const challenge_init = (input) => {
    const input_lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    const nodes = parse_inputs(input_lines)
    let positions = Object.keys(nodes.maps).filter(key => key.endsWith('A'))
    const instructions = new Instructions(nodes.instructions)
    console.log(positions)
    while (!all(positions, (key) => key.endsWith('Z'))) {
        const instruction = instructions.next()
        positions = positions.map(position => nodes.maps[position][lr_indexes[instruction]])
        console.log(positions)
    }
    const result = instructions.get_index()
    return `${result}`;
}

const challenge = (input) => {
    const input_lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    const nodes = parse_inputs(input_lines)
    let positions = Object.keys(nodes.maps).filter(key => key.endsWith('A'))
    
    const cycle_seeds = positions.map((position) => {
        const instructions = new Instructions(nodes.instructions)
        while (!position.endsWith('Z')) {
            position = nodes.maps[position][lr_indexes[instructions.next()]]
        }
        const start = instructions.get_index()
        console.log({ start })
        position = nodes.maps[position][lr_indexes[instructions.next()]]
        while (!position.endsWith('Z')) {
            position = nodes.maps[position][lr_indexes[instructions.next()]]
        }
        const end = instructions.get_index()
        console.log({ end })
        const size = end - start
        return { start, size, position: start, next: start + size }
    })

    console.log(cycle_seeds)

    let result = null
    if (all(cycle_seeds, seed => seed.position === seed.size)) {
        const ppcm = (a, b) => {
            const pgcd = (a, b) => {
                if (!b) {
                    return a;
                }
                return pgcd(b, a % b);
            };
            return (a * b) / pgcd(a, b);
        }
        result = cycle_seeds.reduce((acc, seed) => ppcm(acc, seed.size), 1)
    } else {
        let min_next = cycle_seeds.reduce((acc, seed) => Math.min(acc, seed.next))
        let min_position = cycle_seeds.reduce((acc, seed) => Math.min(acc, seed.position))
        while (!all(cycle_seeds, (seed => seed.position === min_position))) {
            cycle_seeds.forEach((seed) => {
                if (seed.next <= min_next) {
                    seed.position = seed.next
                    seed.next += seed.size
                }
            })
            min_next = cycle_seeds.reduce((acc, seed) => Math.min(acc, seed.next))
            min_position = cycle_seeds.reduce((acc, seed) => Math.min(acc, seed.position))
            result = min_position
            // console.log(cycle_seeds)
        }
    }

    return `${result}`;
}

module.exports = challenge;