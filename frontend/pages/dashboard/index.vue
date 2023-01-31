<template>
    <div class="page">
        <div class="top">
            <DashboardInformationBarComponent />
        </div>

        <div class="units">
            <div class="buttons">
                <button class="addunit" @click="toggleAddUnitMode()" v-if="isEditorMode">
                    <i class="fa-solid fa-plus"></i>
                </button>
                <button class="editor" @click="toggleEditor()">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </div>
            <br /><br />
            <div class="unit-wrapper" v-for="unit in units" :key="unit._id.toString()">
                <DashboardUnitComponent :on-update="setUpdatingUnit" :unit="unit" />
            </div>
        </div>

        <DashboardCreateUnitPopupComponent v-if="isUnitMode" />
        <DashboardUpdateUnitPopupComponent :unit="updatingUnit" v-if="isUnitUpdateMode" />
    </div>
</template>

<script setup lang="ts">
import { useUnitStore } from '@/store/unitStore';
import { useComponentStore } from '@/store/componentStore';

definePageMeta({
    middleware: ['router-check'],
    layout: 'dashboard',
});

const unitStore = useUnitStore();
const componentStore = useComponentStore();

const units = $computed(() => unitStore.getUnits);
const isEditorMode = $computed(() => componentStore.getEditorMode);
const isUnitMode = $computed(() => componentStore.getAddUnitMode);
const isUnitUpdateMode = $computed(() => componentStore.getUpdateUnitMode);

let updatingUnit = $ref<any>();

const toggleAddUnitMode = (): void => {
    componentStore.setAddUnitMode(true);
};

const toggleEditor = (): void => {
    componentStore.setEditorMode(!isEditorMode);
};

const setUpdatingUnit = (unit: any): void => {
    updatingUnit = unit;
}
</script>

<style scoped lang="scss">
.page {
    margin-left: 4vw;
    width: 95vw;
    display: flex;
    flex-direction: column;

    .top {
        width: 100%;
        height: 9vw;
        margin-top: 1vw;
        display: flex;
        justify-content: space-between;
        border-bottom: 0.1vw solid rgb(97, 97, 97);
    }

    .units {
        position: relative;
        width: 100%;
        height: 37vw;
        margin-top: 1vw;
        overflow-y: scroll;

        .buttons {
            position: absolute;
            top: 0;
            right: 1vw;

            button {
                width: 2vw;
                height: 2vw;
                background: #181818;
                border: none;
                margin-right: 0.5vw;
                cursor: pointer;

                i {
                    font-size: 1vw;
                    color: #969696;
                }
            }
        }

        .unit-wrapper {
            position: relative;
            width: 17.5vw;
            height: 12vw;
            background: transparent;
            overflow: visible;
            float: left;
            margin-top: 0.8vw;

            &:not(:nth-child(5n+3)) {
                margin-right: 1.37vw;
            }
        }
    }
}
</style>
