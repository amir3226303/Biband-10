// notify_service.js

const WebSocket = require('ws');
const EventEmitter = require('events');

class NotifyService extends EventEmitter {
    constructor(port) {
        super();
        this.wss = new WebSocket.Server({ port });
        this.init();
    }

    init() {
        this.wss.on('connection', (ws) => {
            console.log('Yeni bir istemci bağlandı.');
            
            ws.on('message', (message) => {
                console.log(`Gelen mesaj: ${message}`);
                this.emit('messageReceived', message);
            });

            ws.on('close', () => {
                console.log('İstemci bağlantısı kapandı.');
            });
        });
    }

    /**
     * Tüm bağlı istemcilere bildirim gönderir.
     * @param {string} data - Gönderilecek bildirim mesajı
     */
    broadcast(data) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    }
}

module.exports = NotifyService;
