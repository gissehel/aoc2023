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

const mod = (n, m) => ((n % m) + m) % m

const check_position_sum = (hailstone_sums, position_sum_ref, velocity_sum_ref) => {
    for (const hailstone_sum of hailstone_sums) {
        const info = get_diff_mod(hailstone_sum, velocity_sum_ref)
        if (info) {
            const { velocity_sum_diff, position_sum_mod } = info
            if (position_sum_mod !== position_sum_ref % velocity_sum_diff) {
                return false
            }
        }
    }
    return true
}

const get_diff_mod = (hailstone_sum, velocity_sum_ref) => {
    const { position_sum, velocity_sum } = hailstone_sum
    const velocity_sum_diff = velocity_sum - velocity_sum_ref
    if (velocity_sum_diff > 0) {
        return { mod: velocity_sum_diff, diff: mod(position_sum, velocity_sum_diff), direction: 1, position_sum }
    } else if (velocity_sum_diff < 0) {
        return { mod: -velocity_sum_diff, diff: mod(position_sum, -velocity_sum_diff), direction: -1, position_sum }
    }
    return null

}

const gcd = (a, b) => {
    if (b === 0) {
        return a
    }
    return gcd(b, a % b)
}

const mult_inv = (a, b) => {
    const b0 = b
    let x0 = 0n
    let x1 = 1n
    if (b === 1n) {
        return 1n
    }
    while (a > 1n) {
        const q = a / b
        const amb = a % b
        a = b
        b = amb
        const xqx = x1 - q * x0
        x1 = x0
        x0 = xqx
    }
    if (x1 < 0n) {
        x1 += b0
    }
    return x1
}

const get_div_mod = (a, b) => {
    const div = Math.floor(a / b)
    const modulus = mod(a, b)
    return { div, mod: modulus }
}

const find_chinese_remainder = (infos) => {
    const prod = infos.reduce((acc, info) => acc * BigInt(info.mod), BigInt(1))
    return Number(infos.map(info => {
        const inv = prod / BigInt(info.mod)
        const mult = inv * mult_inv(inv, BigInt(info.mod))
        return mult * BigInt(info.diff)
    }).reduce((acc, n) => acc + n, 0n) % prod)

}

const get_position_sum = (game) => {
    const { hailstones } = game
    const hailstone_sums = hailstones.map(hailstone => {
        const { position, velocity } = hailstone
        const { x, y, z } = position
        const { vx, vy, vz } = velocity
        const position_sum = x + y + z
        const velocity_sum = vx + vy + vz
        return { position_sum, velocity_sum }
    })
    const velocity_sums = hailstone_sums.map(hailstone => Math.abs(hailstone.velocity_sum))
    const position_sums = hailstone_sums.map(hailstone => hailstone.position_sum)
    const velocity_min = Math.min(...velocity_sums)
    const velocity_max = Math.max(...velocity_sums)
    const position_min = Math.min(...position_sums)
    const position_max = Math.max(...position_sums)

    for (let velocity_sum_ref = -velocity_max; velocity_sum_ref <= velocity_max; velocity_sum_ref++) {
        const infos = hailstone_sums.map(hailstone_sum => get_diff_mod(hailstone_sum, velocity_sum_ref)).filter(info => info !== null)
        const infos_min_pgcd = []
        const infos_work = [...infos]
        while (infos_work.length > 0) {
            const info = infos_work.shift()
            infos_min_pgcd.push(info)
            let index = 0
            while (index < infos_work.length) {
                const info_b = infos_work[index]
                if (gcd(info.mod, info_b.mod) === 1) {
                    index += 1
                } else {
                    infos_work.splice(index, 1)
                }
            }
        }
        const result = find_chinese_remainder(infos_min_pgcd)
        let is_valid = true
        for (const info of infos) {
            const { mod: modulus, direction, position_sum } = info
            if ((result - position_sum) * direction < 0 || mod((result - position_sum) * direction, modulus) !== 0) {
                is_valid = false
                break
            }
        }
        if (is_valid) {
            return result
            // console.log({ velocity_sum_ref: velocity_sum_ref, result, is_valid })
        }
    }

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
    const result = get_position_sum(game)

    return `${result}`;
}

module.exports = challenge;