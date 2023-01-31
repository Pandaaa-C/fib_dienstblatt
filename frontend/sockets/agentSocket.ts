import { useUnitStore } from '@/store/unitStore';
import { NetSocket, SocketHandler } from './socketHandler';
import { IAgentData } from '@/../shared/interfaces';
import { useAgentStore } from '@/store/agentStore';

const agentSocket = new NetSocket('agentSocket');

if (SocketHandler.addSocket(agentSocket)) {
    const agentStore = useAgentStore();

    agentSocket.connect();

    agentSocket.on('initializeAgents', (agents: IAgentData[]) => {
        agentStore.agents = agents;
    });

    agentSocket.on('updateAgent', (agent: IAgentData) => {
        agentStore.updateAgentInfo(agent);
    });

    agentSocket.on('deleteAgent', (agent: IAgentData) => {
        agentStore.deleteAgent(agent);
    });
}
