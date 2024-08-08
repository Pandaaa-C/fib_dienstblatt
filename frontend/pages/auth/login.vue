<template>
    <div class="page">
        <img src="@/assets/images/logo.webp" />
        <h1>Willkommen zurück Agent. Sie können sich nun Anmelden.</h1>
        <input type="text" placeholder="Benutzername" v-model="username" />
        <input type="password" placeholder="Passwort" v-model="password" />
        <p @click="forgotPassword()">Passwort vergessen?</p>
        <button @click="submit()">Anmelden</button>
    </div>
</template>

<script setup lang="ts">
import { apiUrl } from '@/config';
import { useComponentStore } from '@/store/componentStore.js';
import { ILoginData } from '@shared/interfaces/loginData';

definePageMeta({
    middleware: ['router-check'],
});

const username: string = ref('').value;
const password: string = ref('').value;
const router = useRouter();

const componentStore = useComponentStore();

const submit = async (): Promise<void> => {
    if (username.length < 1 || password.length < 1) {
        componentStore.sendNotification('Es müssen alle Felder ausgefüllt sein!');
        return;
    }

    componentStore.setLoadingComponentActive(true);

    const loginResponse = await useFetch(apiUrl + '/auth/login', {
        method: 'post',
        credentials: 'include',
        body: {
            username: username,
            password: password,
        },
    });

    const userData: ILoginData = loginResponse.data.value as unknown as ILoginData;

    // @ts-ignore
    if (userData != null && userData.token.length > 16) {
        router.push('/dashboard');
        componentStore.setLoadingComponentActive(false);
        return;
    }

    componentStore.setLoadingComponentActive(false);
    componentStore.sendNotification('Benutzername oder Passwort falsch!');
};

const forgotPassword = (): void => {
    router.push('/forgot');
};
</script>

<style scoped lang="scss">
.page {
    display: flex;
    align-items: center;
    flex-direction: column;

    img {
        width: auto;
        height: 15vw;
        margin-top: 3vw;
    }

    h1 {
        color: #cbcbcb;
        font-size: 0.8vw;
        font-weight: 300;
        margin-top: 1.5vw;
        margin-bottom: 1.5vw;
    }

    input {
        width: 15.6vw;
        height: 2vw;
        margin-top: 1vw;
        background: transparent;
        border: none;
        border-bottom: 0.15vw solid #696969;
        text-indent: 1.6vw;
        background-repeat: no-repeat;
        background-size: 0.8vw;
        background-position: 0.3vw center;
        color: #979797;
        transition: 200ms;
        font-size: 0.7vw;

        &:focus {
            border-bottom-color: red;
        }

        &[type='text'] {
            background-image: url(@/assets/images/user-solid.svg);
        }

        &[type='password'] {
            background-image: url(@/assets/images/lock-solid.svg);
        }
    }

    p {
        color: #cbcbcb;
        font-size: 0.5vw;
        font-weight: 300;
        width: 15.6vw;
        text-align: right;
        margin-top: 0.2vw;
        margin-bottom: 1.5vw;
        cursor: pointer;
    }

    button {
        width: 10.4vw;
        height: 2.5vw;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 0.15vw;
        cursor: pointer;
        color: white;
        font-size: 0.7vw;
    }
}
</style>
