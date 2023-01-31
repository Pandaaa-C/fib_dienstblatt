<template>
    <div class="component" v-if="active">
        <div class="spinner"></div>
    </div>
</template>

<script setup lang="ts">
import { useComponentStore } from '@/store/componentStore.js';

const active = computed((): boolean => useComponentStore().loadingActive);
</script>

<style scoped lang="scss">
.component {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;

    .spinner {
        width: 4.5vw;
        height: 4.5vw;
        border-radius: 100vw;
        border: 0.7vw solid rgb(37, 37, 37);
        border-top: 0.7vw solid rgb(255, 0, 0);
        box-shadow: 0 0 1vw 0 black;
        animation: spin 1000ms linear infinite;
    }
}

@keyframes spin {
    50% {
        transform: rotate(180deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
