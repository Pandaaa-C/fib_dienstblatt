<template>
    <div class="page">
        <h1>Account Verwaltung</h1>
        <h2>Passwort zurücksetzen</h2>
        <div class="user-password">
            <input type="password" placeholder="Neues Passwort" v-model="passwordInput" />
            <input type="password" placeholder="Passwort wiederholen" v-model="passwordInput2" />
            <button @click="changePassword()"><i class="fa-solid fa-check"></i></button>
        </div>
        <h1 v-if="agentStore.getAgentInfo.admin">Administration</h1>
        <h2 v-if="agentStore.getAgentInfo.admin">Passwort zurücksetzen</h2>
        <div v-if="agentStore.getAgentInfo.admin" class="user-password">
            <input type="text" placeholder="Benutzer" v-model="resetPasswordInput" />
            <button @click="resetPassword()"><i class="fa-solid fa-check"></i></button>
        </div>
        <h2 v-if="agentStore.getAgentInfo.admin">Fahrzeug hinzufügen</h2>
        <div v-if="agentStore.getAgentInfo.admin" class="user-password">
            <input type="text" placeholder="Name" v-model="vehicleAddName" />
            <input type="number" placeholder="Id" v-model="vehicleAddId" />
            <button @click="addVehicle()"><i class="fa-solid fa-check"></i></button>
        </div>
        <h2 v-if="agentStore.getAgentInfo.admin">Fraktion hinzufügen</h2>
        <div v-if="agentStore.getAgentInfo.admin" class="user-password">
            <input type="text" placeholder="Marabunta Grande 13" v-model="factionName" />
            <input type="text" placeholder="MG13" v-model="factionShortName" />
            <button @click="addFaction()"><i class="fa-solid fa-check"></i></button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { apiUrl } from '@/config';
import { useAgentStore } from '@/store/agentStore';
import { useComponentStore } from '@/store/componentStore';

definePageMeta({
    middleware: ['router-check'],
    layout: 'dashboard',
});

const agentStore = useAgentStore();
const componentStore = useComponentStore();
const router = useRouter();

// user stuff
let passwordInput = ref('').value;
let passwordInput2 = ref('').value;

const changePassword = async (): Promise<void> => {
    if (passwordInput !== passwordInput2) {
        componentStore.notify('Passwörter stimmen nicht überein');
        return;
    }

    const response: { message: string } = (
        await useFetch(apiUrl + '/agent/changePassword', {
            method: 'POST',
            body: {
                agentId: agentStore.agentInfo._id,
                password: passwordInput,
            },
        })
    ).data.value as { message: string };

    componentStore.notify(response.message);

    passwordInput = '';
    passwordInput2 = '';

    if (response.message.toLocaleLowerCase().includes('erfolgreich')) {
        router.push('/auth/login');
    }
};

// administration stuff
let resetPasswordInput = ref('').value;
let vehicleAddName = ref('').value;
let vehicleAddId = ref<number>().value;
let factionName = ref('').value;
let factionShortName = ref('').value;

const resetPassword = async (): Promise<void> => {
    const response: { message: string } = (
        await useFetch(apiUrl + '/admin/resetPassword', {
            method: 'POST',
            body: {
                agentId: agentStore.agentInfo._id,
                agentName: resetPasswordInput,
            },
        })
    ).data.value as { message: string };

    componentStore.notify(response.message);

    resetPasswordInput = '';
};

const addVehicle = async (): Promise<void> => {
    const response: { message: string } = (
        await useFetch(apiUrl + '/admin/addVehicle', {
            method: 'POST',
            body: {
                agentId: agentStore.agentInfo._id,
                vehicleName: vehicleAddName,
                vehicleId: vehicleAddId,
            },
        })
    ).data.value as { message: string };

    componentStore.notify(response.message);

    vehicleAddName = '';
    vehicleAddId = undefined;
};

const addFaction = async (): Promise<void> => {
    const response: { message: string } = (
        await useFetch(apiUrl + '/factions/addFaction', {
            method: 'POST',
            body: {
                agentId: agentStore.agentInfo._id,
                factionName: factionName,
                shortName: factionShortName,
            },
        })
    ).data.value as { message: string };

    componentStore.notify(response.message);

    factionName = '';
    factionShortName = '';
};
</script>

<style scoped lang="scss">
.page {
    margin-left: 5vw;
    margin-top: 2vw;
    width: 95vw;
    display: flex;
    flex-direction: column;

    h1 {
        color: #969696;
        font-weight: 300;
        font-size: 1.3vw;

        &:first-child {
            margin-bottom: 1.5vw;
        }

        &:not(:first-child) {
            margin-top: 2.5vw;
        }
    }

    h2 {
        margin-top: 1vw;
        margin-bottom: 0.2vw;
        color: #969696;
        font-weight: 300;
        font-size: 0.7vw;
    }

    .user-password {
        display: flex;
        height: 1.4vw;

        input {
            border: none;
            border-bottom: 0.1vw solid rgba(255, 255, 255, 0.1);
            background: transparent;
            color: #969696;
            margin-right: 1vw;
            width: 10vw;
            height: 1.3vw;
        }

        button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1.4vw;
            background: rgba(255, 255, 255, 0.05);
            border: none;
            border-radius: 0.15vw;
            cursor: pointer;

            i {
                color: #969696;
            }
        }
    }
}
</style>
