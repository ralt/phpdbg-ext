'use strict';

module.exports = function(string) {
    if (string === '') return '&nbsp;';
    return string.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
};
