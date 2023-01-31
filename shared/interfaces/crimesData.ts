export interface ICrimesData {
    _id: string;
    wantedName: string;
    faction: string;
    location: string;
    dateTime: string;
    blackMoney: { person: number; vehicle: number; house: number };
    agentName: string;
    bankNoteCode: boolean;
    camperLocation: string;
    murder: boolean;
    illegalItems: boolean;
    proofs: { proofOne: string; proofTwo: string; proofThree: string };
    finished: boolean;
}
