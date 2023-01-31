import { defineStore } from 'pinia';

export const useComponentStore = defineStore('component', {
    state: () => ({
        notify: (message: string) => {},
        loadingActive: false,
        editorMode: false,
        addUnitMode: false,
        updateUnitMode: false
    }),
    getters: {
        getEditorMode(state): boolean {
            return state.editorMode;
        },
        getAddUnitMode(state): boolean {
            return state.addUnitMode;
        },
        getUpdateUnitMode(state): boolean {
            return state.updateUnitMode;
        },
    },
    actions: {
        setNotifyFunction(notifyFunc: (message: string) => void) {
            this.notify = notifyFunc;
        },
        setLoadingComponentActive(active: boolean) {
            this.loadingActive = active;
        },
        sendNotification(message: string) {
            this.notify(message);
        },
        setEditorMode(active: boolean) {
            this.editorMode = active;
        },
        setAddUnitMode(active: boolean) {
            this.addUnitMode = active;
        },
        setUpdateUnitMode(active: boolean) {
            this.updateUnitMode = active;
        },
    },
});
