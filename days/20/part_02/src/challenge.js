const { debug } = require('./tools')
const parse_input = (input_lines) => {
    const game = {}

    game.modules = {}
    game.modules['button'] = { name_src: 'button', type: 'simple', dests: {'broadcaster': true} }

    for (const input_line of input_lines) {
        const [src, dest] = input_line.split(' -> ')
        let name_src = src
        let type = "simple"
        if (name_src.startsWith('%')) {
            name_src = name_src.substring(1)
            type = "flipflop"
        }
        if (name_src.startsWith('&')) {
            name_src = name_src.substring(1)
            type = "conj"
        }
        dests = {}
        dest.split(', ').forEach(dest => {
            dests[dest] = true
        })
        game.modules[name_src] = { name_src, type, dests }
    }

    return game
}

const get_init_state = (game) => {
    const state = {}
    const conjs = {}
    for (const name in game.modules) {
        if (game.modules[name].type === "flipflop") {
            state[name] = 0
        }
        if (game.modules[name].type === "conj") {
            conjs[name] = true
            state[name] = {}
        }
    }
    for (const name in game.modules) {
        // console.log(name, game.modules[name])
        for (const dest_name in game.modules[name].dests) {
            if (dest_name in conjs) {
                state[dest_name][name] = 0
            }
        }
    }
    return state
}

const process = (game, state, count = 1) => {
    const signals_to_process = []
    const signals = { low: 0, high: 0 }
    // console.log('------- start -------')
    for (let index = 0; index < count; index++) {
        signals_to_process.push({ name: 'broadcaster', value: 0, from: 'button' })
        while (signals_to_process.length > 0) {
            const signal = signals_to_process.shift()
            const { name, value, from } = signal
            if (name === 'cn' && value === 1) {
                console.log(`${from} -> ${name} : ${value} [${index}]`)
            }
            if (name === 'rx' && value === 0) {
                return index
            }
            if (value === 1) {
                signals.high += 1
            } else if (value === 0) {
                signals.low += 1
            }
            // console.log(`${from}${game.modules[from] && game.modules[from].type === "flipflop" ? `[${state[from]}]` : ''} -${value}-> ${name}${game.modules[name] && game.modules[name].type === "flipflop" ? `[${state[name]}]` : ''}`)
            const module = game.modules[name]
            if (module) {
                if (module.type === "simple") {
                    for (const dest_name in module.dests) {
                        signals_to_process.push({ name: dest_name, value, from: name })
                    }
                } else if (module.type === "flipflop") {
                    if (value === 0) {
                        state[name] = 1 - state[name]
                        for (const dest_name in module.dests) {
                            signals_to_process.push({ name: dest_name, value: state[name], from: name })
                        }
                    }
                } else if (module.type === "conj") {
                    // console.log(name, module)
                    // console.log(state[name])
                    state[name][from] = value
                    let output = 1
                    if (Object.keys(state[name]).every(key => state[name][key] === 1)) {
                        output = 0
                    }
                    // console.log(state[name])
                    for (const dest_name in module.dests) {
                        signals_to_process.push({ name: dest_name, value: output, from: name })
                    }
                }
            }
        }
        // console.log('------- next -------')
    }
    return null
}

const display_dot = (game) => {
    let result = ''
    result += 'digraph {\n'
    result += '    rankdir=LR;\n'
    result += '    node [shape=box];\n'
    for (const name in game.modules) {
        const module = game.modules[name]
        if (module.type === "simple") {
            result += `    ${name} [shape=ellipse];\n`
        } else if (module.type === "flipflop") {
            result += `    ${name} [shape=box];\n`
        } else if (module.type === "conj") {
            result += `    ${name} [shape=diamond];\n`
        }
        for (const dest_name in module.dests) {
            result += `    ${name} -> ${dest_name};\n`
        }
}
    result += '}\n'
    console.log(result)
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
    // debug({ game })
    const state = get_init_state(game)
    // display_dot(game)
    const result = process(game, state, 1000000)
    return `${result}`;
}

module.exports = challenge;