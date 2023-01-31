<template>
    <div class="background">
        <div class="content">
            <h1>Eintrag hinzufügen</h1>
            <i class="fa-solid fa-xmark" @click="setState(false)"></i>
            <div class="row">
                <input type="text" placeholder="Name" v-model="name"/>
                <DropdownComponent class="dropdown" :options="teams" :current-index="0" :on-select="onSelectTeam"/>
                <button @click="createRecord()">Erstellen</button>
            </div>
            <div class="textarea">
                <textarea v-model="info" placeholder="Informationen..."></textarea>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { apiUrl } from '@/config';
import { useAgentStore } from '@/store/agentStore';
import { useComponentStore } from '@/store/componentStore';

const { setState } = defineProps(['setState']);
const agentStore = useAgentStore();
const componentStore = useComponentStore();

const teams = [
    'Zivilist',
    // criminal
    'Vagos',
    'Grove',
    'Ballas',
    'Madrazo',
    'Organisazija',
    'Lost MC',
    'LCN',
    'MG13',
    'Bratwa',
    'Yakuza',
    'Balkaneros',
    // other
    'LSPD',
    'FIB',
    'LSMD',
    'DPOS',
    'Government'
];

const name = $ref('');
let team = '';
const info = $ref('');

const onSelectTeam = (index: number): void => {
    team = teams[index];
}

const createRecord = async (): Promise<void> => {
    setState(false);

    const response: { message: string } = (
        await useFetch(apiUrl + "/doc/addFile", {
            method: "POST",
            body: {
                agentId: agentStore.agentInfo._id,
                fileWantedName: name,
                wantedNameTeam: team,
                content: info
            }
        })
    ).data.value as { message: string}

    componentStore.notify(response.message);
}
</script>

<style scoped lang="scss">
.background {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;

    .content {
        position: relative;
        width: 50vw;
        height: 30vw;
        background: #141414;
        border-radius: 0.15vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        
        h1 {
            font-size: 1.3vw;
            font-weight: 300;
            margin-left: 1.5vw;
            margin-top: 1vw;
            color: #969696;
        }

        i {
            position: absolute;
            top: 1vw;
            right: 1.5vw;
            color: #969696;
            cursor: pointer;
        }

        .row {
            height: 1.5vw;
            width: 90%;
            margin-top: 2vw;
            overflow: visible;

            input {
                height: 1.4vw;
                border: none;
                border-bottom: 0.1vw solid rgba(255, 255, 255, 0.1);
                background: transparent;
                color: #969696;
                width: 12.5vw;
                margin-right: 2vw;
                float: left;
            }

            .dropdown {
                width: 10vw;
                height: 100%;
                float: left;
            }

            button {
                width: 10vw;
                height: 100%;
                background: rgb(26, 26, 26);
                border: none;
                border-radius: 0.15vw;
                color: #969696;
                float: right;
                box-shadow: 0 0 0.5vw 0.1vw rgba(0, 0, 0, 0.1);
                cursor: pointer;
            }
        }

        .textarea {
            width: 90%;
            height: 20vw;
            margin-top: 2vw;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgb(26, 26, 26);
            border: 0.1vw solid rgb(36, 36, 36);

            textarea {
                width: 98%;
                height: 95%;
                resize: none;
                color: #969696;
                background: none;
                border: none;
            }
        }
    }
}
</style>
