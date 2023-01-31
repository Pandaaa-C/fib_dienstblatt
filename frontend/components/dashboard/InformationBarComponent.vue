<template>
    <div class="top-item left">
        <p>AKTUELLE INFORMATIONEN</p>
        <textarea :readonly="!adminPermission" v-model="generalInfo.globalInfo" @blur="updateInfo()"></textarea>
    </div>

    <div class="top-item right">
        <div class="leitstelle">
            <p>LEITSTELLE</p>
            <input placeholder="Nicht Besetzt" v-model="generalInfo.leitstelle" readonly />
            <button @click="takeOverLeitstelle()"><i class="fa-solid fa-check"></i></button>
        </div>
        <div>
            <p>DEFCON</p>
            <input :class="`defcon-${generalInfo.defcon}`" placeholder="5" v-model="generalInfo.defcon"
                :readonly="!adminPermission" @blur="updateDefcon()" />
        </div>
        <div>
            <p>FUNK</p>
            <input placeholder="1000" v-model="generalInfo.funk" :readonly="!adminPermission" @blur="updateFunk()" />
        </div>
        <div>
            <p>OFFENE FÄLLE</p>
            <h2>{{ openCrimes }}</h2>
        </div>
        <div>
            <p>AGENTS</p>
            <h2>{{ agents }}</h2>
        </div>
        <div>
            <p>EINSATZ</p>
            <h2
                :style="{ color: ((operationAgents != null ? operationAgents : 0) + (operationOfficers != null ? operationOfficers : 0)) > generalInfo.maxEinsatz ? 'red' : 'white' }">
                {{ (operationAgents != null ? operationAgents : 0) + (operationOfficers != null ? operationOfficers : 0)
                }} / 25</h2>
        </div>
        <div>
            <p>HQ</p>
            <h2>{{ hqAgents != null ? hqAgents : 0 }}</h2>
        </div>
        <div>
            <p>STREIFENDIENST</p>
            <h2>{{ patrolAgents != null ? patrolAgents : 0 }}</h2>
        </div>
        <div>
            <p>SWAT</p>
          <h2 v-if="generalInfo.swat != undefined && generalInfo.swat.toLocaleLowerCase() == 'aktiv'" style="color: #15ff00">{{ generalInfo.swat }}</h2>
          <h2 v-else-if="generalInfo.swat != undefined && generalInfo.swat.toLocaleLowerCase() == 'inaktiv'" style="color: red">{{ generalInfo.swat }}</h2>
          <h2 v-else-if="generalInfo.swat != undefined && generalInfo.swat.toLocaleLowerCase() == 'abrüsten'" style="color: deepskyblue">{{ generalInfo.swat }}</h2>
          <h2 v-else-if="generalInfo.swat != undefined && generalInfo.swat.toLocaleLowerCase() == 'ausgerufen'" style="color: orange">{{ generalInfo.swat }}</h2>
          <h2 v-else style="color: red">Loading...</h2>
        </div>
    </div>
</template>

<script setup lang="ts">
import { apiUrl } from '@/config';
import { useAgentStore } from '@/store/agentStore';
import { useComponentStore } from '@/store/componentStore';
import { useCrimesStore } from '@/store/crimeStore';
import { useGeneralStore } from '@/store/generalStore';
import { useUnitStore } from '@/store/unitStore';

const generalStore = useGeneralStore();
const agentStore = useAgentStore();
const unitStore = useUnitStore();
const componentStore = useComponentStore();
const crimeStore = useCrimesStore();

const adminPermission = $computed(() => agentStore.$state.agentInfo.admin);
const generalInfo = $computed(() => generalStore.getGeneralInfo);
const operationOfficers = $computed(() => generalStore.generalInfo.currentOperationOfficer);
const openCrimes = $computed(() => crimeStore.getCrimes.filter(x => !x.finished).length);

const agents = computed((): number => {
    let count = 0;

    unitStore.units.forEach(unit => {
        count += unit.agents.length;
    });

    return count;
});

const patrolAgents = computed((): number | undefined => {
    let count = 0;

    unitStore.units.forEach((unit) => {
        if (unit.activity == 0) {
            count += unit.agents.length;
        }
    });

    return count;
});

const hqAgents = computed((): number | undefined => {
    let count = 0;

    unitStore.units.forEach((unit) => {
        if (unit.activity == 1) {
            count += unit.agents.length;
        }
    });

    return count;
});

const operationAgents = computed((): number | undefined => {
    let count = 0;

    unitStore.units.forEach((unit) => {
        if (unit.activity == 2) {
            count += unit.agents.length;
        }
    });

    return count;
});

const takeOverLeitstelle = async () => {
    const response: { message: string } = (
        await useFetch(apiUrl + '/info/takeOverLeitstelle', {
            method: 'POST',
            body: {
                agentId: agentStore.getAgentInfo._id,
            },
        })
    ).data.value as { message: string };

    componentStore.sendNotification(response.message);
};

const updateDefcon = async (): Promise<void> => {
    if (!adminPermission) return;

    const response: { message: string } = (
        await useFetch(apiUrl + "/info/updateDefconLevel", {
            method: "POST",
            body: {
                initiator: agentStore.agentInfo.name,
                defcon: generalInfo.defcon
            }
        })
    ).data.value as { message: string };

    componentStore.sendNotification(response.message);
};

const updateFunk = async (): Promise<void> => {
    if (!adminPermission) return;

    const response: { message: string } = (
        await useFetch(apiUrl + "/info/updateFunkCode", {
            method: "POST",
            body: {
                initiator: agentStore.agentInfo.name,
                funk: generalInfo.funk
            }
        })
    ).data.value as { message: string };

    componentStore.sendNotification(response.message);
};

const updateInfo = async (): Promise<void> => {
    if (!adminPermission) return;

    const response: { message: string } = (
        await useFetch(apiUrl + "/info/updateGeneralInfo", {
            method: "POST",
            body: {
                initiator: agentStore.agentInfo.name,
                message: generalInfo.globalInfo
            }
        })
    ).data.value as { message: string };

    componentStore.sendNotification(response.message);
};
</script>

<style scoped lang="scss">
.top-item {
    width: 23%;
    height: 100%;
}

.left {
    width: 30%;
    height: 80%;
    background: red;

    position: relative;
    background: #181818;
    margin-top: 0.5vw;
    overflow: visible;
    border-radius: 0.15vw;
    float: left;
    margin-bottom: 0.5vw;

    p {
        color: #969696;
        font-size: 0.5vw;
        position: absolute;
        top: -0.25vw;
        left: 0.25vw;
    }

    textarea {
        resize: none;
        background: transparent;
        border: none;
        color: #969696;
        margin-top: 0.8vw;
        font-weight: 300;
        font-size: 0.7vw;
        height: calc(100% - 1vw);
        width: calc(100% - 0.8vw);
        margin-left: 0.4vw;
    }
}

.right {
    width: 34.9%;
    margin-right: -0.5vw;

    div {
        position: relative;
        width: 6vw;
        height: 3vw;
        background: #181818;
        margin-top: 0.5vw;
        margin-left: 0.5vw;
        overflow: visible;
        border-radius: 0.15vw;
        display: flex;
        justify-content: center;
        align-items: center;
        float: left;
        margin-bottom: 0.5vw;

        p {
            color: #969696;
            font-size: 0.5vw;
            position: absolute;
            top: -0.25vw;
            left: 0.25vw;
        }

        h2 {
            color: #969696;
            font-weight: 300;
            font-size: 0.7vw;
        }

        input {
            background: transparent;
            border: none;
            width: 90%;
            text-align: center;
            color: #969696;
            font-weight: 300;
            font-size: 0.7vw;

            &.defcon-1 {
                color: red;
            }

            &.defcon-2 {
                color: orange;
            }

            &.defcon-3 {
                color: rgb(157, 255, 0);
            }

            &.defcon-4 {
                color: rgb(21, 255, 0);
            }

            &.defcon-5 {
                color: rgb(21, 255, 0);
            }
        }

        &.leitstelle {
            width: 12.5vw;

            input {
                width: 75%;
            }

            button {
                width: 1.2vw;
                height: 1.2vw;
                border: none;
                background: rgba(255, 255, 255, 0.1);
                display: flex;
                justify-content: center;
                align-items: center;
                margin-left: 0.5vw;
                border-radius: 0.15vw;
                cursor: pointer;

                i {
                    color: white;
                    font-size: 0.65vw;
                }
            }
        }
    }
}
</style>
