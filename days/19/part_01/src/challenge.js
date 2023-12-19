const { debug } = require('./tools')

const parse_input = (input_lines) => {
    const game = {}
    game.workflows = {}
    game.parts = []

    while (input_lines.length > 0) {
        const line = input_lines.shift()
        if (line.startsWith('{')) {
            const current_part = {}
            let total = 0
            game.parts.push(current_part)
            line.slice(1, -1).split(',').forEach(pair => {
                const [key, value_str] = pair.split('=')
                const value = parseInt(value_str)
                total += value
                current_part[key] = value
            })
            current_part.total = total
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

        const [key, value] = line.split(': ')
        game[key] = value
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

const resolve_workflows = (game) => {
    let result = 0
    for (const part of game.parts) {
        let next_workflow = 'in'
        while (next_workflow) {
            const workflow = game.workflows[next_workflow]
            const { next_workflow: next_workflow2, result: result2 } = apply_workflow(workflow, part)
            if (result2 === 'A') {
                result += part.total
            }
            next_workflow = next_workflow2
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
    const result = resolve_workflows(game)
    return `${result}`;
}

module.exports = challenge;