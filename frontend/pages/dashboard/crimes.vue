<template>
  <div class="page">
    <h1>Akte anlegen</h1>
    <div class="add">
      <input class="name" type="text" placeholder="Name" v-model="name"/>
      <dropdown-component :options="teams" :on-select="selectTeam" :current-index="0"/>
      <input class="location" type="text" placeholder="Einsatzort" v-model="location"/>
      <div class="box">
        <h1>Schwarzgeld</h1>
        <input class="person" type="number" placeholder="Person" v-model="blackMoneyPerson"/>
        <input class="vehicle" type="number" placeholder="Fahrzeug" v-model="blackMoneyVehicle"/>
        <input class="house" type="number" placeholder="Haus" v-model="blackMoneyHouse"/>
        <div class="bnc">
          <p>BNC</p>
          <input type="checkbox" v-model="bnc"/>
        </div>
      </div>
      <div class="box">
        <h1>Camper</h1>
        <input class="camper" type="text" placeholder="Standort (Link)" v-model="camper"/>
      </div>
      <div class="checka">
        <p>Mord</p>
        <input type="checkbox" v-model="mord"/>
      </div>
      <div class="checka">
        <p>Illegale<br/>Gegenstände</p>
        <input type="checkbox" v-model="illegalItems"/>
      </div>
      <div class="box">
        <h1>Beweise</h1>
        <input class="proof" type="text" placeholder="Beweis 1" v-model="proof1"/>
        <input class="proof" type="text" placeholder="Beweis 2" v-model="proof2"/>
        <input class="proof" type="text" placeholder="Beweis 3" v-model="proof3"/>
      </div>
      <button @click="addCrime()"><i class="fa-solid fa-plus"></i></button>
    </div>
    <h1>Suche</h1>
    <div class="searchbar">
      <input type="text" placeholder="Eingabe..." v-model="searchInput"/>
    </div>
    <h2>Schwarzgeld Gesamtsumme: <span>${{ getMoneyString(blackMoneyAmount.toFixed(0)) }}</span></h2>
    <div class="list">
      <div class="head">
        <p class="name">Name</p>
        <p class="team">Zugehörigkeit</p>
        <p class="location">Einsatzort</p>
        <p class="date">Datum/Uhrzeit</p>
        <p class="black-money">Schwarzgeld</p>
        <p class="bnc">BNC</p>
        <p class="agent">Agent</p>
        <p class="camper">Camper</p>
        <p class="mord">Mord</p>
        <p class="illegal-items">Illeg. Gegenstände</p>
        <p class="proof">Beweise</p>
        <p class="open">Geschlossen</p>
      </div>
      <div class="item" v-for="item in crimes" :key="item._id">
        <p class="name">{{ item.wantedName }}</p>
        <p class="team">{{ item.faction }}</p>
        <p class="location">{{ item.location }}</p>
        <p class="date">{{ item.dateTime }}</p>
        <p class="black-money">
          P: ${{ getMoneyString(item.blackMoney.person) }} |
          F: ${{ getMoneyString(item.blackMoney.vehicle) }} |
          H: ${{ getMoneyString(item.blackMoney.house) }}
        </p>
        <div class="bnc"><input type="checkbox" v-model="item.bankNoteCode" onclick="return false;"/></div>
        <p class="agent">{{ item.agentName }}</p>
        <p class="camper link" @click="openLink(item.camperLocation)">Standort</p>
        <div class="mord"><input type="checkbox" v-model="item.murder" onclick="return false;"/></div>
        <div class="illegal-items"><input type="checkbox" v-model="item.illegalItems" onclick="return false;"/>
        </div>
        <p :class="`proof-item link ${item.proofs.proofOne.length < 1 ? 'empty' : ''}`"
           @click="openLink(item.proofs.proofOne)">Beweis 1</p>
        <p :class="`proof-item link ${item.proofs.proofTwo.length < 1 ? 'empty' : ''}`"
           @click="openLink(item.proofs.proofTwo)">Beweis 2</p>
        <p :class="`proof-item link ${item.proofs.proofThree.length < 1 ? 'empty' : ''}`"
           @click="openLink(item.proofs.proofThree)">Beweis 3</p>
        <div class="open"><input type="checkbox" v-model="item.finished"
                                 @click="updateCrime(item._id, item.finished)"/></div>
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

definePageMeta({
  middleware: ['router-check'],
  layout: 'dashboard',
});

const crimeStore = useCrimesStore();
const componentStore = useComponentStore();
const agentStore = useAgentStore();
const factionsStore = useFactionsStore();

const teams = computed((): string[] => {
  let teams = ['Zivilist'];

  factionsStore.factions.forEach((team) => {
    teams.push(team.shortName);
  });

  return teams;
});

const searchInput = $ref('');
let name = $ref('');
let team = $ref('');
let location = $ref('');
let blackMoneyPerson = $ref<number>();
let blackMoneyVehicle = $ref<number>();
let blackMoneyHouse = $ref<number>();
let bnc = $ref(false);
let camper = $ref('');
let mord = $ref(false);
let illegalItems = $ref(false);
let proof1 = $ref('');
let proof2 = $ref('');
let proof3 = $ref('');

const crimes = computed(() => {
  return searchInput.length < 1
      ? crimeStore.crimes
      : crimeStore.crimes.filter(
          (x: any) =>
              x.wantedName.toLowerCase().includes(searchInput.toLowerCase()) ||
              x.faction.toLowerCase().includes(searchInput.toLowerCase()) ||
              x.location.toLowerCase().includes(searchInput.toLowerCase()),
      );
});

const blackMoneyAmount = computed((): number => {
  let amount = 0;

  crimes.value.forEach(crime => {
    amount += crime.blackMoney.house >= 1 ? crime.blackMoney.house : 0;
    amount += crime.blackMoney.person >= 1 ? crime.blackMoney.person : 0;
    amount += crime.blackMoney.vehicle >= 1 ? crime.blackMoney.vehicle : 0;
  });

  return amount;
});

const addCrime = async (): Promise<void> => {
  if (name == '' || team == '') {
    componentStore.notify("Du musst ein Namen eingeben und Team auswählen!");
    return;
  }

  const response: { message: string } = (
      await useFetch(apiUrl + '/crimes/addCrime', {
        method: 'POST',
        body: {
          name: name,
          team: team,
          location: location,
          blackMoneyPerson: blackMoneyPerson,
          blackMoneyVehicle: blackMoneyVehicle,
          blackMoneyHouse: blackMoneyHouse,
          bnc: bnc,
          camper: camper,
          mord: mord,
          illegalItems: illegalItems,
          proof1: proof1,
          proof2: proof2,
          proof3: proof3,
          agentName: agentStore.agentInfo.name,
        },
      })
  ).data.value as { message: string };

  componentStore.notify(response.message);

  if (response.message.toLocaleLowerCase().includes('erfolgreich')) {
    name = '';
    team = '';
    location = '';
    blackMoneyPerson = undefined;
    blackMoneyVehicle = undefined;
    blackMoneyHouse = undefined;
    bnc = false;
    camper = '';
    mord = false;
    illegalItems = false;
    proof1 = '';
    proof2 = '';
    proof3 = '';
  }
};

const updateCrime = async (crimeId: string, isOpen: boolean) => {
  const response: { message: string } = (
      await useFetch(apiUrl + '/crimes/updateCrime', {
        method: 'POST',
        body: {
          initiator: agentStore.agentInfo.name,
          crimeId: crimeId,
        },
      })
  ).data.value as { message: string };

  componentStore.notify(response.message);
};

const getMoneyString = (money: number): string => {
  return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const openLink = (link: string): void => {
  if (link === undefined || link.length < 1) {
    componentStore.notify('Dieser Link ist ungültig!');
    return;
  }

  window.open(link);
};

const selectTeam = (index: number): void => {
  team = teams.value[index];
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
        width: 9.4vw;
      }

      &.team {
        width: 5.7vw;
      }

      &.location {
        width: 5.2vw;
      }

      &.date {
        width: 8.2vw;
      }

      &.black-money {
        width: 13.7vw;
      }

      &.bnc {
        width: 3.2vw;
      }

      &.agent {
        width: 9.7vw;
      }

      &.camper {
        width: 5.7vw;
      }

      &.mord {
        width: 3.2vw;
      }

      &.illegal-items {
        width: 7.7vw;
      }

      &.proof {
        width: 12.7vw;
      }

      &.proof-item {
        width: 3.7vw;

        &.empty {
          color: #646464;
        }

        &:nth-child(13) {
          width: 5vw;
        }
      }
    }
  }
}

.link {
  text-decoration: underline;
  cursor: pointer;
}
</style>
