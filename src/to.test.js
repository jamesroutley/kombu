const to = require('./to');

test('flattenRows', () => {
    const runs = [
        {input: [['a'], ['b']], output: ['a', 'b']},
        {input: [['a', 'b'], ['c']], output: [['a', 'b'], ['c']]}
    ]
    runs.forEach((run) => {
        expect(to._flattenRows(run.input)).toEqual(run.output);
    })
});

test('flattenCols', () => {
    const runs = [
        {input: [['a', 'b']], output: ['a', 'b']},
        {input: [['a', 'b'], ['c']], output: [['a', 'b'], ['c']]}
    ]
    runs.forEach((run) => {
        expect(to._flattenCols(run.input)).toEqual(run.output);
    })
})

test('_isTwiceNestedArray', () => {
    const runs = [
        {input: ['a'], output: false},
        {input: [['a'], 'b'], output: false},
        {input: [['a'], ['b']], output: true}
    ]
    runs.forEach((run) => {
        expect(to._isTwiceNestedArray(run.input)).toEqual(run.output);
    })
})
