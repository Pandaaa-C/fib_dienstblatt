<template>
    <div class="page">
        <div class="list">
            <div class="head">
                <p class="name">Name</p>
                <p class="rank">Rang</p>
                <p class="dn">Dienstnummer</p>
                <p class="division">Abteilung</p>
                <p class="phone">Telefon</p>
                <p class="duty-time" v-if="agentStore.getAgentInfo.admin">Dienstzeit</p>
                <p class="join-date">Beitritt</p>
                <p class="uprank-date">Letzte Beförderung</p>
                <p class="admin">Bearbeitungsrechte</p>
                <p class="note">Notiz</p>
            </div>
            <div class="agent" v-for="item in sortedAgents" :key="item._id">
                <input class="name" type="text" v-model="item.name" :readonly="!editingAgents.includes(item._id)" />
                <input class="rank" type="text" v-model="item.rank" :readonly="!editingAgents.includes(item._id)" />
                <input class="dn" type="text" v-model="item.agentNumber" :readonly="!editingAgents.includes(item._id)" />
                <DropdownSelectionComponent
                    class="division"
                    :options="['DOC', 'DCI', 'DTE']"
                    :selected-indexes="item.divisions"
                    :readonly="!editingAgents.includes(item._id)"
                />
                <input class="phone" type="text" v-model="item.telefonNumber" :readonly="!editingAgents.includes(item._id)" />
                <input class="duty-time" type="text" :value="dutyTime(item)" :readonly="!editingAgents.includes(item._id)" v-if="agentStore.getAgentInfo.admin"/>
                <input class="join-date" type="text" v-model="item.entryDate" :readonly="!editingAgents.includes(item._id)" />
                <input class="uprank-date" type="text" v-model="item.lastUprank" :readonly="!editingAgents.includes(item._id)" />
                <div class="admin-wrapper">
                    <input class="admin" type="checkbox" :readonly="!editingAgents.includes(item._id)" :checked="item.admin" />
                </div>
                <input class="note" type="text" v-model="item.note" :readonly="!editingAgents.includes(item._id)" />
                <div class="actions" v-if="agentStore.getAgentInfo.admin">
                    <i class="fa-solid fa-floppy-disk" @click="updateAgent(item)" v-if="editingAgents.includes(item._id)"></i>
                    <i class="fa-solid fa-trash" @click="deleteAgent(item._id)" v-if="editingAgents.includes(item._id)"></i>
                    <i class="fa-solid fa-pen-to-square" @click="toggleEditorMode(item._id)"></i>
                </div>
            </div>
        </div>
        <div class="footer" v-if="agentStore.getAgentInfo.admin">
            <h1>Agent Hinzufügen</h1>
            <div class="credentials">
                <input class="name" type="text" placeholder="Name" v-model="agentName" />
                <input class="rank" type="number" placeholder="Rang" v-model="agentRank" />
                <input class="dn" type="text" placeholder="Dienstnummer" v-model="agentDN" />
                <input class="phone" type="text" placeholder="Telefon" v-model="agentPhone" />
                <button @click="addAgent()"><i class="fa-solid fa-check"></i></button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IAgentData } from '@/../shared/interfaces';
import { apiUrl } from '@/config';
import { useAgentStore } from '@/store/agentStore';
import { useComponentStore } from '@/store/componentStore';

definePageMeta({
    middleware: ['router-check'],
    layout: 'dashboard',
});

const componentStore = useComponentStore();
const agentStore = useAgentStore();

const editingAgents = ref<string[]>([]).value;

const sortedAgents = computed(() =>
    agentStore.getAgents.sort((a, b) => {
        return b.rank - a.rank;
    }),
);

const convertTime = (minutes: number): string => {
    var hours = minutes / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + 'h ' + rminutes + 'm';
};

const dutyTime = (item: IAgentData): string => {
    return convertTime(item.dutyTime);
};

let agentName = ref('').value;
let agentRank = ref<number>().value;
let agentDN = ref('').value;
let agentPhone = ref('').value;

const toggleEditorMode = (id: string): void => {
    if(editingAgents.includes(id)) {
        editingAgents.splice(editingAgents.indexOf(id), 1);
        return;
    }

    editingAgents.push(id);
};

const addAgent = async (): Promise<void> => {
    const response: { message: string } = (
        await useFetch(apiUrl + '/agent/addAgent', {
            method: 'POST',
            body: {
                initiator: agentStore.agentInfo.name,
                agentName: agentName,
                agentRank: agentRank,
                agentDN: agentDN,
                agentPhone: agentPhone
            },
        })
    ).data.value as { message: string };

    componentStore.notify(response.message);
};

const deleteAgent = async (agentId: string): Promise<void> => {
    const response: { message: string } = (
        await useFetch(apiUrl + '/agent/deleteAgent', {
            method: 'DELETE',
            body: {
                initiator: agentStore.agentInfo.name,
                agentId: agentId,
            },
        })
    ).data.value as { message: string };

    componentStore.notify(response.message);
};

const updateAgent = async (data: IAgentData): Promise<void> => {
    const response: { message: string } = (
        await useFetch(apiUrl + '/agent/updateAgent', {
            method: 'POST',
            body: {
                initiator: agentStore.agentInfo.name,
                agentData: data,
            },
        })
    ).data.value as { message: string };

    toggleEditorMode(data._id);
    componentStore.notify(response.message);
};
</script>

<style scoped lang="scss">
.page {
    .list {
        width: 92.5vw;
        height: 38vw;
        margin-left: 5vw;
        margin-top: 2vw;

        .head {
            width: 100%;
            height: 1vw;
            border-bottom: 0.1vw solid rgba(255, 255, 255, 0.1);
            display: flex;
        }

        .agent {
            overflow: visible;
            position: relative;
            width: 100%;
            height: 1.7vw;
            border-bottom: 0.05vw solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;

            .admin-wrapper {
                width: 8.5vw;

                .admin {
                    width: 0.7vw;
                    height: 100%;
                }
            }

            input {
                background: transparent;
                border: none;
            }

            .actions {
                position: absolute;
                right: 0.1vw;
                display: flex;
                align-items: center;

                i {
                    color: #969696;
                    font-size: 0.75vw;
                    cursor: pointer;
                    margin-left: 0.3vw;

                    &:nth-child(2) {
                        font-size: 0.7vw;
                    }
                }
            }
        }

        .agent > .division {
            width: 11.25vw;
            height: 70%;
            margin-right: 3vw;
        }

        p,
        input {
            color: #969696;
            font-size: 0.75vw;

            &.name {
                width: 10vw;
            }

            &.rank {
                width: 5vw;
            }

            &.dn {
                width: 7vw;
            }

            &.division {
                width: 15vw;
            }

            &.phone {
                width: 5.5vw;
            }

            &.duty-time {
                width: 6.5vw;
            }

            &.join-date {
                width: 5.5vw;
            }

            &.uprank-date {
                width: 8vw;
            }

            &.admin {
                width: 8.5vw;
            }
        }
    }

    .footer {
        position: absolute;
        bottom: 3.5vw;
        width: 92.5vw;
        height: 4vw;
        left: 5vw;

        h1 {
            color: #969696;
            font-size: 1.2vw;
            font-weight: 300;
        }

        .credentials {
            width: 100%;
            height: 1.1vw;
            display: flex;
            align-items: center;
            margin-top: 1vw;

            input {
                width: 5vw;
                height: 1vw;
                background: transparent;
                border: none;
                border-bottom: 0.1vw solid rgba(255, 255, 255, 0.1);
                font-size: 0.6vw;
                color: #969696;
                margin-right: 0.8vw;

                &.name {
                    width: 10vw;
                }
            }

            button {
                width: 1.1vw;
                height: 1.1vw;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                border-radius: 0.15vw;
                cursor: pointer;

                i {
                    color: white;
                    font-size: 0.55vw;
                }
            }
        }
    }
}
</style>
