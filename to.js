"use strict";

const readline = require('readline');
const program = require('commander');
const repl = require('repl');

const log = (data) => {
    for (let i = 0; i < data.length; i++) {
        console.log(data[i].join(' '));
    }
}

const _cli = (args) => {
    program
        .version('0.1.0')
        .description('to ')
        .option('-f, --func <function>', 'function to run')
        .action(_runSimpleFunc)
        .parse(args);
}

const _runSimpleFunc = (statement) => {
    const simpleFunc = eval(`(data) => {${statement}}`)
    _readInput(simpleFunc);
}

/**
 * Read input from stdin. Split input on whitespace and newlines, invoke
 * callback on the data.
 *
 * @param {function} callback A function to call with the read-in data.
 */
const _readInput = (callback) => {
    const rl = readline.createInterface({
        input: process.stdin,
    });
    const data = [];

    rl.on('line', (input) => {
        data.push(input.trim().split(/\s+/));
    })
    rl.on('close', () => {
        console.log("hi")
        repl.start('>> ');
        setTimeout(() => {}, 3000)
        // callback(data);
    })
}

const main = () => {
    _cli(process.argv);
    if (program.func !== undefined) {
        const userFunc = eval(program.func);
        _readInput(userFunc);
    }
    if (process.argv.length === 2) {
        const replFunc = (data) => {
            repl.start('> ');
        }
        _readInput(replFunc);
    }
}

main()

