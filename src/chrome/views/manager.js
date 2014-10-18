'use strict';

var views = [];
var def;

exports.add = function(view) {
    views[view.getName()] = view;
};

exports.setDefault = function(view) {
    def = view.getName();
};

exports.run = function() {
    showView(def);
};

exports.setView = function(name) {
    showView(name);
};

exports.getView = function(name) {
    return views[name];
};

function showView(name) {
    Object.keys(views).forEach(function(view) {
        views[view].getElement().hidden = true;
    });
    views[name].getElement().hidden = false;
}
