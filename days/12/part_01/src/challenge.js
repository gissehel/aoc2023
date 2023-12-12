const { debug } = require('./tools')

const check_items = (items, fields) => {
    let count = 0
    let index_fields = 0
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item === '.') {
            if (count > 0) {
                if (fields[index_fields] === count) {
                    index_fields++
                    count =0
                } else { 
                    return false
                }
            }
        }
        if (item === '#') {
            count++
        }
    }
    if (count > 0) {
        if (fields[index_fields] === count) {
            index_fields++
        } else { 
            return false
        }
    }
    if (index_fields !== fields.length) {
        return false
    }
    return true
}

const count_record = (items, fields) => {
    const first_unknown = items.indexOf('?')
    if (first_unknown !== -1) {
        const sub_items = [...items]
        const x = ['.', '#'].map(item => {const z = [...items]; z.splice(first_unknown, 1, item); return z})
        return ['.', '#'].map(item => {const z = [...items]; z.splice(first_unknown, 1, item); return z}).map(items => count_record(items, fields)).reduce((acc, value) => acc + value, 0)
    } else {
        if (check_items(items, fields)) {
            return 1
        } else {
            return 0
        }
    }
}

const parse_input = (input_lines) => {
    const result = { 
        records: [],
    }
    for (const input_line of input_lines) {
        const [items, fields] = input_line.split(' ')
        const numbers = fields.split(',').map(field => parseInt(field))
        const record = {
            items: items.split(''),
            fields: numbers,
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
    const result = game.records.map(({items, fields}) => count_record(items, fields)).reduce((acc, value) => acc + value, 0)
    return `${result}`;
}

module.exports = challenge;