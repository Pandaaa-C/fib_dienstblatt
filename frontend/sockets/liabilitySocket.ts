import { NetSocket, SocketHandler } from './socketHandler';
import {ILiabilityData} from "@shared";
import {useLiabilityStore} from "@/store/liabilityStore";

const liabilitySocket = new NetSocket('liabilitySocket');

if (SocketHandler.addSocket(liabilitySocket)) {
    const liabilityStore = useLiabilityStore();

    liabilitySocket.connect();

    liabilitySocket.on('initializeReductions',(reductions: ILiabilityData[]) => {
        liabilityStore.reductions = reductions;
    });
}
