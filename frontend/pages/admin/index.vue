<template>
  <div class="page" v-if="loaded">
    <h1>Logs</h1>
    <h1>Suche</h1>
    <div class="searchbar">
      <input type="text" placeholder="Eingabe..." v-model="searchInput" />
    </div>
    <div class="list">

    </div>
  </div>
</template>

<script setup lang="ts">
import {useAgentStore} from "@/store/agentStore";
import {apiUrl} from "@/config";

definePageMeta({
  middleware: ['router-check'],
  layout: 'dashboard',
});

const agentStore = useAgentStore();
const router = useRouter();
let loaded = $ref(false);
let logs = [];

onMounted(() => {
  setTimeout(async () => {
    const adminRequest: boolean = (
        await useFetch(apiUrl + '/admin/checkAdminStatus', {
          method: 'POST',
          body: {
            id: agentStore.agentInfo._id
          }
        })
    ).data.value as boolean;

    if ((adminRequest as boolean) == false) {
      router.push('/dashboard');
    }

    setTimeout(() => {
      loaded = true;
    }, 500);
  }, 100);
});

</script>

<style scoped lang="scss">
.page {
  margin-left: 4vw;
  width: 95vw;
  display: flex;
  flex-direction: column;
  >h1 {
    color: #969696;
    font-weight: 300;
    font-size: 1.3vw;
    margin-left: 5vw;
    margin-top: 2vw;
  }

  >h2 {
    color: #969696;
    font-weight: 300;
    font-size: 1vw;
    margin-left: 5vw;
    margin-top: 2vw;

    span {
      color: rgb(255, 0, 0);
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
    width: 90vw;
    height: 35vw;
    margin-left: 5vw;
    margin-top: 2vw;
  }
}
</style>
