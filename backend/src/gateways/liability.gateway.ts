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
import { DatabaseService } from 'src/services/database/database.service';
import {config} from "dotenv"
config();

@WebSocketGateway({
    namespace: 'liabilitySocket',
    cors: {
        credentials: true,
        origin: process.env.DEV_MODE ? process.env.DEV_FRONTEND_URL : process.env.MAIN_FRONTEND_URL,
    },
})
export class LiabilityGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly databaseService: DatabaseService) {}

    @WebSocketServer()
    server: any;

    async handleConnection(client: Socket, ...args: any[]) {
        await this.emit("initializeReductions", await this.databaseService.liabilityCollection.getAllModels());
    }

    handleDisconnect(client: any) {
    }

    async emit(name: string, data: any) {
        this.server.emit(name, data);
    }
}
