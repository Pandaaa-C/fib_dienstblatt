import { NetSocket, SocketHandler } from './socketHandler';
import { useCrimesStore } from '@/store/crimeStore';
import { ICrimesData, IDocFileData } from '@/../shared/interfaces';
import { useDocStore } from '@/store/docStore';

const docSocket = new NetSocket('docSocket');

if (SocketHandler.addSocket(docSocket)) {
    const docStore = useDocStore();

    docSocket.connect();

    docSocket.on("initializeDocFiles", (docFiles: IDocFileData[]) => {
        docStore.initializeRecords(docFiles);
    });
}
