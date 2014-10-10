'use strict';

module.exports = function(string) {
    return string.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
};
