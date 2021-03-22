export interface IMessageToDeadAction {
    message: string;
}

export interface IMessageToAllPayload {
    message: string;
}

export interface IMessageToMafiaPayload {
    message: string;
}

export interface IDoctorProtectPayload {
    protectPlayerId: string;
}

export interface IDetectPayload {
    detectPlayerId: string;
}

export interface IKillVotePayload {
    voteKillPlayerId: string;
}

export interface IVoteActionPayload {
    playerId: string;
}

export interface IGuiltyActionPayload {

}

export interface IInnocentActionPayload {

}
