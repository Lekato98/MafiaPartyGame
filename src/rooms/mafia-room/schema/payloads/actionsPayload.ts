export interface IDetectPayload {
    detectPlayerId: string;
}

export interface IMessageToDeadAction {
    message: string;
}

export interface IMessageToAllPayload {
    message: string;
}

export interface IDoctorProtectPayload {
    protectPlayerId: string;
}

export interface IKillVotePayload {
    voteKillPlayerId: string;
}

export interface IMessageMafiaPayload {
    message: string;
}

export interface IVoteActionPayload {
    playerId: string;
}
