<template>
    <div :class="`component activity-${activityOptions[unit.activity]}`">
        <h1 :class="{pointer: isEditorMode}" @click="changeName()">{{ unit.name }}</h1>
        <i class="fa-solid fa-xmark delete-unit" @click="deleteUnit()" v-if="isEditorMode"></i>
        <div class="row space">
            <p>Tätigkeit:</p>
            <dropdown-component :options="activityOptions" :onSelect="selectActivity" :currentIndex="unit.activity" />
        </div>
        <div class="row">
            <p>Fahrzeug:</p>
            <dropdown-component
                :options="vehicles.map((x: any) => `${x.name} - ${x.vehicleId}`)"
                :currentIndex="currentVehicleIndex"
                :onSelect="selectVehicle"
            />
        </div>

        <div class="head">
            <p class="dn">DN</p>
            <p class="rank">Rang</p>
            <p class="name">Name</p>
            <p class="number">Telefon</p>
        </div>
        <div class="agent" v-for="agent in unit.agents" :key="agent._id">
            <p class="dn">{{ agent.agentNumber }}</p>
            <p class="rank">{{ agent.rank }}</p>
            <p class="name">{{ agent.name }}</p>
            <p class="number">{{ agent.telefonNumber }}</p>
            <div class="right-wrapper">
                <i class="fa-brands fa-twitch" style="color: rgb(155, 0, 200);" v-if="agent.streaming"></i>
                <i class="fa-solid fa-star delete" style="font-size: 0.9vh; right: 5%; color: yellow;" v-if="agent.rank >= 10"></i>
                <i @click="removeAgentFromUnit(agent._id)" v-if="isEditorMode" class="fa-solid fa-xmark delete"></i>
            </div>
        </div>
        <input type="text" placeholder="Agent hinzufügen" v-model="agentName" @keyup="onAddAgentKeyup" v-if="isEditorMode" />
        <div class="live" v-if="isEditorMode">
            <p>Live Streaming</p>
            <input type="checkbox" v-model="agentLive"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { apiUrl } from '@/config';
import { useAgentStore } from '@/store/agentStore';
import { useComponentStore } from '@/store/componentStore';
import { useVehicleStore } from '@/store/vehiclesStore';

const { unit, onUpdate } = defineProps(['unit', 'onUpdate']);

const componentStore = useComponentStore();
const agentStore = useAgentStore();
const isEditorMode = $computed(() => useComponentStore().getEditorMode);

const activityOptions = ['Streifendienst', 'HQ', 'Einsatz', 'Abteilung', 'Aktenklärung', 'Ausbildung', 'Einsatzleitung', 'Besprechung', 'Entführt', 'EST', 'Funk Aus', 'Büro', 'LSPD', 'Overwatch', 'Wanteds', 'Zivil', 'Parlament'];
const vehicles = $computed(() => useVehicleStore().getVehicles);

let agentName = ref('').value;
let agentLive = ref(false).value;
let currentActivity = unit.activity;
let currentVehicleIndex = $computed(() => {
    return vehicles.findIndex(x => x.vehicleId == unit.vehicle)
});

const changeName = (): void => {
    if(!isEditorMode) return;

    onUpdate(unit);
    useComponentStore().setUpdateUnitMode(true);
}

const selectActivity = async (activityIndex: number): Promise<void> => {
    currentActivity = activityIndex;
    

    const response: { message: string } = (
        await useFetch(apiUrl + '/units/updateUnit', {
            method: 'POST',
            body: {
                _id: unit._id,
                unitVehicle: vehicles[currentVehicleIndex] == null ? -1 : vehicles[currentVehicleIndex].vehicleId,
                unitActivity: currentActivity,
                initiator: agentStore.agentInfo.name,
            },
        })
    ).data.value as { message: string };

    componentStore.sendNotification(response.message);
};

const selectVehicle = async (vehicleIndex: number): Promise<void> => {
    const response: { message: string } = (
        await useFetch(apiUrl + '/units/updateUnit', {
            method: 'POST',
            body: {
                _id: unit._id,
                unitVehicle: vehicles[vehicleIndex].vehicleId,
                unitActivity: currentActivity,
                initiator: agentStore.agentInfo.name,
            },
        })
    ).data.value as { message: string };

    componentStore.sendNotification(response.message);
};

const deleteUnit = async (): Promise<void> => {
    const response: { message: string } = (
        await useFetch(apiUrl + '/units/deleteUnit', {
            method: 'DELETE',
            body: {
                unitId: unit._id,
                initiator: agentStore.agentInfo.name,
            },
        })
    ).data.value as { message: string };

    componentStore.sendNotification(response.message);
};

const addAgent = async (): Promise<void> => {
    const response: { message: string } = (
        await useFetch(apiUrl + '/units/addAgentToUnit', {
            method: 'POST',
            body: {
                initiator: agentStore.agentInfo.name,
                unitId: unit._id,
                agentName: agentName,
                agentId: agentStore.agentInfo._id,
                agentLive: agentLive
            },
        })
    ).data.value as { message: string };

    componentStore.sendNotification(response.message);
};

const onAddAgentKeyup = (event: KeyboardEvent): void => {
    if (event.key == 'Enter') {
        addAgent();
        agentName = '';
        agentLive = false;
    }
};

const removeAgentFromUnit = async (agentName: string): Promise<void> => {
    const response: { message: string } = (
        await useFetch(apiUrl + '/units/removeAgentFromUnit', {
            method: 'DELETE',
            body: {
                initiator: agentStore.agentInfo.name,
                unitId: unit._id,
                agentName: agentName,
                agentId: agentStore.agentInfo._id
            },
        })
    ).data.value as { message: string };

    componentStore.sendNotification(response.message);
};
</script>

<style scoped lang="scss">
.component {
    position: relative;
    width: 100%;
    padding-top: 0.01vw;
    padding-bottom: 0.5vw;
    background: #181818;
    border: 0.1vw solid #222222;
    border-radius: 0.15vw;
    overflow: visible;

    &.activity-Einsatz {
        border: 0.1vw solid red;
    }

    &.activity-Zivil {
        border: 0.1vw solid rgb(255, 136, 0);
    }

    h1 {
        color: #969696;
        font-size: 0.5vw;
        font-weight: 300;
        position: absolute;
        top: -0.375vw;
        left: 0.35vw;
        text-transform: uppercase;

        &.pointer {
            cursor: pointer;
        }
    }

    .delete-unit {
        color: #969696;
        font-size: 0.6vw;
        position: absolute;
        top: -0.35vw;
        right: 0.35vw;
        cursor: pointer;

        &:hover {
            color: red;
        }
    }

    .row {
        width: 95%;
        height: 0.9vw;
        margin-top: 0.2vw;
        margin-left: 2.5%;
        overflow: visible;

        &.space {
            margin-top: 0.75vw;
        }

        p {
            float: left;
            color: #969696;
            font-size: 0.7vw;
        }

        div {
            float: right;
            height: calc(100% - 0.2vw);
            width: 9vw;
            overflow: visible;
        }
    }

    .head {
        width: 95%;
        margin-left: 2.5%;
        height: 1vw;
        border-bottom: 0.1vw solid #353535;
        display: flex;
        align-items: center;
        margin-top: 0.3vw;

        p {
            color: #969696;
            font-size: 0.6vw;

            &.dn {
                width: 12%;
            }

            &.rank {
                width: 13%;
            }

            &.name {
                width: 44%;
            }

            &.number {
                width: 15%;
            }
        }
    }

    .agent {
        position: relative;
        width: 95%;
        margin-left: 2.5%;
        min-height: 0.8vw;
        height: fit-content;
        padding-top: 0.1vw;
        padding-bottom: 0.1vw;
        display: flex;
        align-items: center;

        p {
            float: left;
            color: #969696;
            font-size: 0.6vw;
            text-align: left;

            &.dn {
                width: 12%;
            }

            &.rank {
                width: 13%;
            }

            &.name {
                width: 44%;
            }

            &.number {
                width: 15%;
            }
        }

        .right-wrapper {
            position: absolute;
            display: flex;
            justify-content: right;
            align-items: center;
            right: 0.15vw;

            i {
                font-size: 0.6vw;
                color: #969696;
                cursor: pointer;

                &.delete {
                    margin-left: 0.25vw;

                    &:hover {
                        color: red;
                    }
                }
            }
        }
    }

    >input {
        width: 95%;
        height: 1vw;
        margin-left: 2.5%;
        background: transparent;
        border: none;
        border-bottom: 0.1vw solid rgb(63, 63, 63);
        font-size: 0.6vw;
        margin-top: 0.3vw;
        color: #969696;
    }

    .live {
        width: 95%;
        height: 1vw;
        margin-top: 0.2vw;
        margin-left: 2.5%;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        p {
            color: #969696;
            font-size: 0.6vw;
        }

        input {
            margin-left: 0.5vw;
        }
    }
}
</style>
