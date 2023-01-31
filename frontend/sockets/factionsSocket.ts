import { useFactionsStore } from '@/store/factionsStore';
import { useGeneralStore } from '@/store/generalStore';
import { NetSocket, SocketHandler } from './socketHandler';

const factionsSocket = new NetSocket('factionsSocket');

if (SocketHandler.addSocket(factionsSocket)) {
    const factionsStore = useFactionsStore();

    factionsSocket.connect();

    factionsSocket.on('initializeFactions', (factions) => {
        factionsStore.initializeFactions(factions);
    });
}
