"use strict";

const readline = require('readline');
const stream = require('stream')

const parseArgs = require('minimist')

/**
 * Formats and prints data.
 *
 * @param {array} data - The data to print.
 *
 */
const _log = (data) => {
    if (_isTwiceNestedArray(data)) {
        console.log(data.map((i) => i.join(' ')).join('\n'))
    } else if (data.constructor === Array) {
        console.log(data.join('\n'))
    } else {
        console.log(data);
    }
}

/**
 * Returns true if data is a twice nested array.
 *
 * @param {array} data - The array to check.
 */
const _isTwiceNestedArray = (data) => {
    if (!(data.constructor === Array)) {
        return false
    }
    for (let item of data) {
        if (!(item.constructor === Array)) {
            return false
        }
    }
    return true
}

/**
 * Transform an array of single-item arrays to an array contianing the items.
 * If the array isn't an array of single-item arrays, return the original
 * array.
 * [[1], [2], [3]] -> [1, 2, 3]
 *
 * @param {Array} data - The array to transform
 */
const _flattenRows = (data) => {
    const containsOnlyOneItem = (element, index, array) => {
        return element.constructor === Array && element.length === 1
    }
    if (data.every(containsOnlyOneItem)) {
        return data.map((d) => d[0])
    }
    return data
}

/**
 * Transform an array containing one item to that item.
 * If the array has more than one item, or if it isn't an array, return the
 * original object.
 *
 * @param {array} data - The array to transform
 */
const _flattenCols = (data) => {
    if (data.constructor === Array && data.length === 1) {
        return data[0]
    }
    return data
}

/**
 * Implements the CLI
 *
 * @param {Array} argv - An array of user-supplied arguments.
 *
 */
const _cli = (argv) => {
    var args = parseArgs(argv, {
        boolean: ['f', 'h'],
        alias: {'function': 'f'}
    })
    if (args._.length !== 1) {
        console.error('Error: statement required');
        process.exit();
    }
    return args
}

/**
 * Reads input from stdin, parses it and invokes 'callback' with it.
 *
 * @param {function} callback - A function to call with the parsed data.
 *
 */
const _readStdIn = (callback) => {
    let data = ""
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (chunk != null) {
            data += chunk;
        }
    });

    process.stdin.on('end', () => {
        const processedData = _processData(data)
        _log(callback(processedData));
    });
}

/**
 * Transforms input from stdin to a nested array.
 *
 * @param {string} tabulatedData - A string of data to convert.
 *  If the data is multiple lines of whitespace separated strings, returns an
 *  array of arrays.
 *  If data is strings on multiple lines or multiple whitespace separated
 *  strings, returns an array
 *  If data is a string, returns the string in an array
 *
 */
const _processData = (tabulatedData) => {
    let data = tabulatedData.split('\n');
    data = data.map((row) => row.trim().split(/\s+/))
    data = _flattenCols(data);
    data = _flattenRows(data);
    return data
}

const main = () => {
    const args = _cli(process.argv.slice(2));
    const statement = args._[0]
    let userFunc;
    if (args.f) {
        userFunc = eval(statement);
    } else {
        userFunc = eval(`(data) => ${statement}`)
    }
    const stdinData = _readStdIn(userFunc);
}

main()

// Functions are exported for testing only, and should not be imported.
module.exports = {
    _flattenCols,
    _flattenRows,
    _isTwiceNestedArray
}
