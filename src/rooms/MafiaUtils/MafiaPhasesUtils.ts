import {MafiaRolesEnum} from "./MafiaRolesUtils";
import {InvalidPhaseName, MafiaErrorsEnum} from "../Errors/MafiaRoomErrors";
import MafiaSupportUtils from "./MafiaSupportUtils";

export enum MafiaPhasesNameEnum {
    NIGHT_PHASE = 'NIGHT',
    MAFIA_PHASE = 'MAFIA',
    DETECTIVE_PHASE = 'DETECTIVE',
    DOCTOR_PHASE = 'DOCTOR',
    DAY_PHASE = 'DAY',
    DISCUSS_PHASE = 'DISCUSS',
    VOTE_PHASE = 'VOTE',
}

export enum MafiaPhasesTimeEnum { // time in seconds
    NIGHT_PHASE_TIME = 3,
    MAFIA_PHASE_TIME = 6,
    DETECTIVE_PHASE_TIME = 6,
    DOCTOR_PHASE_TIME = 6,
    DAY_PHASE_TIME = 3,
    DISCUSS_PHASE_TIME = 6,
    VOTE_PHASE_TIME = 6,
}

abstract class MafiaPhasesUtils {
    private static readonly STANDARD_ORDER_PHASES: Array<MafiaPhasesNameEnum> = [
        MafiaPhasesNameEnum.NIGHT_PHASE, // All sleep
        MafiaPhasesNameEnum.MAFIA_PHASE,
        MafiaPhasesNameEnum.DETECTIVE_PHASE,
        MafiaPhasesNameEnum.DOCTOR_PHASE,
        MafiaPhasesNameEnum.DAY_PHASE, // All wake up
        MafiaPhasesNameEnum.DISCUSS_PHASE,
        MafiaPhasesNameEnum.VOTE_PHASE,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_NIGHT_PHASE: Array<MafiaRolesEnum> = [
        MafiaRolesEnum.MAFIA,
        MafiaRolesEnum.DETECTIVE,
        MafiaRolesEnum.INNOCENT,
        MafiaRolesEnum.DOCTOR,
        MafiaRolesEnum.DEADS,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_MAFIA_PHASE: Array<MafiaRolesEnum> = [
        MafiaRolesEnum.MAFIA,
        MafiaRolesEnum.DEADS,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_DETECTIVE_PHASE: Array<MafiaRolesEnum> = [
        MafiaRolesEnum.DETECTIVE,
        MafiaRolesEnum.DEADS,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_DOCTOR_PHASE: Array<MafiaRolesEnum> = [
        MafiaRolesEnum.DOCTOR,
        MafiaRolesEnum.DEADS,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_DAY_PHASE: Array<MafiaRolesEnum> = [
        MafiaRolesEnum.MODERATOR,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_DISCUSS_PHASE: Array<MafiaRolesEnum> = [
        MafiaRolesEnum.MAFIA,
        MafiaRolesEnum.DETECTIVE,
        MafiaRolesEnum.INNOCENT,
        MafiaRolesEnum.DOCTOR,
        MafiaRolesEnum.DEADS,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_VOTE_PHASE: Array<MafiaRolesEnum> = [
        MafiaRolesEnum.MAFIA,
        MafiaRolesEnum.DETECTIVE,
        MafiaRolesEnum.INNOCENT,
        MafiaRolesEnum.DOCTOR,
        MafiaRolesEnum.DEADS,
    ];

    public static getStandardOrderPhases(): Array<MafiaPhasesNameEnum> {
        return [...this.STANDARD_ORDER_PHASES];
    }

    public static getNextPhase(currentPhase: MafiaPhasesNameEnum): MafiaPhasesNameEnum {
        const currentPhaseIndex = this.STANDARD_ORDER_PHASES.indexOf(currentPhase);
        const standardOrderPhaseLength = this.STANDARD_ORDER_PHASES.length;
        // next element for the last item is 0
        const nextPhaseIndex = (currentPhaseIndex + 1) % standardOrderPhaseLength;
        return this.STANDARD_ORDER_PHASES[nextPhaseIndex];
    }

    public static getActiveRolesNightPhase(): Array<MafiaRolesEnum> {
        return [...this.STANDARD_ACTIVE_ROLES_NIGHT_PHASE];
    }

    public static getActiveRolesMafiaPhase(): Array<MafiaRolesEnum> {
        return [...this.STANDARD_ACTIVE_ROLES_MAFIA_PHASE];
    }

    public static getActiveRolesDetectivePhase(): Array<MafiaRolesEnum> {
        return [...this.STANDARD_ACTIVE_ROLES_DETECTIVE_PHASE];
    }

    public static getActiveRolesDoctorPhase(): Array<MafiaRolesEnum> {
        return [...this.STANDARD_ACTIVE_ROLES_DOCTOR_PHASE];
    }

    public static getActiveRolesDayPhase(): Array<MafiaRolesEnum> {
        return [...this.STANDARD_ACTIVE_ROLES_DAY_PHASE];
    }

    public static getActiveRolesDiscussPhase(): Array<MafiaRolesEnum> {
        return [...this.STANDARD_ACTIVE_ROLES_DISCUSS_PHASE];
    }

    public static getActiveRolesVotePhase(): Array<MafiaRolesEnum> {
        return [...this.STANDARD_ACTIVE_ROLES_VOTE_PHASE];
    }

    public static getActiveRolesByPhaseName(phaseName: MafiaPhasesNameEnum): Array<MafiaRolesEnum> {
        switch (phaseName) {
            case MafiaPhasesNameEnum.NIGHT_PHASE:
                return this.getActiveRolesNightPhase();

            case MafiaPhasesNameEnum.MAFIA_PHASE:
                return this.getActiveRolesMafiaPhase();

            case MafiaPhasesNameEnum.DETECTIVE_PHASE:
                return this.getActiveRolesDetectivePhase();

            case MafiaPhasesNameEnum.DOCTOR_PHASE:
                return this.getActiveRolesDoctorPhase();

            case MafiaPhasesNameEnum.DAY_PHASE:
                return this.getActiveRolesDayPhase();

            case MafiaPhasesNameEnum.DISCUSS_PHASE:
                return this.getActiveRolesDiscussPhase();

            case MafiaPhasesNameEnum.VOTE_PHASE:
                return this.getActiveRolesVotePhase();

            default:
                throw new InvalidPhaseName(MafiaErrorsEnum.UNKNOWN_PHASE_NAME);
        }
    }

    public static isNeededPhase(phaseName: MafiaPhasesNameEnum, rolesCollection: Array<any>): boolean {
        const activeRoles = this.getActiveRolesByPhaseName(phaseName);
        return MafiaSupportUtils.isIntersected(activeRoles, rolesCollection) || this.isModeratorPhase(phaseName);
    }

    public static isModeratorPhase(phaseName: MafiaPhasesNameEnum): boolean {
        return phaseName === MafiaPhasesNameEnum.DAY_PHASE || phaseName === MafiaPhasesNameEnum.NIGHT_PHASE;
    }
}

export default MafiaPhasesUtils;