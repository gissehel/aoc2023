const { debug } = require('./tools')

const parse_input = (input_lines) => {
    const game = {}
    game.workflows = {}
    game.parts = []

    while (input_lines.length > 0) {
        const line = input_lines.shift()
        if (line.startsWith('{')) {
            // const current_part = {}
            // let total = 0
            // game.parts.push(current_part)
            // line.slice(1, -1).split(',').forEach(pair => {
            //     const [key, value_str] = pair.split('=')
            //     const value = parseInt(value_str)
            //     total += value
            //     current_part[key] = value
            // })
            // current_part.total = total
        } else {
            const [name, workflow_elements] = line.slice(0, -1).split('{')
            const workflow = {}
            workflow.name = name
            workflow.elements = []
            game.workflows[name] = workflow
            for (const element of workflow_elements.split(',')) {
                let [cond, result] = element.split(':')
                const next_element = {}
                workflow.elements.push(next_element)
                if (result === undefined) {
                    result = cond
                    cond = null
                }
                if (result !== 'A' && result !== 'R') {
                    next_element.next_workflow = result
                } else {
                    next_element.result = result
                }

                if (cond) {
                    if (cond.includes('<')) {
                        const [key, value_str] = cond.split('<')
                        const value = parseInt(value_str)

                        next_element.cond = { key, value: value, operator: '<', lambda: (part) => (part[key] < value) }
                    } else if (cond.includes('>')) {
                        const [key, value_str] = cond.split('>')
                        const value = parseInt(value_str)

                        next_element.cond = { key, value: value, operator: '>', lambda: (part) => (part[key] > value) }
                    }
                }
            }
        }
    }

    return game
}

const apply_workflow = (workflow, part) => {
    let next_workflow = null
    let result = null
    for (const element of workflow.elements) {
        if (element.cond) {
            if (element.cond.lambda(part)) {
                if (element.result) {
                    result = element.result
                } else if (element.next_workflow) {
                    next_workflow = element.next_workflow
                }
                return { next_workflow, result }
            }
        } else {
            if (element.result) {
                result = element.result
            } else if (element.next_workflow) {
                next_workflow = element.next_workflow
            }
            return { next_workflow, result }
        }
    }
    return { next_workflow, result }
}

const get_part_total = (part, name, key) => {
    let product = 1
    for (const key of ['x', 'm', 'a', 's']) {
        product *= (part[key][1] - part[key][0] + 1)
    }
    return product
}

const resolve_workflows = (game, intervals) => {
    let result = 0

    while (intervals.length > 0) {
        const interval = intervals.shift()
        const { workflow, parts } = interval
        const current_workflow = game.workflows[workflow]
        const next_intervals = []
        const current_parts = parts
        for (const element of current_workflow.elements) {
            if (current_parts === null) {
                break
            }
            if (element.cond) {
                const {key, value, operator, lambda} = element.cond
                const part = current_parts[key]
                const [start, end] = part
                if (operator === '<') {
                    if (start < value) {
                        let new_parts = { ...current_parts }
                        new_parts[key] = [start, Math.min(value - 1, end)]
                        if (value <= end) {
                            current_parts[key] = [value, end]
                            if (element.next_workflow) {
                                intervals.push({ workflow: element.next_workflow, parts: new_parts })
                            }
                            if (element.result === 'A') {
                                result += get_part_total(new_parts, workflow.name, key)
                            }
                        } else {
                            current_parts = null
                        }
                    }
                } else if (operator === '>') {
                    if (end > value) {
                        let new_parts = { ...current_parts }
                        new_parts[key] = [Math.max(value + 1, start), end]
                        if (value >= start) {
                            current_parts[key] = [start, value]
                            if (element.next_workflow) {
                                intervals.push({ workflow: element.next_workflow, parts: new_parts })
                            }
                            if (element.result === 'A') {
                                result += get_part_total(new_parts, workflow.name, key)
                            }
                        } else {
                            current_parts = null
                        }
                    }
                }
            } else {
                if (element.result === 'A') {
                    result += get_part_total(current_parts, workflow.name, '')
                } else if (element.next_workflow) {
                    intervals.push({ workflow: element.next_workflow, parts: current_parts })
                }
            }
        }
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
    
    const game = parse_input(input_lines)
    const init_intervals = [{ workflow: 'in', parts: { x:[1,4000], m:[1,4000], a:[1,4000], s:[1,4000] }}]
    const result = resolve_workflows(game, init_intervals)
    return `${result}`;
}

module.exports = challenge;