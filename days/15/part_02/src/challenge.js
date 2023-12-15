const { debug } = require('./tools')
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

const fill_boxes = (boxes, line_parts) => {
    for (const line_part of line_parts) {
        if (line_part.indexOf('-') > -1) {
            const [command, remaining] = line_part.split('-')
            const hash = get_hash(command)
            if (boxes[hash] !== undefined) {
                for (let index = 0; index < boxes[hash].length; index++) {
                    const box = boxes[hash][index]
                    if (box[0] === command) {
                        boxes[hash].splice(index, 1)
                    }
                }
            }
        } else if (line_part.indexOf('=') > -1) {
            const [command, value_string] = line_part.split('=')
            const value = parseInt(value_string)
            const hash = get_hash(command)
            if (boxes[hash] === undefined) {
                boxes[hash] = []
            }
            let found = false
            for (const box of [...boxes[hash]]) {
                if (box[0] === command) {
                    box[1] = value
                    found = true
                }
            }
            if (!found) {
                boxes[hash].push([command, value])
            }
        }
    }

}

const get_result = (boxes) => {
    let result = 0
    for (const box_index in boxes) {
        const box = boxes[box_index]
        const box_number = parseInt(box_index) + 1
        result += box.map((box_part, box_part_index) => box_number * (box_part_index + 1) * box_part[1]).reduce((a, b) => a + b, 0)
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

    const boxes = {}
    const line = input_lines[0]
    fill_boxes(boxes, line.split(','))
    const result = get_result(boxes)
    return `${result}`;
}

module.exports = challenge;