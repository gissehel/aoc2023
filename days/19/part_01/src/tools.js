/**
 * Display JSON objects on the console
 * 
 * @param {Object} obj The objects to debug
 */
const debug = (obj) => {
    for (const key in obj) {
        console.log(key, JSON.stringify(obj[key], null, 2))
    }
}

module.exports = { debug }