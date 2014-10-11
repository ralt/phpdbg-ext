var assert = require('assert');

// "mock"
document = { createElement: function() {} };

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

    it('should parse a self-closing element', function() {
        var test = '<help attr="vv" />';
        var actual = parser(test);
        assert.equal(true, actual.length === 1);
        assert.equal(true, actual[0].nodeName === 'help');
        assert.equal(true, actual[0].nodeValue === '');
        assert.equal(true, actual[0].attributes.length === 1);
        assert.equal(true, actual[0].attributes[0].name === 'attr');
        assert.equal(true, actual[0].attributes[0].value === 'vv');
    });

    it('should parse a self-closing element with random spaces', function() {
        var test = '<help   attr =   "v v "/>';
        var actual = parser(test);
        assert.equal(true, actual.length === 1);
        assert.equal(true, actual[0].nodeName === 'help');
        assert.equal(true, actual[0].nodeValue === '');
        assert.equal(true, actual[0].attributes.length === 1);
        assert.equal(true, actual[0].attributes[0].name === 'attr');
        assert.equal(true, actual[0].attributes[0].value === 'v v ');
    });

    it('should parse a mix of normal and self-closing nodes', function() {
        var test = '<help attr="v">ds</help> <help a="a"/>';
        var actual = parser(test);
        assert.equal(true, actual.length === 2);
        assert.equal(true, actual[0].nodeName === 'help');
        assert.equal(true, actual[1].nodeName === 'help');
        assert.equal(true, actual[0].attributes[0].value === 'v');
        assert.equal(true, actual[1].attributes[0].value === 'a');
    });

    it('should parse a mix of self-closing and normal nodes', function() {
        var test = '<help a="a"/><help attr="v">ds</help>';
        var actual = parser(test);
        assert.equal(true, actual.length === 2);
        assert.equal(true, actual[0].nodeName === 'help');
        assert.equal(true, actual[1].nodeName === 'help');
        assert.equal(true, actual[1].attributes[0].value === 'v');
        assert.equal(true, actual[0].attributes[0].value === 'a');
    });

    it('should parse multiple attributes', function() {
        var test = '<help a="b" c="d"/>';
        var actual = parser(test);
        var attrs = actual[0].attributes;
        assert.equal(true, attrs.length === 2);
        assert.equal(true, attrs[0].name === 'a');
        assert.equal(true, attrs[0].value === 'b');
        assert.equal(true, attrs[1].name === 'c');
        assert.equal(true, attrs[1].value === 'd');
    });
});
