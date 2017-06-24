#!/usr/bin/env node

const parseArgs = require('minimist');

const cliHelp = `Usage: <command> | kombu [options] statement

Kombu is a command-line tool for manipulating tabulated data.

Tabulated data should be piped to kombu, and a statement which transforms the
data should be supplied. The data is parsed, and made available to the statment
via the variable 'data'.

Options:
    -h, --help          Show this message and exit
    -t, --title         Remove titles, assumed to be at row 0
`;

const _getExpectedArgKeys = (expectedArgs) => {
    let expectedArgKeys = Object.keys(expectedArgs);
    expectedArgKeys = expectedArgKeys.concat(Object.values(expectedArgs));
    expectedArgKeys.push('_');
    return expectedArgKeys;
};

const _getUnexpectedArgKeys = (expectedArgsKeys, args) => (
    Object.keys(args).filter((key) => !expectedArgsKeys.includes(key))
);

/**
 * Implements the CLI
 *
 * @param {Array} argv - An array of user-supplied arguments.
 *
 */
const _cli = (argv) => {
    const expectedArgs = {
        'h': 'help',
        't': 'title',
    };
    const args = parseArgs(argv, {
        boolean: ['h', 't'],
        alias: expectedArgs
    });

    const expectedArgKeys = _getExpectedArgKeys(expectedArgs);
    const unexpectedKeys = _getUnexpectedArgKeys(expectedArgKeys, args);
    if (unexpectedKeys.length > 0) {
        console.error(cliHelp);
        console.error(
            `Error: unrecognised flags: ${unexpectedKeys.join(', ')}`);
        process.exit();
    }

    if (args._.length !== 1) {
        console.error(cliHelp);
        console.error('Error: statement required');
        process.exit();
    }
    return args;
};

/**
 * Formats and prints data.
 *
 * @param {array} data - The data to print.
 *
 */
const _log = (data) => {
    if (typeof data === 'undefined') {
        return;
    }
    if (_isTwiceNestedArray(data)) {
        console.log(data.map((i) => i.join(' ')).join('\n'));
    } else if (data.constructor === Array) {
        console.log(data.join('\n'));
    } else {
        console.log(data);
    }
};

/**
 * Returns true if data is a twice nested array.
 *
 * @param {array} data - The array to check.
 */
const _isTwiceNestedArray = (data) => {
    if (!(data.constructor === Array)) {
        return false;
    }
    for (let item of data) {
        if (!(item.constructor === Array)) {
            return false;
        }
    }
    return true;
};

/**
 * Transform an array of single-item arrays to an array contianing the items.
 * If the array isn't an array of single-item arrays, return the original
 * array.
 * [[1], [2], [3]] -> [1, 2, 3]
 *
 * @param {Array} data - The array to transform
 */
const _flattenRows = (data) => {
    const containsOnlyOneItem = (element) => {
        return element.constructor === Array && element.length === 1;
    };
    if (data.every(containsOnlyOneItem)) {
        return data.map((d) => d[0]);
    }
    return data;
};

/**
 * Transform an array containing one item to that item.
 * If the array has more than one item, or if it isn't an array, return the
 * original object.
 * [[1, 2]] -> [1, 2]
 *
 * @param {array} data - The array to transform
 */
const _flattenCols = (data) => {
    if (data.constructor === Array && data.length === 1) {
        return data[0];
    }
    return data;
};

/**
 * Reads input from stdin, parses it and invokes 'callback' with it.
 *
 * @param {function} callback - A function to call with the parsed data.
 *
 */
const _readStdIn = (callback, removeTitles) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (chunk != null) {
            data += chunk;
        }
    });

    process.stdin.on('end', () => {
        data = data.trim();
        const processedData = _processData(data, removeTitles);
        _log(callback(processedData));
    });
};

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
const _processData = (tabulatedData, removeTitles) => {
    let data = tabulatedData.split('\n');
    if (removeTitles) {
        data = data.slice(1);
    }
    data = data.map((row) => row.trim().split(/\s+/));
    data = _flattenRows(data);
    data = _flattenCols(data);
    return data;
};

const main = () => {
    const args = _cli(process.argv.slice(2));
    const statement = args._[0];
    const userFunc = eval(`(data) => ${statement}`);
    _readStdIn(userFunc, args.title);
};

main();

// Functions are exported for testing only, and should not be imported.
module.exports = {
    _flattenCols,
    _flattenRows,
    _isTwiceNestedArray
};
