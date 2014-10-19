'use strict';

var nodeNames = {
    'help': require('./commands/help'),
    'intros': function() {},
    'intro': require('./generic')('intro'),
    'command': require('./generic')('command'),
    'phpdbg': require('./commands/phpdbg'),
    'clearinfo': function() {},
    'clear': require('./generic')('clear'),
    'functioninfo': require('./generic')('functioninfo'),
    'includedfilecount': require('./generic')('includedfilecount'),
    'breakpoint': require('./generic')('breakpoint'),
    'inactive': require('./generic')('inactive')
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

// Testing is quite important for this function, so I'm making an exception.
// Since I don't want to mess with the interface, I use this dirty hack.
#ifdef TESTING
        return els;
#endif

    return els.map(function(el) {
        var ret = nodeNames[el.nodeName](el);
        var severity = el.getAttribute('severity');
        if (severity) {
            ret.classList.add(severity);
        }
        return ret;
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
        children: [],
        getAttribute: function(name) {
            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].name === name) {
                    return this.attributes[i].value;
                }
            }
            return false;
        }
    };
    var tmpAttrName = '';
    var tmpChild;

    main:
    for (var i = 0; i < xmlstring.length; i++) {
        // State management
        switch (xmlstring[i]) {
            case '<':
                if (!state) {
                    state = S_OPENING_TAG;
                }

                if (state === S_IN_NODEVALUE) {
                    if (nextNonSpaceChar(xmlstring.slice(i), '/')) {
                        state = S_IN_CLOSING_TAG;
                    }
                    else {
                        while ((tmpChild = getElement(xmlstring.slice(i)))) {
                            el.children.push(tmpChild);
                            i += el.children[el.children.length - 1].length;
                        }
                        break main;
                    }
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

function nextNonSpaceChar(string, char) {
    for (var i = 0; i < string.length; i++) {
        if (string[i] === ' ') continue;
        return string[i] === char;
    }
    return false;
}
