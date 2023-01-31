import { useGeneralStore } from '@/store/generalStore';
import { NetSocket, SocketHandler } from './socketHandler';

const infoSocket = new NetSocket('infoSocket');

if (SocketHandler.addSocket(infoSocket)) {
    const generalStore = useGeneralStore();

    infoSocket.connect();

    infoSocket.on(
        'initializeInfo',
        (data: { globalInfo: string; defcon: number; leitstelle: string; funk: number; maxEinsatz: number; swat: string }) => {
            generalStore.generalInfo = {
                defcon: data.defcon,
                funk: data.funk,
                leitstelle: data.leitstelle,
                globalInfo: data.globalInfo,
                maxEinsatz: data.maxEinsatz,
                swat: data.swat,
                currentOperationOfficer: 0,
            };
        },
    );

    infoSocket.on('updateLeitstelle', (data: string) => {
        generalStore.generalInfo.leitstelle = data;
    });

    infoSocket.on('updateDefcon', (defconNumber: number) => {
        generalStore.generalInfo.defcon = defconNumber;
    });

    infoSocket.on('updateFunkCode', (funkCode: number) => {
        generalStore.generalInfo.funk = funkCode;
    });

    infoSocket.on('updateInfo', (info: string) => {
        generalStore.generalInfo.globalInfo = info;
    });

    infoSocket.on('updateOperationCount', (data: { lspd: number; swat: number, swatStatus: string }) => {
        let count = data.lspd + data.swat;

        generalStore.generalInfo.currentOperationOfficer = count;
        generalStore.generalInfo.swat = data.swatStatus;
    });
}
