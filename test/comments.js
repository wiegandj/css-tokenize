var fs = require('fs'),
    test = require('tape'),
    through = require('through2'),
    tokenize = require('../')

test('plain comment', function(t) {
    var tok = tokenize();

    var input = ['/* normal comment */', 'body: { color: blue; }'].join('\n');
    var expected = [
        ['comment', '/* normal comment */']
    ];

    t.plan(expected.length);
    tok.pipe(through.obj(function(token, enc, next) {
        token[1] = token[1].toString();
        if (expected.length > 0) t.same(token, expected.shift())
        next();
    }))

    tok.end(input);
})

test('comment with wrapped single quotes', function(t) {
    var tok = tokenize();

    var input = [
        '/* comment wrapped single quotes */", "body: { color: blue; }'
    ].join('\n');

    var expected = [
        ['comment', '/* comment wrapped single quotes */']
    ];

    t.plan(expected.length);
    tok.pipe(through.obj(function(token, enc, next) {
        token[1] = token[1].toString();
        if (expected.length > 0) t.same(token, expected.shift())
        next();
    }))

    tok.end(input);
})

test('comment with wrapped double quotes', function(t) {
    var tok = tokenize();

    var input = '/* comment "wrapped" double quotes */';
    var expected = [
        ['comment', '/* comment "wrapped" double quotes */']
    ];

    t.plan(expected.length);
    tok.pipe(through.obj(function(token, enc, next) {
        token[1] = token[1].toString();
        if (expected.length > 0) t.same(token, expected.shift())
        next();
    }))

    tok.end(input);
})

test('comment with one single quote', function(t) {
    var tok = tokenize();

    var input = '/* comment \' one single quote */';
    var expected = [
        ['comment', '/* comment \' one single quote */']
    ];

    t.plan(expected.length);
    tok.pipe(through.obj(function(token, enc, next) {
        token[1] = token[1].toString();
        if (expected.length > 0) t.same(token, expected.shift())
        next();
    }))

    tok.end(input);
})

test('multi-line comment with one single quote', function(t) {
    var tok = tokenize();

    var input = [
        '/* comment \naaa\nbbb\nccc \' ddd\neee */',
        'body: { color: blue; } '
    ].join('\n');

    var expected = [
        ['comment', '/* comment \naaa\nbbb\nccc \' ddd\neee */']
    ];

    t.plan(expected.length);
    tok.pipe(through.obj(function(token, enc, next) {
        token[1] = token[1].toString();
        if (expected.length > 0) t.same(token, expected.shift())
        next();
    }))

    tok.end(input);
})