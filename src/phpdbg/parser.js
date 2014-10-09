'use strict';

var nodeNames = {
    'help': require('./help'),
    'intros': function() {},
    'intro': require('./intro')
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
// Testing is quite important for this function, so I'm making an exception.
#ifdef TESTING
        return el;
#endif
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
#define S_SPACE 12

// Gets the string of an element.
function getElement(xmlstring) {
    // Sanity check
    if (xmlstring.trim() === '') return false;

    var state;
    var el = {
        length: 0,
        nodeName: '',
        attributes: [],
        nodeValue: '',
        getAttribute: function(name) {
            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].name === name) {
                    return this.attributes[i].value;
                }
            }
        }
    };
    var tmpAttrName = '';

    main:
    for (var i = 0; i < xmlstring.length; i++) {
        // State management
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
                state = S_IN_CLOSING_TAG;
                break;
            case '>':
                if (state === S_SPACE || state === S_IN_ATTRIBUTE_AFTER_VALUE || state === S_IN_NODENAME) {
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

                if (state === S_IN_CLOSE_OPENING_TAG) {
                    state = S_IN_NODEVALUE;
                }

                if (state === S_IN_ATTRIBUTE_NAME) {
                    continue main;
                }

                if (state === S_IN_ATTRIBUTE_EQUAL) {
                    continue main;
                }

                if (state === S_IN_ATTRIBUTE_BEFORE_VALUE) {
                    state = S_IN_ATTRIBUTE_VALUE;
                }
                break;
            case '=':
                if (state === S_IN_ATTRIBUTE_NAME) {
                    state = S_IN_ATTRIBUTE_EQUAL;
                }

                if (state === S_IN_CLOSE_OPENING_TAG) {
                    state = S_IN_NODEVALUE;
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

                if (state === S_IN_ATTRIBUTE_BEFORE_VALUE) {
                    state = S_IN_ATTRIBUTE_VALUE;
                }

                if (state === S_IN_CLOSE_OPENING_TAG) {
                    state = S_IN_NODEVALUE;
                }
                break;
        }

        // State handling
        if (state === S_IN_NODENAME) {
            el.nodeName += xmlstring[i];
        }

        if (state === S_IN_ATTRIBUTE_EQUAL) {
            el.attributes.push({ name: tmpAttrName, value: '' });
            tmpAttrName = '';
        }
        if (state === S_IN_ATTRIBUTE_NAME) {
            tmpAttrName += xmlstring[i];
        }

        if (state === S_IN_ATTRIBUTE_VALUE) {
            el.attributes[el.attributes.length - 1].value += xmlstring[i];
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
