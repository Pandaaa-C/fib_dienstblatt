<template>
    <div class="container">
        <div class="page">
            <slot />
        </div>

        <notifications-component />
        <loading-component />
    </div>
</template>

<style lang="scss" scoped>
.container {
    width: 100vw;
    height: 100vh;
    background: #141414;
}
</style>
