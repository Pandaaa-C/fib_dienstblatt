import { io, Socket, SocketOptions, ManagerOptions } from 'socket.io-client';
import { apiUrl } from '../config';

export class NetSocket {
    private connected: boolean = false;
    private socket?: Socket;
    public readonly socketNamespace: string;
    private socketOptions: Partial<SocketOptions & ManagerOptions>;

    constructor(socketNamespace: string, socketOptions: Partial<SocketOptions & ManagerOptions> = {}) {
        this.socketNamespace = socketNamespace;
        this.socketOptions = socketOptions;
    }

    public connect(): void {
        this.connected = true;
        this.socket = io(apiUrl + '/' + this.socketNamespace, {
            withCredentials: true,
            transports: ['websocket'],
            ...this.socketOptions,
        });

        this.on('disconnect', () => {
            this.connected = false;
        });
    }

    public disconnect(): void {
        this.connected = false;
        this.socket?.disconnect();
    }

    public emit(event: string, data: any): void {
        this.socket?.emit(event, data);
    }

    public on(event: string, callback: (data: any) => void): void {
        this.socket?.on(event, callback);
    }

    public get isConnected(): boolean {
        return this.connected;
    }
}

export class SocketHandler {
    private static sockets: NetSocket[] = [];

    public static addSocket(socket: NetSocket): boolean {
        const foundSocket = this.sockets.find(seachedSocket => seachedSocket.socketNamespace === socket.socketNamespace);

        if (foundSocket) return false;

        this.sockets.push(socket);

        return true;
    }

    public static connectAll(): void {
        this.sockets.forEach(socket => socket.connect());
    }

    public static disconnectAll(): void {
        this.sockets.forEach(socket => socket.disconnect());
    }

    public static findSocket(socketNamespace: string): NetSocket | undefined {
        return this.sockets.find(socket => socketNamespace === socketNamespace);
    }

    public static emit(socketNamespace: string, event: string, data: any): void {
        const socket = this.findSocket(socketNamespace);

        if (socket) {
            socket.emit(event, data);
        }
    }

    public static on(socketNamespace: string, event: string, callback: (data: any) => void): void {
        const socket = this.findSocket(socketNamespace);

        if (socket) {
            socket.on(event, callback);
        }
    }
}
