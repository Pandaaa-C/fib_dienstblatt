import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { ObjectId } from 'mongodb';
import { DatabaseService } from 'src/services/database/database.service';
import { Info } from 'src/services/database/entities';
import {config} from "dotenv"
config();

@WebSocketGateway({
    namespace: 'infoSocket',
    cors: {
        credentials: true,
        origin: process.env.DEV_MODE ? process.env.DEV_FRONTEND_URL : process.env.MAIN_FRONTEND_URL,
    },
})
export class InfoGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly databaseService: DatabaseService) {}

    @WebSocketServer()
    server: any;

    async handleConnection(client: Socket, ...args: any[]) {       
        client.emit('initializeInfo', await this.databaseService.infoCollection.getOneModel({ }));
    }

    handleDisconnect(client: any) {
    }

    async emit(name: string, data: any) {
        this.server.emit(name, data);
    }
}