'use strict';

function ViewsManager() {
    this.views = {};
}

ViewsManager.prototype.add = function(view) {
    this.views[view.getName()] = view;
};

ViewsManager.prototype.setDefault = function(view) {
    this.default = view.getName();
};

ViewsManager.prototype.run = function() {
    var that = this;
    Object.keys(this.views).forEach(function(view) {
        that.views[view].getElement().hidden = true;
    });
    this.views[this.default].getElement().hidden = false;
};

ViewsManager.prototype.setView = function(name) {
    var that = this;
    Object.keys(this.views).forEach(function(view) {
        that.views[view].getElement().hidden = true;
    });
    this.views[name].getElement().hidden = false;
};

ViewsManager.prototype.getView = function(name) {
    return this.views[name];
};

module.exports = new ViewsManager;
