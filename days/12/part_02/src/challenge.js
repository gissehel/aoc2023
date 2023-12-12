const { debug } = require('./tools')

const r_factor = 5

const count_record_remaining = (items, fields, match_count) => {
    if (items.length === 0) {
        if ((fields.length === 0 && match_count === 0) || (fields.length === 1 && match_count === fields[0])) {
            return 1
        } else {
            return 0
        }
    }
    if (items.map(item => (item === '#' || item === '?') ? 1 : 0).reduce((acc, value) => acc + value, 0) + match_count < fields.reduce((acc, value) => acc + value, 0)) {
        return 0
    }
    const first_item = items[0]
    if (first_item === '.') {
        if (match_count === 0) {
            const result = count_record_remaining(items.slice(1), fields, match_count)
            return result
        } else {
            if (fields[0] === match_count) {
                const result = count_record_remaining(items.slice(1), fields.slice(1), 0)
                return result
            } else {
                return 0
            }
        }
    } else if (first_item === '#') {
        if (fields.length === 0) {
            return 0
        } else if (match_count + 1 > fields[0]) {
            return 0
        }
        const result = count_record_remaining(items.slice(1), fields, match_count + 1)
        return result
    } else if (first_item === '?') {
        const result = count_record_remaining(['.', ...items.slice(1)], fields, match_count) + count_record_remaining(['#', ...items.slice(1)], fields, match_count)
        return result
    }
}

const count_record = (items, fields) => {
    const result = count_record_remaining(items, fields, 0)
    console.log(`${items.join('')} ${fields.map(field => `${field}`).join(',')} => ${result}`)
    return result
}


const count_record_alt = (items, fields) => {
    const count_record = (index_items, index_fields) => {
        let total = 0
        if (index_items >= items.length) {
            if (index_fields == fields.length) {
                return 1
            } else {
                return 0
            }
        }
        const item = items[index_items]
        if (item === '.' || item === '?') {
            total += count_record(index_items + 1, index_fields)
        }
        if (index_fields === fields.length) {
            return total
        }
        if (item === '#' || item === '?') {
            if ((index_items + fields[index_fields] <= items.length) && (items.slice(index_items, index_items + fields[index_fields]).indexOf('.') === -1) &&
                ((index_items + fields[index_fields] === items.length) || (items[index_items + fields[index_fields]] !== '#'))) {
                total += count_record(index_items + fields[index_fields] + 1, index_fields + 1)
            }
        }
        return total
    }
    const result = count_record(0, 0)
    console.log(`${items.join('')} ${fields.map(field => `${field}`).join(',')} => ${result}`)
    return result
}

const repeat = (array, n) => {
    return (new Array(n)).fill(array).flat()
}
const parse_input = (input_lines) => {
    const result = {
        records: [],
    }
    for (const input_line of input_lines) {
        const [items, fields] = input_line.split(' ')
        const numbers = fields.split(',').map(field => parseInt(field))
        const record = {
            items: repeat(['?', ...items.split('')], r_factor).slice(1),
            fields: repeat(numbers, r_factor),
        }
        result.records.push(record)
    }
    return result;
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
    const game = parse_input(input_lines)
    const result = game.records.map(({ items, fields }) => count_record_alt(items, fields)).reduce((acc, value) => acc + value, 0)
    return `${result}`;
}

module.exports = challenge;