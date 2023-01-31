import { NetSocket, SocketHandler } from './socketHandler';
import { useAgentStore } from '@/store/agentStore';
import { IAgentData, ICrimesData, IDocFileData } from '@/../shared/interfaces';
import { useCrimesStore } from '@/store/crimeStore';
import { useDocStore } from '@/store/docStore';

const authSocket = new NetSocket('authSocket');

if (SocketHandler.addSocket(authSocket)) {
    const agentStore = useAgentStore();
    const crimesStore = useCrimesStore();
    const docStore = useDocStore();

    authSocket.connect();

    authSocket.on('initializeUserData', (agentData: IAgentData) => {
        agentStore.agentInfo = agentData;
    });

    authSocket.on('initiliazeCrimes', (crimes: ICrimesData[]) => {
        crimesStore.initializeCrimes(crimes);
    });

    authSocket.on('initializeAgents', (agents: IAgentData[]) => {
        agentStore.agents = agents;
    });

    authSocket.on('initializeDocFiles', (docFiles: IDocFileData[]) => {
        docStore.initializeRecords(docFiles);
    });
}
