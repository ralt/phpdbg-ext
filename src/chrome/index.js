'use strict';

var viewsManager = require('./views/manager');
var connectionView = require('./views/connection');
var debuggerView = require('./views/debugger');

viewsManager.add(connectionView);
viewsManager.add(debuggerView);
viewsManager.setDefault(connectionView);
viewsManager.run();
