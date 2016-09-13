import 'babel-polyfill';

import Application from './application/index';
import ServerPlugin from './plugins/server/';
import WatcherPlugin from './plugins/watcher/';
import PreCompilerPlugin from './plugins/precompiler/';
import ReloadPlugin from './plugins/reloader';
import NeiPlugin from './plugins/nei';
import AsyncTest from './plugins/asynctest';

import path from 'path';
import {
    Event,
    util
} from './helper';

let owner;
class Owner {
    constructor(config) {
        const app = Application();
        const root = app.root = config.root;
        /**
         * __setConfig
         */
        app.setConfig(config);



        /**
         * 内置组件
         */
        app.use( new WatcherPlugin( Object.assign( config.watch, {
            root
        })));

        app.use( new ServerPlugin( Object.assign( config.server, {
            root
        })));

        app.use( new PreCompilerPlugin({
            preCompilers: config.preCompilers,
            root
        }));

        app.use( new ReloadPlugin({}));


        if( !!config.nei )
          app.use( new NeiPlugin(config.nei) );
          
        /**
         * __load ex Plugins
         */
        app.use( config.plugins );

        /**
         * __ready
         */
        app.run();

    }
}

module.exports = function(config) {
    if (!owner) owner = new Owner(config);
    return owner;
}
