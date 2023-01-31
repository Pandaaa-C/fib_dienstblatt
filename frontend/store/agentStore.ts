import { defineStore } from 'pinia';
import { IAgentData } from '@shared/interfaces/agentData';

export const useAgentStore = defineStore('agent', {
    state: () => ({
        isInitialized: false,
        agentInfo: {
            _id: '',
            name: '',
            rank: 0,
            agentNumber: 0,
            admin: false,
            department: '',
            telefonNumber: 0,
            dutyTime: 0,
            entryDate: '',
            lastUprank: '',
            note: '',
            divisions: [],
        } as IAgentData,
        agents: [] as IAgentData[],
    }),
    getters: {
        getAgentInfo(state): IAgentData {
            return state.agentInfo;
        },
        getAgents(state): IAgentData[] {
            return state.agents;
        },
    },
    actions: {
        updateAgents(agents: IAgentData[]) {
            this.agents = agents;
        },
        updateAgentInfo(agentInfo: IAgentData) {
            this.agents[this.agents.findIndex(agent => agent._id == agentInfo._id)] = agentInfo;

            if (agentInfo._id == this.agentInfo._id) {
                this.agentInfo = agentInfo;
            }
        },
        initializeAgentInfo(agentInfo: IAgentData) {
            this.agentInfo = agentInfo;
        },
        deleteAgent(agentId: string) {
            this.agents = this.agents.filter(agent => agent._id != agentId);

            if (agentId == this.agentInfo._id) {
                useRouter().push('/auth/logout');
            }
        },
    },
});
