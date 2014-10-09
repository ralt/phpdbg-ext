'use strict';

var nodeNames = {
    'help': require('./help')
};

/**
 * @return array of nodes
 */
module.exports = function(xmlstring) {
    // sanity check
    if (xmlstring[0] !== '<') return;

    var el;
    var els = [];
    while ((el = getElement(xmlstring))) {
        els.push(el);
        xmlstring = xmlstring.slice(el.length);
    }

    return els.map(function(el) {
        return nodeNames[el.nodeName](el);
    });
};

// List of constants for the parser
// S_ for States
#define S_IN_NODENAME 0
#define S_AFTER_NODENAME 1
#define S_IN_ATTRIBUTE_NAME 2
#define S_IN_ATTRIBUTE_EQUAL 3
#define S_IN_ATTRIBUTE_BEFORE_VALUE 4
#define S_IN_ATTRIBUTE_VALUE 5
#define S_IN_ATTRIBUTE_AFTER_VALUE 6
#define S_OPENING_TAG 7
#define S_IN_CLOSE_OPENING_TAG 8
#define S_IN_NODEVALUE 9
#define S_IN_CLOSING_TAG 10
#define S_RETURN 11

// Gets the string of an element.
function getElement(xmlstring) {
    var state;
    var el = {
        length: 0,
        nodeName: '',
        attributes: [],
        nodeValue: ''
    };
    var tmpAttr;
    for (var i = 0; i < xmlstring.length; i++) {
        switch (xmlstring[i]) {
            case '<':
                if (!state) {
                    state = S_OPENING_TAG;
                }

                if (state === S_IN_NODEVALUE) {
                    state = S_IN_CLOSING_TAG;
                }
                break;
            case '/':
                break;
            case '>':
                if (state === S_SPACE || state === S_IN_ATTRIBUTE_AFTER_VALUE) {
                    state = S_IN_CLOSE_OPENING_TAG;
                }

                if (state === S_IN_CLOSING_TAG) {
                    state = S_RETURN;
                }
                break;
            case ' ':
                if (state === S_IN_NODENAME) {
                    state = S_SPACE;
                }

                if (state === S_IN_ATTRIBUTE_AFTER_VALUE) {
                    state = S_SPACE;
                }
                break;
            case '=':
                if (state === S_IN_ATTRIBUTE_NAME) {
                    state = S_IN_ATTRIBUTE_EQUAL;
                }
                break;
            case '"':
                if (state === S_IN_ATTRIBUTE_EQUAL) {
                    state = S_IN_ATTRIBUTE_BEFORE_VALUE;
                }

                if (state === S_IN_ATTRIBUTE_VALUE) {
                    state = S_IN_ATTRIBUTE_AFTER_VALUE;
                }
                break;
            default:
                if (state === S_OPENING_TAG) {
                    state = S_IN_NODENAME;
                }

                if (state === S_SPACE) {
                    state = S_IN_ATTRIBUTE_NAME;
                }

                if (state === S_IN_CLOSE_OPENING_TAG) {
                    state = S_IN_NODEVALUE;
                }
                break;
        }

        if (state === S_IN_NODENAME) {
            el.nodeName += xmlstring[i];
        }

        if (state === S_IN_ATTRIBUTE_NAME) {
            tmpAttr = el.attributes[el.attributes.length - 1];
            if (!tmpAttr) {
                tmpAttr = {
                    name: '',
                    value: ''
                };
            }
            tmpAttr.name += xmlstring[i];
            el.attributes[el.attributes.length - 1] = tmpAttr;
        }

        if (state === S_IN_ATTRIBUTE_VALUE) {
            tmpAttr = el.attributes[el.attributes.length - 1];
            tmpAttr.value += xmlstring[i];
            el.attributes[el.attributes.length - 1] = tmpAttr;
        }

        if (state === S_IN_NODEVALUE) {
            el.nodeValue += xmlstring[i];
        }

        if (state === S_RETURN) {
            break;
        }
    }

    el.length = i + 1;

    return el;
}
