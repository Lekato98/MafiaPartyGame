import {MafiaRole} from "./MafiaRoleUtils";
import {InvalidPhaseName, RoomError} from "../errors/MafiaRoomErrors";
import MafiaSupportUtils from "./MafiaSupportUtils";

export enum MafiaPhaseName {
    NIGHT_PHASE = 'NIGHT',
    MAFIA_PHASE = 'MAFIA',
    DETECTIVE_PHASE = 'DETECTIVE',
    DOCTOR_PHASE = 'DOCTOR',
    DAY_PHASE = 'DAY',
    DISCUSS_PHASE = 'DISCUSS',
    VOTE_PHASE = 'VOTE',
}

export enum MafiaPhaseTime { // time in seconds
    NIGHT_PHASE_TIME = 3,
    MAFIA_PHASE_TIME = 6,
    DETECTIVE_PHASE_TIME = 15,
    DOCTOR_PHASE_TIME = 6,
    DAY_PHASE_TIME = 3,
    DISCUSS_PHASE_TIME = 6,
    VOTE_PHASE_TIME = 6,
}

abstract class MafiaPhaseUtils {
    private static readonly STANDARD_ORDER_PHASES: Array<MafiaPhaseName> = [
        MafiaPhaseName.NIGHT_PHASE, // All sleep
        MafiaPhaseName.MAFIA_PHASE,
        MafiaPhaseName.DETECTIVE_PHASE,
        MafiaPhaseName.DOCTOR_PHASE,
        MafiaPhaseName.DAY_PHASE, // All wake up
        MafiaPhaseName.DISCUSS_PHASE,
        MafiaPhaseName.VOTE_PHASE,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_NIGHT_PHASE: Array<MafiaRole> = [
        MafiaRole.MAFIA,
        MafiaRole.DETECTIVE,
        MafiaRole.INNOCENT,
        MafiaRole.DOCTOR,
        MafiaRole.DEAD,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_MAFIA_PHASE: Array<MafiaRole> = [
        MafiaRole.MAFIA,
        MafiaRole.DEAD,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_DETECTIVE_PHASE: Array<MafiaRole> = [
        MafiaRole.DETECTIVE,
        MafiaRole.DEAD,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_DOCTOR_PHASE: Array<MafiaRole> = [
        MafiaRole.DOCTOR,
        MafiaRole.DEAD,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_DAY_PHASE: Array<MafiaRole> = [
        MafiaRole.MODERATOR,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_DISCUSS_PHASE: Array<MafiaRole> = [
        MafiaRole.MAFIA,
        MafiaRole.DETECTIVE,
        MafiaRole.INNOCENT,
        MafiaRole.DOCTOR,
        MafiaRole.DEAD,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_VOTE_PHASE: Array<MafiaRole> = [
        MafiaRole.MAFIA,
        MafiaRole.DETECTIVE,
        MafiaRole.INNOCENT,
        MafiaRole.DOCTOR,
        MafiaRole.DEAD,
    ];

    public static getStandardOrderPhases(): Array<MafiaPhaseName> {
        return [...this.STANDARD_ORDER_PHASES];
    }

    public static getNextPhase(currentPhase: MafiaPhaseName): MafiaPhaseName {
        const currentPhaseIndex = this.STANDARD_ORDER_PHASES.indexOf(currentPhase);
        const standardOrderPhaseLength = this.STANDARD_ORDER_PHASES.length;
        // next element for the last item is 0
        const nextPhaseIndex = (currentPhaseIndex + 1) % standardOrderPhaseLength;
        return this.STANDARD_ORDER_PHASES[nextPhaseIndex];
    }

    public static getActiveRolesNightPhase(): Array<MafiaRole> {
        return [...this.STANDARD_ACTIVE_ROLES_NIGHT_PHASE];
    }

    public static getActiveRolesMafiaPhase(): Array<MafiaRole> {
        return [...this.STANDARD_ACTIVE_ROLES_MAFIA_PHASE];
    }

    public static getActiveRolesDetectivePhase(): Array<MafiaRole> {
        return [...this.STANDARD_ACTIVE_ROLES_DETECTIVE_PHASE];
    }

    public static getActiveRolesDoctorPhase(): Array<MafiaRole> {
        return [...this.STANDARD_ACTIVE_ROLES_DOCTOR_PHASE];
    }

    public static getActiveRolesDayPhase(): Array<MafiaRole> {
        return [...this.STANDARD_ACTIVE_ROLES_DAY_PHASE];
    }

    public static getActiveRolesDiscussPhase(): Array<MafiaRole> {
        return [...this.STANDARD_ACTIVE_ROLES_DISCUSS_PHASE];
    }

    public static getActiveRolesVotePhase(): Array<MafiaRole> {
        return [...this.STANDARD_ACTIVE_ROLES_VOTE_PHASE];
    }

    public static getActiveRolesByPhaseName(phaseName: MafiaPhaseName): Array<MafiaRole> {
        switch (phaseName) {
            case MafiaPhaseName.NIGHT_PHASE:
                return this.getActiveRolesNightPhase();

            case MafiaPhaseName.MAFIA_PHASE:
                return this.getActiveRolesMafiaPhase();

            case MafiaPhaseName.DETECTIVE_PHASE:
                return this.getActiveRolesDetectivePhase();

            case MafiaPhaseName.DOCTOR_PHASE:
                return this.getActiveRolesDoctorPhase();

            case MafiaPhaseName.DAY_PHASE:
                return this.getActiveRolesDayPhase();

            case MafiaPhaseName.DISCUSS_PHASE:
                return this.getActiveRolesDiscussPhase();

            case MafiaPhaseName.VOTE_PHASE:
                return this.getActiveRolesVotePhase();

            default:
                throw new InvalidPhaseName(RoomError.UNKNOWN_PHASE_NAME);
        }
    }

    public static isNeededPhase(phaseName: MafiaPhaseName, rolesCollection: Array<any>): boolean {
        const activeRoles = this.getActiveRolesByPhaseName(phaseName);
        return MafiaSupportUtils.isIntersected(activeRoles, rolesCollection) || this.isModeratorPhase(phaseName);
    }

    public static isModeratorPhase(phaseName: MafiaPhaseName): boolean {
        return phaseName === MafiaPhaseName.DAY_PHASE || phaseName === MafiaPhaseName.NIGHT_PHASE;
    }
}

export default MafiaPhaseUtils;