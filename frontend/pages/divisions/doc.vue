<template>
    <div v-if="!canWatch">
        <div class="epage">
            <img src="@/assets/images/logo.webp" />
            <h1>Dazu bist du nicht Berechtigt.</h1>
        </div>
    </div>
    <div v-if="canWatch" class="page">
        <h1>Suche</h1>
        <div class="searchbar">
            <input type="text" placeholder="Eingabe..." v-model="searchInput" />
            <button @click="addRecord()"><i class="fa-solid fa-plus"></i></button>
        </div>
        <div class="list">
            <div class="head">
                <p class="name">Name</p>
                <p class="team">Zugehörigkeit</p>
                <p class="date">Datum/Uhrzeit</p>
                <p class="agent">Ersteller</p>
                <p class="info">Information</p>
                <p class="open">Offen</p>
            </div>
            <div class="item" v-for="item in records" :key="item._id">
                <p @click="viewRecord(item)" class="name">{{ item.fileWantedName }}</p>
                <p @click="viewRecord(item)" class="team">{{ item.wantedTeam }}</p>
                <p @click="viewRecord(item)" class="date">{{ item.dateTime }}</p>
                <p @click="viewRecord(item)" class="agent">{{ item.creator }}</p>
                <p @click="viewRecord(item)" class="info">{{ textContent(item) }}</p>
                <div class="open"><input type="checkbox" @click="updateRecord(item._id, item.finished)" v-model="item.finished" /></div>
            </div>
        </div>
        <DocAddRecordComponent :set-state="setAddComponentState" v-if="addComponentActive" />
        <DocViewRecordComponent :set-state="setViewComponentState" :record="viewComponentItem" v-if="viewComponentActive" />
    </div>
</template>

<script setup lang="ts">
import { useDocStore } from '@/store/docStore';
import DocAddRecordComponent from '@/components/divisions/DocAddRecordComponent.vue';
import DocViewRecordComponent from '@/components/divisions/DocViewRecordComponent.vue';
import { IDocFileData } from '@/../shared/interfaces';
import { apiUrl } from '@/config';
import { useComponentStore } from '@/store/componentStore';
import { useAgentStore } from '@/store/agentStore';

definePageMeta({
    middleware: ['router-check'],
    layout: 'dashboard',
});

const agentStore = useAgentStore();
const docStore = useDocStore();
const componentStore = useComponentStore();

const canWatch = computed(() => {
    return agentStore.getAgentInfo.divisions != null && agentStore.getAgentInfo.divisions.includes(0);
});

const searchInput = ref('').value;
let addComponentActive = ref(false).value;
let viewComponentActive = ref(false).value;
let viewComponentItem: any = null;

const textContent = (item: IDocFileData): string => {
    let returnText = '';


    for (let i = 0; i <= (item.content.length > 30 ? 15 : 2); i++) {
        returnText += item.content[i];
    }

    return returnText + '....';
};

const setAddComponentState = (state: boolean): void => {
    addComponentActive = state;
};

const setViewComponentState = (state: boolean): void => {
    viewComponentActive = state;
};

const records = computed(() => {
    return searchInput.length < 1
        ? docStore.getRecords
        : docStore.getRecords.filter((x: any) => x.wantedName.toLowerCase().includes(searchInput.toLowerCase()));
});

const addRecord = (): void => {
    setAddComponentState(true);
};

const viewRecord = (item: any): void => {
    viewComponentActive = true;
    viewComponentItem = item;
};

const updateRecord = async (recordId: string, isOpen: boolean) => {
    if (!isOpen) return false;

    const response: { message: string } = (
        await useFetch(apiUrl + '/doc/updateFile', {
            method: 'POST',
            body: {
                recordId: recordId,
                agentId: agentStore.agentInfo._id,
            },
        })
    ).data.value as { message: string };

    componentStore.notify(response.message);
};
</script>

<style scoped lang="scss">
.page {
    > h1 {
        color: #969696;
        font-weight: 300;
        font-size: 1.3vw;
        margin-left: 5vw;
        margin-top: 2vw;
    }

    .searchbar {
        position: relative;
        width: 92.5vw;
        height: 1.5vw;
        margin-left: 5vw;
        margin-top: 0.5vw;
        overflow: visible;

        input {
            height: 1.4vw;
            width: 15vw;
            border: none;
            border-bottom: 0.1vw solid rgba(255, 255, 255, 0.1);
            background: transparent;
            color: #969696;
        }

        button {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 2vw;
            height: 2vw;
            background: rgb(32, 32, 32);
            border: none;
            border-radius: 0.15vw;
            cursor: pointer;

            i {
                font-size: 0.9vw;
                color: #969696;
            }
        }
    }

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

        .item {
            position: relative;
            width: 100%;
            height: 1.7vw;
            border-bottom: 0.05vw solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            cursor: pointer;

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

        p {
            color: #969696;
            font-size: 0.75vw;

            &.name {
                width: 10vw;
            }

            &.team {
                width: 6vw;
            }

            &.date {
                width: 8vw;
            }

            &.info {
                width: 55vw;
            }

            &.open {
                width: 3.5vw;
            }

            &.agent {
                width: 10vw;
            }
        }
    }

    .component {
        position: absolute;
        top: 0;
        left: 0;
    }
}

.link {
    text-decoration: underline;
    cursor: pointer;
}

.epage {
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
        border-bottom: 0.15vw solid #707070;
        text-indent: 1.6vw;
        background-repeat: no-repeat;
        background-size: 0.8vw;
        background-position: 0.3vw center;
        color: #707070;
        transition: 200ms;
        font-size: 0.7vw;

        &:focus {
            color: white;
            border-bottom-color: red;
        }

        &[type='text'] {
            background-image: url(@/assets/images/user-solid.svg);

            &:focus {
                background-image: url(@/assets/images/user-solid2.svg);
            }
        }

        &[type='password'] {
            background-image: url(@/assets/images/lock-solid.svg);

            &:focus {
                background-image: url(@/assets/images/lock-solid2.svg);
            }
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
