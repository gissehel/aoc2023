const { debug } = require('./tools')

const parse_input = (input_lines) => {
    const game = {}
    game.hailstones = []
    for (const input_line of input_lines) {
        if (input_line.includes('@')) {
            const [position, velocity] = input_line.split(' @ ')
            const [x, y, z] = position.split(', ').map(n => parseInt(n))
            const [vx, vy, vz] = velocity.split(', ').map(n => parseInt(n))
            const hailstone = {
                position: { x, y, z },
                velocity: { vx, vy, vz }
            }
            game.hailstones.push(hailstone)
        }
    }
    return game
}

const find_crossing = (game, interval) => {
    const { hailstones } = game
    const [min, max] = interval
    // const crossings = []
    let count_crossing = 0
    for (let index_a = 0; index_a < hailstones.length; index_a++) {
        for (let index_b = index_a + 1; index_b < hailstones.length; index_b++) {
            const hailstone_a = hailstones[index_a]
            const hailstone_b = hailstones[index_b]
            const { position: position_a, velocity: velocity_a } = hailstone_a
            const { position: position_b, velocity: velocity_b } = hailstone_b
            const { x: x_a, y: y_a } = position_a
            const { vx: vx_a, vy: vy_a } = velocity_a
            const { x: x_b, y: y_b } = position_b
            const { vx: vx_b, vy: vy_b } = velocity_b
            const determinant = - (vx_a * vy_b) + (vx_b * vy_a)
            if (determinant === 0) {
                continue
            }
            const t_a = (- vx_b * (y_a - y_b) + vy_b * (x_a - x_b)) / determinant
            const t_b = (- vx_a * (y_a - y_b) + vy_a * (x_a - x_b)) / determinant
            if (t_a > 0 && t_b > 0) {
                const x = x_a + vx_a * t_a
                const y = y_a + vy_a * t_a
                // const crossing = { x, y, index_a, index_b }
                // console.log({ crossing })
                if (x >= min && x <= max && y >= min && y <= max) {
                    // crossings.push(crossing)
                    count_crossing += 1
                }

            }
        }
    }
    return count_crossing
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
    // const interval = [7,27]
    const interval = [200000000000000, 400000000000000]
    const count_crossing = find_crossing(game, interval)
    const result = count_crossing
    return `${result}`;
}

module.exports = challenge;