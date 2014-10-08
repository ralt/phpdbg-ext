'use strict';

var nodeNames = {
    'help': require('./help')
};

/**
 * @return array of nodes
 */
module.exports = function(xmldata) {
    var ret = [];
    var tmp;
    for (var i = 0; i < xmldata.children.length; i++) {
        tmp = xmldata.children[i];
        ret.push(nodeNames[tmp.nodeName](tmp));
    }
    return ret;
};
