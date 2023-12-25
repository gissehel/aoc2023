const { debug } = require('./tools')


const add_component = (link, component, other_component) => {
    if (!link[component]) {
        link[component] = []
    }
    if (! link[component].includes(other_component)) {
        link[component].push(other_component)
    }
    
}

const compare = (element1, element2) => {
    if (element1 < element2) {
        return -1
    }
    if (element1 > element2) {
        return 1
    }
    return 0
}

const sort = (array, cond) => {
    const new_array = [...array]
    new_array.sort(cond)
    return new_array
}

const parse_input = (input_lines) => {
    const game = {}
    game.links = {}
    for (const line of input_lines) {
        if (line.includes(': ')) {
            const [component, components] = line.split(': ')
            for (const other_component of components.split(' ')) {
                add_component(game.links, component, other_component)
                add_component(game.links, other_component, component)
            }
        }
    }

    game.links = Object.fromEntries(sort(Object.entries(game.links), (element1, element2) => compare(element1[0],element2[0])))
    for (const component in game.links) {
        game.links[component] = sort(game.links[component])
    }

    return game
}

const display_digraph = (game) => {
    let result = ''
    result += 'digraph {\n'
    for (const component in game.links) {
        result += `${component}->${game.links[component].join(',')}\n`
    }
    result += '}\n'
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
    const game = parse_input(input_lines)
    //debug({game})
    // console.log(display_digraph(game))
    const result = Object.keys(game.links).length
    return `${result}`;
}

module.exports = challenge;