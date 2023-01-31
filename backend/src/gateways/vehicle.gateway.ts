/*
https://docs.nestjs.com/websockets/gateways#gateways
*/

import { Socket } from 'dgram';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { DatabaseService } from 'src/services/database/database.service';
import {config} from "dotenv"
config();

@WebSocketGateway({
    namespace: 'vehicleSocket',
    cors: {
        credentials: true,
        origin: process.env.DEV_MODE ? process.env.DEV_FRONTEND_URL : process.env.MAIN_FRONTEND_URL,
    },
})
export class VehicleGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: any;

    constructor(private readonly databaseService: DatabaseService) {}

    async handleConnection(client: Socket, ...args: any[]) {
        client.emit('initializeVehicles', await this.databaseService.vehicleCollection.getAllModels());
    }

    handleDisconnect(client: any) {
    }

    async emit(name: string, data: any) {
        this.server.emit(name, data);
    }
}
