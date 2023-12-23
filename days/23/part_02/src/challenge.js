const { debug } = require('./tools')

const get_key = (x, y) => `${x},${y}`

const parse_lines = (input_lines) => {
    const game = {}

    game.y_length = input_lines.length
    game.x_length = input_lines[0].length
    for (let y = 0; y < game.y_length; y++) {
        for (let x = 0; x < game.x_length; x++) {
            const key = get_key(x, y)
            let char = input_lines[y][x]
            if ('^v<>'.includes(char)) {
                char = '.'
            }
            game[key] = { x, y, key, char }
            if (y === 0 && char === '.') {
                game.start = game[key]
            }
            if (y === game.y_length - 1 && char === '.') {
                game.stop = game[key]
            }
        }
    }

    return game
}

const get_possible_moves = (game, current, last) => {
    const key = get_key(current.x, current.y)
    if (game[key]) {
        const neighbours = [
            game[get_key(current.x, current.y - 1)],
            game[get_key(current.x, current.y + 1)],
            game[get_key(current.x - 1, current.y)],
            game[get_key(current.x + 1, current.y)],
        ].filter(
            (neighbour) =>
                neighbour &&
                (neighbour.char === '.') &&
                (neighbour.key !== last.key)
        )
        return neighbours
    }

    return []
}

const add_branch = (branches, branches_by_start_key, branch) => {
    branches.push(branch)
    const start_key = branch.start.key
    branches_by_start_key[start_key] = branches_by_start_key[start_key] || []
    if ( ! branches_by_start_key[start_key].map(branch => branch.first.key).includes(branch.first.key)) {
        branches_by_start_key[start_key].push(branch)
    }
}

const find_longest_path = (game) => {
    const queue_branches = get_possible_moves(game, game.start, { x: -1, y: -1, key: '' }).map(neighbour => ({ start: game.start, first: neighbour }))

    const branches = []
    const branches_by_start_key = {}

    while (queue_branches.length > 0) {
        const { start, first } = queue_branches.shift()
        const queue = [{ current: first, previous: start, distance: 1, start, first }]
        while (queue.length > 0) {

            const { previous, current, distance } = queue.shift()

            const neighbours = get_possible_moves(game, current, previous)
            if (neighbours.length > 1 || (neighbours.length === 0 && current.key === game.stop.key)) {
                add_branch(branches, branches_by_start_key, { start, first, last: previous, end: current, distance })
                add_branch(branches, branches_by_start_key, { start: current, first: previous, last: first, end: start, distance })
                neighbours.forEach((neighbour) => {
                    const start = current
                    const first = neighbour
                    if (! branches_by_start_key[start.key].map(branch => branch.first.key).includes(first.key)) {
                        queue_branches.push({ start, first })
                    }
                })
            } else if (neighbours.length === 1) {
                const neighbour = neighbours[0]
                queue.push({ current: neighbour, previous: current, distance: distance + 1, start, first })
            }
        }
    }

    const longest_for_position = {}

    const queue_branch_all = branches_by_start_key[game.start.key].map(branch => ({current: game.start, distance: 0, branch, history: new Set([game.start.key])}))
    
    let count = 0
    while (queue_branch_all.length > 0) {
        count++
        if (count % 100000 === 0) {
            console.log(queue_branch_all.length, longest_for_position[game.stop.key])
        }
        const { current, distance, branch, history } = queue_branch_all.shift()
        const next = branch.end
        const new_distance = distance + branch.distance

        const next_branches = branches_by_start_key[next.key].filter(branch => !history.has(branch.end.key))

        const longest_for_next = longest_for_position[next.key]
        if (longest_for_next === undefined) {
            longest_for_position[next.key] = new_distance
        } else {
            if (new_distance > longest_for_next && (next_branches.length > 0 || next.key === game.stop.key)) {
                longest_for_position[next.key] = new_distance
            }
        }

        if (next.key !== game.stop.key) {
            next_branches.map(branch => ({current: next, distance: new_distance, branch, history: new Set([...history.keys(), next.key])})).forEach(item => queue_branch_all.push(item))
        }

        queue_branch_all.sort((a, b) => b.distance - a.distance)
    }

    return longest_for_position[game.stop.key]
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
    const game = parse_lines(input_lines)

    const result = find_longest_path(game)
    return `${result}`;
}

module.exports = challenge;