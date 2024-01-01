const { debug } = require('./tools')


const add_component = (link, component, other_component) => {
    if (!link[component]) {
        link[component] = []
    }
    if (!link[component].includes(other_component)) {
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

    game.links = Object.fromEntries(sort(Object.entries(game.links), (element1, element2) => compare(element1[0], element2[0])))
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

Array.prototype.order = function () {
    const new_array = [...this]
    new_array.sort()
    return new_array
}
Array.prototype.distinct = function () {
    const new_array = []
    for (const element of this) {
        if (!new_array.includes(element)) {
            new_array.push(element)
        }
    }
    return new_array
}

const update_counts = (counts, components, weights) => {
    const pos = components.map(c => weights[c]).filter(weight => weight > 0).length
    const neg = components.map(c => weights[c]).filter(weight => weight < 0).length
    if (pos + neg !== components.length) {
        counts.other += 1
    } else {
        if (pos === 1 || neg === 1) {
            counts.one_not_same_sign_count += 1
        } else if (pos === 0 || neg === 0) {
            counts.all_same_sign_count += 1
        } else {
            counts.other += 1
        }
    }
}

const solve_groups = (game) => {
    let weights = {}
    const keys = Object.keys(game.links).sort((a, b) => Math.random() - 0.5)
    const [key1, key2] = keys
    // console.log(key1, key2)
    // console.log(keys)
    for (const component of keys) {
        if (component === key1) {
            weights[component] = 1
        } else if (component === key2) {
            weights[component] = -1
        } else {
            weights[component] = 0
        }
    }

    let links = game.links
    // console.log(weights)
    let i = 0
    const counts = {
        all_same_sign_count: 0,
        one_not_same_sign_count: 0,
        other: 0
    }
    for (i = 0; i < 20; i++) {
        const new_weights = {}
        counts.all_same_sign_count = 0
        counts.one_not_same_sign_count = 0
        counts.other = 0

        for (const component in links) {
            const components = links[component]
            update_counts(counts, components, weights)
            if (component === key1 || component === key2) {
                new_weights[component] = weights[component]
                continue
            }
            let weight = weights[component]

            for (const component2 of components) {
                weight += weights[component2] / links[component2].length
            }
            if (weight > 5) {
                weight = 5
            }
            if (weight < -5) {
                weight = -5
            }

            new_weights[component] = weight
        }
        weights = new_weights
        if (counts.other === 0 && counts.one_not_same_sign_count === 6) {
            break
        }
    }
    const pos = keys.map(key => weights[key]).filter(weight => weight > 0).length
    const neg = keys.map(key => weights[key]).filter(weight => weight < 0).length
    if (counts.other === 0 && counts.one_not_same_sign_count === 6) {
        if (pos*neg === 50) {
            console.log(weights)
        }
        console.log(key1, key2, i, pos, neg, pos * neg)
        return pos * neg
    }

    return null
}
/*
const solve_groups2 = (game) => {
    const groups = {}
    for (const component in game.links) {
        groups[component] = component
    }
    let links = game.links

    let has_changed = true
    // while (has_changed) 
    {
        has_changed = false
        for (const component in links) {
            const components = links[component]
            for (let component2_index = 0; component2_index < components.length; component2_index++) {
                const component2 = components[component2_index]
                for (let component3_index = component2_index + 1; component3_index < components.length; component3_index++) {
                    const component3 = components[component3_index]
                    if (links[component2].includes(component3)) {
                        const triplet = [component, component2, component3]
                        triplet.sort()
                        let local_group = triplet[0]
                        const distant_groups = triplet.map(component => groups[component]).filter(group => group).distinct().order()
                        if (distant_groups.length > 0) {
                            if (local_group < distant_groups[0]) {
                                for (const key of Object.keys(groups)) {
                                    if (distant_groups.includes(groups[key])) {
                                        groups[key] = local_group
                                    }
                                }
                            } else {
                                local_group = distant_groups[0]
                            }
                        }
                        for (const key of triplet) {
                            groups[key] = local_group
                        }
                        has_changed = true
                        // console.log(distant_groups)
                    }
                }
            }
        }
        for (const component in links) {
            if (groups[component] && groups[component] !== component) {
                delete links[component]
                // delete groups[component]
                continue

            }
            const components = links[component]
            links[component] = components.map(component => groups[component] || component).order().distinct()
        }
        console.log('vv', Object.keys(links).length)
    }
    console.log('ww', Object.values(groups).distinct().length)
    const final_groups = {}
    for (const component in groups) {
        const group = groups[component]
        if (!final_groups[group]) {
            final_groups[group] = []
        }
        final_groups[group].push(component)
    }
    console.log(final_groups)
    if (Object.keys(final_groups).length === 2) {
        const [a, b] = Object.values(final_groups).map(group => group.length)
        return a * b
    }

    return 0
}
*/

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
    console.log('uu', Object.keys(game.links).length)

    // const result = Object.keys(game.links).length
    const results = {}
    for (let i = 0; i < 50; i++) {
        const result = solve_groups(game)
        if (result !== null) {
            if (!results[result]) {
                results[result] = 0
            }

            results[result]++
        }
    }
    const result = Object.entries(results).sort((a, b) => b[0] - a[0])[0][0]
    console.log(results)
    return `${result}`;
}

module.exports = challenge;