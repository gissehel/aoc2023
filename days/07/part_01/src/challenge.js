const label_values = {
    'A': 13,
    'K': 12,
    'Q': 11,
    'J': 10,
    'T': 9,
    '9': 8,
    '8': 7,
    '7': 6,
    '6': 5,
    '5': 4,
    '4': 3,
    '3': 2,
    '2': 1,
}
const hand_types = {
    'fiveof': 7,
    'fourof': 6,
    'fullhouse': 5,
    'threeof': 4,
    'twopairs': 3,
    'onepair': 2,
    'highcard': 1,
}

const get_hand = (labels, bid) => {
    labels = labels.map(label => ({ label, value: label_values[label] }))
    const by_count = labels.reduce((by_count, label) => {
        by_count[label.value] = by_count[label.value] || 0
        by_count[label.value]++
        return by_count
    }, {})
    let hand_type = 'highcard'
    if (Object.values(by_count).includes(5)) {
        hand_type = 'fiveof'
    } else if (Object.values(by_count).includes(4)) {
        hand_type = 'fourof'
    } else if (Object.values(by_count).includes(3) && Object.values(by_count).includes(2)) {
        hand_type = 'fullhouse'
    } else if (Object.values(by_count).includes(3)) {
        hand_type = 'threeof'
    } else if (Object.values(by_count).filter(count => count === 2).length === 2) {
        hand_type = 'twopairs'
    } else if (Object.values(by_count).filter(count => count === 2).length === 1) {
        hand_type = 'onepair'
    }
    const hand_type_value = hand_types[hand_type]

    return { labels, bid, hand_type, hand_type_value }
}

const compare_hands = (hand_a, hand_b) => {
    if (hand_a.hand_type_value > hand_b.hand_type_value) {
        return 1
    } else if (hand_a.hand_type_value < hand_b.hand_type_value) {
        return -1
    } else {
        for (let i = 0; i < hand_a.labels.length; i++) {
            if (hand_a.labels[i].value > hand_b.labels[i].value) {
                return 1
            } else if (hand_a.labels[i].value < hand_b.labels[i].value) {
                return -1
            }
        }
        return 0
    }

}

const parse_input_line = (input_line) => {
    const [labels_string, bid] = input_line.trim().split(' ')
    const hand = get_hand(labels_string.split(''), bid)
    return hand
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
    const game = input_lines.map(parse_input_line).sort(compare_hands)

    let result = 0
    for (let i = 1; i <= game.length; i++) {
        const hand = game[i-1]
        result += hand.bid * i
    }
    return `${result}`;
}

module.exports = challenge;