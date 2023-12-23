const { debug } = require('./tools')
const parse_input = (input_lines) => {
    const game = {}
    game.bricks = []
    let id = 0
    for (const input_line of input_lines) {

        const [coord1, coord2] = input_line.split('~').map(coord => coord.split(',').map(item => parseInt(item)))
        const brick = {
            id,
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
        // console.log(`brick ${brick.id}:     x:${brick.min_x},${brick.max_x} y:${brick.min_y},${brick.max_y} z:${brick.min_z},${brick.max_z}`)
    }
    for (const brick of game.new_bricks) {
        // console.log(`new_brick ${brick.id}: x:${brick.min_x},${brick.max_x} y:${brick.min_y},${brick.max_y} z:${brick.min_z},${brick.max_z} ids:${brick.ids}`)
    }
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
            brick_to_add = { ...brick, ids:[...ids.keys()] }
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
    for (const brick of game.new_bricks) {
        if (brick.ids.length === 1) {
            not_removable[brick.ids[0]] = true
        }
    }
    let count = 0
    for (const brick of game.new_bricks) {
        if (!not_removable[brick.id]) {
            count += 1
        }
    }
    return count
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
    display(game)
    const result = count_removable(game)
    return `${result}`;
}

module.exports = challenge;