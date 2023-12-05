const parse_input = (input_lines) => {
    let current_map = null
    const maps = {}
    const seeds = []
    input_lines.forEach(input_line => {
        if (input_line.indexOf('seeds:') >= 0) {
            input_line.split(' ').slice(1).map(data => parseInt(data)).forEach(element => seeds.push(element))
        } else if (input_line.indexOf(' map:') >= 0) {
            const map_name = input_line.split(' ')[0]
            const [source, dest] = map_name.split('-to-')
            current_map = { source, dest, data: [] }
            maps[source] = current_map
        } else if (input_line === '') {
            current_map = null
        } else if (input_line !== '') {
            const [dest_range_start, source_range_start, range_lenth] = input_line.split(' ').map(value => parseInt(value))
            if (current_map !== null) {
                current_map.data.push({ dest_range_start, source_range_start, range_lenth })
            }
        }
    })
    return { maps, seeds }
}
const resolve_map = (map, source_value) => {
    for (const { dest_range_start, source_range_start, range_lenth } of map.data) {
        if (source_value >= source_range_start && source_value < source_range_start + range_lenth) {
            return dest_range_start + source_value - source_range_start
        }        
    }
    return source_value
}
const resolve_all_maps = (maps, source_value) => {
    let value = source_value
    let type = 'seed'
    while (type !== 'location') {
        const map = maps[type]
        value = resolve_map(map, value)
        type = map.dest
    }
    return value
}

const get_seed_numbers = (seeds) => {
    const results = []
    while (seeds.length > 0) {
        const range_start = seeds.shift()
        const range_lenth = seeds.shift()
        for (let i = 0; i < range_lenth; i++) {
            results.push(range_start + i)
        }
    }
    return results
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
    const { maps, seeds } = parse_input(input_lines)

    let result = null
    while (seeds.length > 0) {
        const range_start = seeds.shift()
        const range_lenth = seeds.shift()
        for (let i = 0; i < range_lenth; i++) {
            const final_result = resolve_all_maps(maps, range_start + i)
            if (result === null || final_result < result) {
                result = final_result
            }
        }
    }
    return `${result}`;
}

module.exports = challenge;