<template>
    <div class="component">
        <transition-group name="notify-anim">
            <div class="notification" v-for="item in notifications" :key="item.id">
                <p>{{ item.message }}</p>
            </div>
        </transition-group>
    </div>
</template>

<script setup lang="ts">
import { useComponentStore } from '@/store/componentStore.js';

let globalId = 0;

const notifications = ref<Notification[]>([]).value;

const pushNotification = (message: string): void => {
    const id = globalId++;
    notifications.push({ id: id, message: message });
    setTimeout(() => {
        notifications.splice(
            notifications.findIndex(x => x.id == id),
            1,
        );
    }, 4000);
};

onMounted(() => {
    useComponentStore().setNotifyFunction(pushNotification);
});

interface Notification {
    id: number;
    message: string;
}
</script>

<style scoped lang="scss">
.component {
    position: absolute;
    top: 0.8vw;
    left: 0.8vw;
    width: 15vw;
    height: calc(100% - 1.6vw);
    overflow: visible;
    pointer-events: none;

    .notification {
        width: fit-content;
        height: fit-content;
        background: #202020;
        border-left: 0.2vw solid red;
        padding: 0.7vw;
        margin-bottom: 0.5vw;

        p {
            color: rgb(218, 218, 218);
            font-size: 0.6vw;
        }
    }
}

.notify-anim-move,
.notify-anim-enter-active,
.notify-anim-leave-active {
    transition: all 0.25s ease;
}
.notify-anim-enter-from,
.notify-anim-leave-to {
    opacity: 0;
    transform: translateX(-20vw);
}
</style>
