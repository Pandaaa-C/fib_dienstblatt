<template>
    <div class="container">
        <div class="sidebar">
            <i
                :class="`${item.class} ${item.route == activeRoute ? 'active' : ''}`"
                v-for="(item, index) in tabs"
                :key="index"
                @click="gotoPage(item.route)"
            ></i>
        </div>
        <div class="page">
            <slot />
        </div>

        <notifications-component />
        <loading-component />
    </div>
</template>

<script setup lang="ts">
import { IAgentData } from '@/../shared/interfaces';
import { apiUrl } from '@/config';
import '@/sockets/index';
import { useAgentStore } from '@/store/agentStore';

const router = useRouter();
const tabs = $ref([
    { route: '/dashboard', class: 'fa-solid fa-house' },
    { route: '/dashboard/crimes', class: 'fa-solid fa-clipboard' },
    { route: '/dashboard/liability', class: 'fa-solid fa-newspaper' },
    // { route: '/dashboard/divisions', class: 'fa-solid fa-people-group' },
    { route: '/dashboard/agents', class: 'fa-solid fa-list' },
    { route: '/divisions/doc', class: 'fa-solid fa-file' },
    { route: '/dashboard/settings', class: 'fa-solid fa-gears' },
    { route: '/auth/logout', class: 'fa-solid fa-right-from-bracket' }
]);

const activeRoute = computed(() => router.currentRoute.value.fullPath);
const agentStore = useAgentStore();

const gotoPage = (page: string): void => {
    router.push(page);
};

onMounted(() => {
    setTimeout(async() => {
        const cookies = useCookie('login_token');
        const loginToken = cookies.value;
        const response: IAgentData = (
            await useFetch(apiUrl + "/auth/verify", {
                method: "POST",
                body: {
                    token: loginToken
                }
            })
        ).data.value as IAgentData;
        
        agentStore.initializeAgentInfo(response);
    }, 0);
});
</script>

<style lang="scss" scoped>
.container {
    width: 100vw;
    height: 100vh;
    background: #141414;
}

.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 3vw;
    height: 100%;
    background: #181818;
    display: flex;
    align-items: center;
    flex-direction: column;

    i {
        color: #bfbfbf;
        font-size: 0.85vw;
        transition: 200ms;
        width: 100%;
        height: 2vw;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:first-child {
            margin-top: 0.5vw;
        }

        &:last-child {
            position: absolute;
            bottom: 0.5vw;
        }

        &.active {
            color: red;
        }
    }
}
</style>
