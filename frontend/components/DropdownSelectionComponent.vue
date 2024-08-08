<template>
    <div class="component" @click="toggleSelectionMenu">
        <p>{{ options.filter((option: any) => selectedIndexes.includes(options.indexOf(option))).join(', ') }}</p>
        <i class="fa-solid fa-chevron-down"></i>

        <div class="options" v-if="isOpen && !readonly">
            <!-- <input dropdown-whitelist type="text" placeholder="Filter" v-model="filter" /> -->
            <div style="display: flex" v-for="(item, index) in getFilteredOptions" :key="index" @click="toggleIndex(index)">
                <input type="checkbox" :checked="selectedIndexes.includes(index)" readonly />
                <p>{{ item }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { options, selectedIndexes, readonly } = defineProps(['options', 'selectedIndexes', 'readonly']);
let isOpen = ref(false).value;
let filter = ref('').value;

const toggleSelectionMenu = (): void => {
    if (!readonly) {
        isOpen = !isOpen;
    }
};

const toggleIndex = (index: number): void => {
    if (selectedIndexes?.includes(index)) {
        selectedIndexes.splice(selectedIndexes.indexOf(index), 1);
    } else {
        selectedIndexes?.push(index);
    }
};

const getFilteredOptions = computed((): string[] => {
    return options.filter((x: string) => x.toLowerCase().includes(filter.toLowerCase()));
});
</script>

<style scoped lang="scss">
.component {
    position: relative;
    background: #181818;
    border: 0.1vw solid #222222;
    border-radius: 0.15vw;
    padding-left: 0.3vw;
    padding-right: 0.3vw;
    overflow: visible;
    cursor: pointer;

    > p {
        height: 100%;
        display: flex;
        align-items: center;
        color: #969696;
        font-size: 0.55vw;
        pointer-events: none;
        overflow: visible;
        float: left;
    }

    i {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #969696;
        font-size: 0.5vw;
        margin-left: 0.5vw;
        pointer-events: none;
        overflow: visible;
        float: right;
    }

    .options {
        position: absolute;
        top: 115%;
        left: -0.1vw;
        width: 100%;
        height: fit-content;
        background: #181818;
        border: 0.1vw solid #222222;
        border-radius: 0.15vw;
        z-index: 2;
        padding-bottom: 0.3vw;
        cursor: default;

        input {
            height: 0.7vw;
            border: none;
            background: transparent;
            font-size: 0.5vw;
            margin-left: 4%;
            color: white;
            margin-right: 1vw;
        }

        div {
            cursor: pointer;
            width: 100%;
            padding: 0.2vw;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            p {
                font-size: 0.5vw;
                color: #969696;
                text-indent: 3%;
            }

            &:hover {
                background: rgba(255, 255, 255, 0.2);
            }
        }
    }
}
</style>
