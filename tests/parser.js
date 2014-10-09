'use strict';

var assert = require('assert');

var parser = require('../tmp/phpdbg/parser');

describe('parser', function() {
    it('should parse a basic node', function() {
        var test = '<help attr="v">ds</some>';
        var actual = parser(test);
        assert.equal(true, actual.length === 1);
        assert.equal(true, actual[0].nodeName === 'help');
        assert.equal(true, actual[0].nodeValue === 'ds');
        assert.equal(true, actual[0].attributes.length === 1);
        assert.equal(true, actual[0].attributes[0].name === 'attr');
        assert.equal(true, actual[0].attributes[0].value === 'v');
    });

    it('should parse a node with random spaces', function() {
        var test = '<help   attr = " vvv" >   ds</some>';
        var actual = parser(test);
        assert.equal(true, actual.length === 1);
        assert.equal(true, actual[0].nodeName === 'help');
        assert.equal(true, actual[0].nodeValue === '   ds');
        assert.equal(true, actual[0].attributes.length === 1);
        assert.equal(true, actual[0].attributes[0].name === 'attr');
        assert.equal(true, actual[0].attributes[0].value === ' vvv');
    });

    it('should parse several nodes', function() {
        var test = '<help attr="v">ds</help> <help>sd</help>';
        var actual = parser(test);
        assert.equal(true, actual.length === 2);
        assert.equal(true, actual[1].nodeName === 'help');
    });
});
