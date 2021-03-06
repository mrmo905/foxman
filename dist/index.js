'use strict';

require('babel-polyfill');

var _index = require('./application/index');

var _index2 = _interopRequireDefault(_index);

var _server = require('./plugins/server/');

var _server2 = _interopRequireDefault(_server);

var _watcher = require('./plugins/watcher/');

var _watcher2 = _interopRequireDefault(_watcher);

var _precompiler = require('./plugins/precompiler/');

var _precompiler2 = _interopRequireDefault(_precompiler);

var _reloader = require('./plugins/reloader');

var _reloader2 = _interopRequireDefault(_reloader);

var _nei = require('./plugins/nei');

var _nei2 = _interopRequireDefault(_nei);

var _proxy = require('./plugins/proxy');

var _proxy2 = _interopRequireDefault(_proxy);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _helper = require('./helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var owner = void 0;

var Owner = function Owner(config) {
    _classCallCheck(this, Owner);

    var app = (0, _index2.default)();
    var root = app.root = config.root;
    /**
     * __setConfig
     */
    app.setConfig(config);

    /**
     * 内置组件
     */
    app.use(new _watcher2.default(Object.assign(config.watch, {
        root: root
    })));

    app.use(new _server2.default(Object.assign(config.server, {
        root: root
    })));

    app.use(new _precompiler2.default({
        preCompilers: config.preCompilers,
        root: root
    }));

    app.use(new _reloader2.default({}));

    if (!!config.nei) app.use(new _nei2.default(config.nei));

    /**
     * __load ex Plugins
     */
    app.use(config.plugins);

    app.use(new _proxy2.default({
        proxy: config.server.proxy,
        proxyServer: config.argv.proxy
    }));
    /**
     * __ready
     */
    app.run();
};

module.exports = function (config) {
    if (!owner) owner = new Owner(config);
    return owner;
};