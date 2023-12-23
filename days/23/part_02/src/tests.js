const fs = require('fs/promises')
const challenge = require('./challenge')


/**
 * Run a test
 * 
 * @param {String} name The test name
 * @returns Boolean
 */
const test = async (name) => {
    const input = await fs.readFile(`./tests/${name}/input.txt`, 'utf-8')
    const expected = await fs.readFile(`./tests/${name}/expected.txt`, 'utf-8')
    const actual = challenge(input)
    const success = actual === expected
    return { success, input, expected, actual, name }
}

/**
 * Run all tests
 */
const tests = async (options) => {
    options = options || {}
    let details = options.details || false
    const testNames = (await fs.readdir('./tests')).filter(name => !name.startsWith('.'))
    const results = await Promise.all(testNames.map(test))
    const success = results.every(result => result.success)
    if (success) {
        console.log('All tests passed!')
    } else {
        console.log('Some tests failed!')
        for (let index = 0; index < testNames.length; index++) {
            const { success, input, expected, actual, name } = results[index]
            console.log(`[${success ? '  ' : 'KO' }] Test [${name}]`)
        }
        if (details) {
            for (let index = 0; index < testNames.length; index++) {
                const { success, input, expected, actual, name } = results[index]
                if (!success) {
                    console.log('=========================')
                    console.log(`Test [${name}]`)
                    console.log('-------------------------')
                    console.log('Input:')
                    console.log(input)
                    console.log('-------------------------')
                    console.log('Expected:')
                    console.log(expected)
                    console.log('-------------------------')
                    console.log('Actual:')
                    console.log(actual)
                }
            }
        }
    }
}

main = async () => {
    const args = process.argv.slice(1)
    const details = args.includes('-d') || args.includes('--details')
    await tests({ details })
}

main()