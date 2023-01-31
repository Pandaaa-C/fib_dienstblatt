import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
} from '@nestjs/websockets';
import { IAgentData } from '@shared/interfaces';
import { Socket } from 'dgram';
import { DatabaseService } from 'src/services/database/database.service';
import {config} from "dotenv"
config();

@WebSocketGateway({
    namespace: 'agentSocket',
    cors: {
        credentials: true,
        origin: process.env.DEV_MODE ? process.env.DEV_FRONTEND_URL : process.env.MAIN_FRONTEND_URL,
    },
})
export class AgentGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly databaseService: DatabaseService) {}

    @WebSocketServer()
    server: any;

    async handleConnection(client: Socket, ...args: any[]) {
        const users = await this.databaseService.userCollection.getAllModels();
        let agents: IAgentData[] = [];

        users.forEach(user => {
            agents.push({
                _id: user._id.toString(),
                admin: user.admin,
                agentNumber: user.serviceNumber,
                department: user.department,
                dutyTime: user.dutyTime,
                entryDate: user.entryDate.toLocaleDateString(),
                lastUprank: user.lastUprank.toLocaleDateString(),
                name: user.name,
                note: user.note,
                rank: user.rank,
                telefonNumber: user.telefonNumber,
                divisions: user.divisions,
                streaming: false
            });
        });

        client.emit('initializeAgents', agents);
    }

    handleDisconnect(client: any) {
    }

    async emit(name: string, data: any) {
        this.server.emit(name, data);
    }
}
