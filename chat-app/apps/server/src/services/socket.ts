import { Server } from "socket.io";
import Redis from 'ioredis';

const pub = new Redis({
    host: 'redis-3a4ea641-taruntailor7-57a2.l.aivencloud.com',
    port: 23949,
    username: 'default',
    password: 'AVNS_dNHIR_NR3Eukk1gYED-',
});
const sub = new Redis({
    host: 'redis-3a4ea641-taruntailor7-57a2.l.aivencloud.com',
    port: 23949,
    username: 'default',
    password: 'AVNS_dNHIR_NR3Eukk1gYED-',
});

class SocketService {
    private _io: Server;

    constructor() {
        console.log("Init Socket Service");
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*"
            }
        });
        sub.subscribe("MESSAGES");
    }

    public initListeners() {
        const io = this._io;
        console.log("Init Socket Listeners..."); 
        
        io.on("connect", (socket) => {
            console.log(`New Socket Connected`, socket.id); 

            socket.on("event:message", async ({ message }: {message: string}) => {
                console.log("New Message Received", message);
                await pub.publish("MESSAGES", JSON.stringify({ message }));
            });
        });

        sub.on("message", (channel, message) => {
            if (channel === 'MESSAGES') {
                io.emit('message', message);
            }
        });
    }

    get io() {
        return this._io;
    }
}

export default SocketService;