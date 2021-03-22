import { MafiaRole } from './MafiaRoleUtils';
import { InvalidPhaseName, RoomErrorMessage } from '../errors/MafiaRoomErrors';
import MafiaGeneralUtils from './MafiaGeneralUtils';

export enum MafiaPhaseName {
    NIGHT_PHASE = 'NIGHT',
    MAFIA_PHASE = 'MAFIA',
    DETECTOR_PHASE = 'DETECTOR',
    DOCTOR_PHASE = 'DOCTOR',
    DAY_PHASE = 'DAY',
    DISCUSS_PHASE = 'DISCUSS',
    VOTE_PHASE = 'VOTE',
    DEFENSE_PHASE = 'DEFENSE',
}

export enum MafiaPhaseTime { // time in seconds
    NIGHT_PHASE = 3,
    MAFIA_PHASE = 3,
    DETECTOR_PHASE = 3,
    DOCTOR_PHASE = 3,
    DAY_PHASE = 3,
    DISCUSS_PHASE = 3,
    VOTE_PHASE = 7,
    DEFENSE_PHASE = 7,
}

abstract class MafiaPhaseUtils {
    private static readonly STANDARD_ORDER_PHASES: Array<MafiaPhaseName> = [
        MafiaPhaseName.NIGHT_PHASE, // All sleep
        MafiaPhaseName.MAFIA_PHASE,
        MafiaPhaseName.DETECTOR_PHASE,
        MafiaPhaseName.DOCTOR_PHASE,
        MafiaPhaseName.DAY_PHASE, // All wake up
        MafiaPhaseName.DISCUSS_PHASE,
        MafiaPhaseName.VOTE_PHASE,
        MafiaPhaseName.DEFENSE_PHASE,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_NIGHT_PHASE: Array<MafiaRole> = [
        MafiaRole.MAFIA,
        MafiaRole.DETECTOR,
        MafiaRole.INNOCENT,
        MafiaRole.DOCTOR,
        MafiaRole.DEAD,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_MAFIA_PHASE: Array<MafiaRole> = [
        MafiaRole.MAFIA,
        MafiaRole.DEAD,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_DETECTOR_PHASE: Array<MafiaRole> = [
        MafiaRole.DETECTOR,
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
        MafiaRole.DETECTOR,
        MafiaRole.INNOCENT,
        MafiaRole.DOCTOR,
        MafiaRole.DEAD,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_VOTE_PHASE: Array<MafiaRole> = [
        MafiaRole.MAFIA,
        MafiaRole.DETECTOR,
        MafiaRole.INNOCENT,
        MafiaRole.DOCTOR,
        MafiaRole.DEAD,
    ];

    private static readonly STANDARD_ACTIVE_ROLES_DEFENSE_PHASE: Array<MafiaRole> = [
        MafiaRole.MAFIA,
        MafiaRole.DETECTOR,
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

    public static getActiveRolesDetectorPhase(): Array<MafiaRole> {
        return [...this.STANDARD_ACTIVE_ROLES_DETECTOR_PHASE];
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

    public static getActiveRolesDefensePhase(): Array<MafiaRole> {
        return [...this.STANDARD_ACTIVE_ROLES_DEFENSE_PHASE];
    }

    public static getActiveRolesByPhaseName(phaseName: MafiaPhaseName): Array<MafiaRole> {
        switch (phaseName) {
            case MafiaPhaseName.NIGHT_PHASE:
                return this.getActiveRolesNightPhase();

            case MafiaPhaseName.MAFIA_PHASE:
                return this.getActiveRolesMafiaPhase();

            case MafiaPhaseName.DETECTOR_PHASE:
                return this.getActiveRolesDetectorPhase();

            case MafiaPhaseName.DOCTOR_PHASE:
                return this.getActiveRolesDoctorPhase();

            case MafiaPhaseName.DAY_PHASE:
                return this.getActiveRolesDayPhase();

            case MafiaPhaseName.DISCUSS_PHASE:
                return this.getActiveRolesDiscussPhase();

            case MafiaPhaseName.VOTE_PHASE:
                return this.getActiveRolesVotePhase();

            case MafiaPhaseName.DEFENSE_PHASE:
                return this.getActiveRolesDefensePhase();

            default:
                throw new InvalidPhaseName(RoomErrorMessage.UNKNOWN_PHASE_NAME);
        }
    }

    public static isNeededPhase(phaseName: MafiaPhaseName, rolesCollection: Array<MafiaRole>): boolean {
        const activeRoles = this.getActiveRolesByPhaseName(phaseName);
        activeRoles.splice(activeRoles.indexOf(MafiaRole.DEAD), 1);
        return !this.isDefensePhase(phaseName)
            && (MafiaGeneralUtils.isIntersected(activeRoles, rolesCollection)
                || this.isModeratorPhase(phaseName));
    }

    public static isDefensePhase(phaseName: MafiaPhaseName): boolean {
        return phaseName === MafiaPhaseName.DEFENSE_PHASE;
    }

    public static isModeratorPhase(phaseName: MafiaPhaseName): boolean {
        return phaseName === MafiaPhaseName.DAY_PHASE || phaseName === MafiaPhaseName.NIGHT_PHASE;
    }
}

export default MafiaPhaseUtils;
