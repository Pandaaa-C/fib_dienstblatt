<template>
    <div class="component">
        <div class="window">
            <h1>EINHEIT ERSTELLEN</h1>
            <i class="fa-solid fa-xmark" @click="close()"></i>
            <input type="text" placeholder="Name" v-model="name" />
            <button @click="submit()">Bestätigen</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { apiUrl } from '@/config';
import { useAgentStore } from '@/store/agentStore';
import { useComponentStore } from '@/store/componentStore';
import { IUnitData } from '@shared/interfaces';

const name = $ref('');
const agentStore = useAgentStore();

const close = (): void => {
    useComponentStore().setAddUnitMode(false);
};

const submit = async (): Promise<void> => {
    close();

    const response: { message: string } = (
        await useFetch(apiUrl + '/units/addUnit', {
            method: 'POST',
            body: {
                unitName: name,
                initiator: agentStore.agentInfo.name,
            },
        })
    ).data.value as { message: string };

    useComponentStore().sendNotification(response.message);
};
</script>

<style scoped lang="scss">
.component {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;

    .window {
        position: relative;
        width: 15vw;
        height: fit-content;
        background: #181818;
        border-radius: 0.15vw;
        overflow: visible;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 1vw;

        h1 {
            color: #969696;
            font-size: 0.5vw;
            font-weight: 300;
            position: absolute;
            top: -0.3vw;
            left: 0.35vw;
        }

        i {
            color: #969696;
            font-size: 0.6vw;
            position: absolute;
            top: 0.35vw;
            right: 0.35vw;
            cursor: pointer;
        }

        input {
            width: 85%;
            height: 1vw;
            background: transparent;
            border: none;
            border-bottom: 0.1vw solid rgb(63, 63, 63);
            font-size: 0.6vw;
            margin-top: 0.7vw;
            color: #969696;
            padding-left: 0.5vw;
            -moz-appearance: textfield;
            margin-top: 1.5vw;

            &:nth-child(2) {
                margin-top: 1vw;
            }

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
        }

        button {
            width: 40%;
            height: 2vw;
            background: rgba(255, 255, 255, 0.05);
            color: #969696;
            border: none;
            border-radius: 0.2vw;
            margin-top: 1.1vw;
            cursor: pointer;
        }
    }
}
</style>
