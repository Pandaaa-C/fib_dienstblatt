<template>
  <div class="page">
    <h1>Haftminderung Dokumentieren</h1>
    <div class="add">
      <input class="name" type="text" placeholder="Name" v-model="name"/>
      <input class="name" type="number" placeholder="Aktuelle Hafteinheiten" v-model="jailTime"/>
      <dropdown-component :current-index="0" :options="liabilityReductions" :on-select="selectReduction"/>
      <input class="name" type="text" placeholder="Grund..." v-model="reductionReason"/>
      <button @click="addReduction()"><i class="fa-solid fa-plus"></i></button>
    </div>
    <h1>Suche</h1>
    <div class="searchbar">
      <input type="text" placeholder="Eingabe..." v-model="searchInput"/>
    </div>
    <div class="list">
      <div class="head">
        <p class="name">Name</p>
        <p class="jailtime">Haftzeit</p>
        <p class="reduction">Haftminderung</p>
        <p class="agent">Agent</p>
        <p class="reason">Grund</p>
      </div>
      <div class="item" v-for="item in liabilities" :key="item._id">
        <p class="name">{{ item.name }}</p>
        <p class="jailtime">{{ item.jailtime }}</p>
        <p class="reduction">{{ item.reduction }}</p>
        <p class="agent">{{ item.agent }}</p>
        <p class="reason">{{ item.reason }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {apiUrl} from '@/config';
import {useAgentStore} from '@/store/agentStore';
import {useComponentStore} from '@/store/componentStore';
import {useCrimesStore} from '@/store/crimeStore';
import {useFactionsStore} from '@/store/factionsStore';
import {useLiabilityStore} from "@/store/liabilityStore";

definePageMeta({
  middleware: ['router-check'],
  layout: 'dashboard',
});

const liabilityStore = useLiabilityStore();
const componentStore = useComponentStore();
const agentStore = useAgentStore();
const factionsStore = useFactionsStore();
const liabilityReductions = [
  '5 Hafteinheiten',
  '10 Hafteinheiten',
  '15 Hafteinheiten',
  '20 Hafteinheiten',
  '25 Hafteinheiten',
  '30 Hafteinheiten'
];

const searchInput = ref('').value;
let name = ref('').value;
let liabilityReduction = ref('').value;
let jailTime = ref(undefined).value;
let reductionReason = ref('').value;

const liabilities = computed(() => {
  return searchInput.length < 1
      ? liabilityStore.reductions
      : liabilityStore.reductions.filter(
          (x: any) =>
              x.name.toLowerCase().includes(searchInput.toLowerCase()) ||
              x.reduction.toLowerCase().includes(searchInput.toLowerCase())
      );
});

const addReduction = async (): Promise<void> => {
  if (name == '' || liabilityReduction == '') {
    componentStore.notify("Du musst ein Namen eingeben und eine Haftminderung auswählen!");
    return;
  }

  const response: { message: string } = (
      await useFetch(apiUrl + '/liability/addReduction', {
        method: 'POST',
        body: {
          name: name,
          jailtime: jailTime,
          reduction: liabilityReduction,
          agentName: agentStore.agentInfo.name,
          reason: reductionReason,
        },
      })
  ).data.value as { message: string };

  componentStore.notify(response.message);

  if (response.message.toLocaleLowerCase().includes('erfolgreich')) {
    name = '';
    liabilityReduction = '';
    jailTime = undefined;
    reductionReason = '';
  }
};

const selectReduction = (index: number): void => {
  liabilityReduction = liabilityReductions[index];
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

  > h2 {
    color: #969696;
    font-weight: 300;
    font-size: 1vw;
    margin-left: 5vw;
    margin-top: 2vw;

    span {
      color: rgb(255, 0, 0);
    }
  }

  .add {
    width: 92.5vw;
    height: 3vw;
    margin-left: 5vw;
    display: flex;
    align-items: center;
    overflow: visible;

    input {
      height: 1.4vw;
      border: none;
      border-bottom: 0.1vw solid rgba(255, 255, 255, 0.1);
      background: transparent;
      color: #969696;
      margin-right: 1vw;

      &.name {
        width: 10vw;
      }

      &.location {
        width: 10vw;
      }
    }

    .component {
      width: 6.5vw;
      height: 1.5vw;
      margin-right: 1vw;
    }

    .box {
      position: relative;
      width: fit-content;
      height: 100%;
      background: rgb(26, 26, 26);
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: visible;
      padding-left: 0.75vw;
      border-radius: 0.15vw;
      margin-right: 1vw;

      h1 {
        font-size: 0.7vw;
        font-weight: 300;
        color: #969696;
        position: absolute;
        top: -0.3vw;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
      }

      p {
        color: #969696;
        font-size: 0.5vw;
        margin-top: 0.5vw;
      }

      input[type='number'] {
        width: 3vw;
        text-align: center;
      }

      input[type='checkbox'] {
        margin-left: 0.2vw;
      }

      .camper {
        width: 8vw;
      }

      .proof {
        width: 6.76vw;
      }
    }

    .checka {
      width: 2vw;
      margin-right: 1vw;

      p {
        color: #969696;
        font-size: 0.6vw;
        text-align: center;
      }

      input {
        margin-left: 0.65vw;
      }

      &:nth-child(7) {
        width: 5vw;

        input {
          margin-left: 2.2vw;
        }
      }
    }

    button {
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

  .searchbar {
    width: 92.5vw;
    height: 1.5vw;
    margin-left: 5vw;
    margin-top: 0.5vw;

    input {
      height: 1.4vw;
      width: 15vw;
      border: none;
      border-bottom: 0.1vw solid rgba(255, 255, 255, 0.1);
      background: transparent;
      color: #969696;
    }
  }

  .list {
    overflow: hidden;
    overflow-y: auto;
    width: 92.5vw;
    height: 29.5vw;
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
      min-height: 1.5vw;
      height: fit-content;
      padding-bottom: 0.2vw;
      padding-top: 0.2vw;
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

    .bnc {
      width: 3.2vw;
      margin-right: 0.3vw;
    }

    .mord {
      width: 3.2vw;
      margin-right: 0.3vw;
    }

    .illegal-items {
      width: 7.7vw;
      margin-right: 0.3vw;
    }

    p {
      color: #969696;
      font-size: 0.75vw;
      margin-right: 0.3vw;

      &.name {
        width: 20vw;
      }

      &.jailtime {
        width: 10vw;
      }

      &.reduction {
        width: 15vw;
      }

      &.agent {
        width: 15vw;
      }

      &.reason {
        width: 40vw;
      }
    }
  }
}

.link {
  text-decoration: underline;
  cursor: pointer;
}
</style>
