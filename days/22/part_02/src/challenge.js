const { debug } = require('./tools')
const parse_input = (input_lines) => {
    const game = {}
    game.bricks = []
    let id = 0
    for (const input_line of input_lines) {

        const [coord1, coord2] = input_line.split('~').map(coord => coord.split(',').map(item => parseInt(item)))
        const brick = {
            id: `${id}`,
            min_x: Math.min(coord1[0], coord2[0]),
            max_x: Math.max(coord1[0], coord2[0]),
            min_y: Math.min(coord1[1], coord2[1]),
            max_y: Math.max(coord1[1], coord2[1]),
            min_z: Math.min(coord1[2], coord2[2]),
            max_z: Math.max(coord1[2], coord2[2]),
        }
        game.bricks.push(brick)
        id += 1
    }
    return game
}

const display = (game) => {
    const bricks = game.bricks
    for (const brick of bricks) {
        console.log(`brick ${brick.id}:     x:${brick.min_x},${brick.max_x} y:${brick.min_y},${brick.max_y} z:${brick.min_z},${brick.max_z}`)
    }
    for (const brick of game.new_bricks) {
        console.log(`new_brick ${brick.id}: x:${brick.min_x},${brick.max_x} y:${brick.min_y},${brick.max_y} z:${brick.min_z},${brick.max_z} ids:${brick.ids}`)
    }
}

const display_dot = (game) => {
    const bricks = game.bricks
    console.log('digraph G {')
    for (const brick of game.new_bricks) {
        // console.log(`new_brick ${brick.id}: x:${brick.min_x},${brick.max_x} y:${brick.min_y},${brick.max_y} z:${brick.min_z},${brick.max_z} ids:${brick.ids}`)
        // console.log(`  ${brick.id} [label="${brick.id}"]`)
        for (const id of brick.ids) {
            console.log(`${brick.id}->${id}`)
        }
        if (brick.ids.length === 0) {
            console.log(`${brick.id}->ground`)
        }
    }
    console.log('}')
}

const get_key = (x, y) => `${x},${y}`

const resolv_fall = (game) => {
    const bricks = [...game.bricks]
    bricks.sort((a, b) => a.min_z - b.min_z)
    const new_bricks = []
    const map = {}

    for (const brick of bricks) {
        let min_fall = null
        let ids = new Set()
        for (let x = brick.min_x; x <= brick.max_x; x++) {
            for (let y = brick.min_y; y <= brick.max_y; y++) {
                const item = map[get_key(x, y)]
                const max_z = item ? item.max_z : 0
                const id_max_z = item ? item.id : null
                let fall = brick.min_z - max_z - 1
                if (id_max_z !== null && min_fall === fall) {
                    ids.add(id_max_z)
                }
                if (min_fall === null || min_fall > fall) {
                    min_fall = fall
                    ids = new Set()
                    if (id_max_z !== null) {
                        ids.add(id_max_z)
                    }
                }
            }
        }
        let brick_to_add = brick
        if (min_fall !== null && min_fall > 0) {
            brick_to_add = {
                id: brick.id,
                ids: [...ids.keys()],
                min_x: brick.min_x,
                max_x: brick.max_x,
                min_y: brick.min_y,
                max_y: brick.max_y,
                min_z: brick.min_z - min_fall,
                max_z: brick.max_z - min_fall,
            }
        } else {
            brick_to_add = { ...brick, ids: [...ids.keys()] }
        }
        new_bricks.push(brick_to_add)
        for (let x = brick.min_x; x <= brick_to_add.max_x; x++) {
            for (let y = brick.min_y; y <= brick_to_add.max_y; y++) {
                map[get_key(x, y)] = {
                    max_z: brick_to_add.max_z,
                    id: brick_to_add.id,
                }
            }
        }
    }
    game.new_bricks = new_bricks
}

const count_removable = (game) => {
    const not_removable = {}
    const impacted_sets_by_brick_id = {}
    const are_directly_on = {}
    const are_directly_under = {}
    for (const brick of game.new_bricks) {
        for (const id of brick.ids) {
            are_directly_on[id] = are_directly_on[id] || []
            are_directly_on[id].push(brick.id)
            are_directly_under[brick.id] = are_directly_under[brick.id] || []
            are_directly_under[brick.id].push(id)
        }
        if (brick.ids.length === 0) {
            are_directly_under[brick.id] = []
        }
    }
    for (const brick of game.new_bricks) {
        if (! are_directly_on[brick.id]) {
            are_directly_on[brick.id] = []
        }
    }
    // debug({ are_directly_on, are_directly_under })

    for (const brick of game.new_bricks) {
        if (brick.ids.length === 1) {
            not_removable[brick.ids[0]] = true
        }
    }

    let result = 0
    for (const id of Object.keys(not_removable)) {
        const to_remove = [id]
        let last_length = 0
        while (to_remove.length !== last_length) {
            last_length = to_remove.length
            for (const to_remove_id of [...to_remove]) {
                for (const impacted_id of are_directly_on[to_remove_id]) {
                    if (are_directly_under[impacted_id].filter(id => to_remove.indexOf(id) === -1).length <= 0) {
                        if (to_remove.indexOf(impacted_id) === -1) {
                            to_remove.push(impacted_id)
                        }
                    }
                }
            }
        }
        result += to_remove.length - 1
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
    resolv_fall(game)
    // display(game)
    // display_dot(game)
    const result = count_removable(game)
    return `${result}`;
}

module.exports = challenge;