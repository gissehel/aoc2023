const fs = require('fs/promises');
const challenge = require('./challenge');

const main = async () => {
    const input = await fs.readFile('./input/input.txt', 'utf-8');
    const solution = challenge(input);
    console.log(solution);
}

main();
