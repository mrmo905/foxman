import EventEmitter from 'events';
import path from 'path';
import { Server as WebSocketServer } from 'ws';
import { util } from '../../helper'

class Reloader extends EventEmitter {
  constructor(options) {
    super();
    Object.assign(this, options);
    this.bindChange();
    this.buildWebSocket();
  }
  bindChange(){
    let [server,watcher] = [this.server, this.watcher];
    let reloadResources = [
      path.resolve(server.viewRoot, '**', '*.' + server.extension ),
      path.resolve(server.syncData, '**', '*' ),
      path.resolve(server.asyncData, '**', '*' )
    ];

    reloadResources.concat( server.static.map( item => {
      return [ path.resolve( item, '**', '*.js' ), path.resolve( item, '**', '*.css' )];
    }));

    this.watcher.onChange( reloadResources, ( arg0, arg1  ) => {
      this.reload( arg0 );
    });
  }

  buildWebSocket(){
    let serverApp = this.server.serverApp;
    this.wss = new WebSocketServer({
        server: serverApp
    });

    this.wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            console.log('received: %s', message);
        });
    });

    this.wss.broadcast = (data) => {
        this.wss.clients.forEach(function each(client) {
            client.send(data, function(error) {
                if (error) {
                    console.log(error);
                }
            });
        });
    };
  }
  reload(...args){
    this.wss.broadcast( path.basename(args[0]) );
  }
}
export default Reloader;
