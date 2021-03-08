import {InvalidNumberOfPlayers, RoomError} from "../Errors/MafiaRoomErrors";
import MafiaSupportUtils from "./MafiaSupportUtils";

export enum MafiaRole {
    MAFIA = 'MAFIA',
    DETECTIVE = 'DETECTIVE',
    DOCTOR = 'DOCTOR',
    INNOCENT = 'INNOCENT',
    DEAD = 'DEAD',
    MODERATOR = 'MODERATOR'
}

export enum MafiaGame {
    MIN_NUMBER_OF_PLAYERS = 4,
    MAX_NUMBER_OF_PLAYERS = 16,
    STANDARD_NUMBER_OF_DOCTORS = 1,
    STANDARD_DIFFERENCE_BETWEEN_MAFIA_AND_DETECTIVES = 1,
    STANDARD_PERCENTAGE_FOR_MAFIA = 0.25,
}

interface NumberOfEachRole {
    numberOfMafia: number;
    numberOfDetectives: number;
    numberOfDoctors: number;
    numberOfInnocents: number;
}

abstract class MafiaRoleUtils {
    public static readonly STANDARD_ROLES: Array<MafiaRole> = [
        MafiaRole.MAFIA,
        MafiaRole.DETECTIVE,
        MafiaRole.DOCTOR,
        MafiaRole.INNOCENT,
        MafiaRole.MODERATOR,
        MafiaRole.DEAD,
    ];

    public static isValidNumberOfPlayers(numberOfPlayers: number): boolean {
        return numberOfPlayers >= MafiaGame.MIN_NUMBER_OF_PLAYERS
            && numberOfPlayers <= MafiaGame.MAX_NUMBER_OF_PLAYERS;
    }

    public static createStandardGameRolesCollection(numberOfPlayers: number): Array<MafiaRole> {
        if (this.isValidNumberOfPlayers(numberOfPlayers)) {
            const numberOfMafia = this.getNumberOfMafia(numberOfPlayers);
            const numberOfDetectives = this.getNumberOfDetectives(numberOfPlayers);
            const numberOfDoctors = this.getNumberOfDoctors(numberOfPlayers);
            const numberOfInnocents = this.getNumberOfInnocents(numberOfPlayers);
            const numberOfEachRole: NumberOfEachRole = {
                numberOfMafia,
                numberOfDetectives,
                numberOfDoctors,
                numberOfInnocents
            }

            return this.getGameRolesCollection(numberOfEachRole);
        } else {
            throw new InvalidNumberOfPlayers(RoomError.INVALID_NUMBER_OF_PLAYERS);
        }
    }

    public static createShuffledGameRolesCollection(numberOfPlayers: number): Array<MafiaRole> {
        const shuffledGameRolesCollection = this.createStandardGameRolesCollection(numberOfPlayers);
        MafiaSupportUtils.shuffleCollections(shuffledGameRolesCollection);
        return shuffledGameRolesCollection;
    }

    public static getUniqueGameRolesCollection(): Array<MafiaRole> {
        return [...this.STANDARD_ROLES];
    }

    public static getGameRolesCollection(numberOfEachRole: NumberOfEachRole): Array<MafiaRole> {
        const mafiaCollection = this.getCollectionOfMafiaRole(numberOfEachRole.numberOfMafia);
        const detectivesCollection = this.getCollectionOfDetectiveRole(numberOfEachRole.numberOfDetectives);
        const doctorCollection = this.getCollectionOfDoctorRole(numberOfEachRole.numberOfDoctors);
        const innocentsCollection = this.getCollectionOfInnocentRole(numberOfEachRole.numberOfInnocents);

        return [...mafiaCollection, ...detectivesCollection, ...doctorCollection, ...innocentsCollection];
    }

    public static getNumberOfMafia(numberOfPlayers: number): number {
        if (this.isValidNumberOfPlayers(numberOfPlayers)) {
            return Math.floor(numberOfPlayers * MafiaGame.STANDARD_PERCENTAGE_FOR_MAFIA);
        } else {
            throw new InvalidNumberOfPlayers(RoomError.INVALID_NUMBER_OF_PLAYERS);
        }
    }

    public static getNumberOfDetectives(numberOfPlayers: number): number {
        if (this.isValidNumberOfPlayers(numberOfPlayers)) {
            const numberOfMafia = this.getNumberOfMafia(numberOfPlayers);
            return numberOfMafia - MafiaGame.STANDARD_DIFFERENCE_BETWEEN_MAFIA_AND_DETECTIVES;
        } else {
            throw new InvalidNumberOfPlayers(RoomError.INVALID_NUMBER_OF_PLAYERS);
        }
    }

    public static getNumberOfDoctors(numberOfPlayers: number): number {
        if (this.isValidNumberOfPlayers(numberOfPlayers)) {
            return Number(MafiaGame.STANDARD_NUMBER_OF_DOCTORS);
        } else {
            throw new InvalidNumberOfPlayers(RoomError.INVALID_NUMBER_OF_PLAYERS);
        }
    }

    public static getNumberOfInnocents(numberOfPlayers: number): number {
        if (this.isValidNumberOfPlayers(numberOfPlayers)) {
            const numberOfMafia = this.getNumberOfMafia(numberOfPlayers);
            const numberOfDetectives = this.getNumberOfDetectives(numberOfPlayers);
            const numberOfDoctors = this.getNumberOfDoctors(numberOfPlayers);
            return numberOfPlayers - numberOfMafia - numberOfDetectives - numberOfDoctors;
        } else {
            throw new InvalidNumberOfPlayers(RoomError.INVALID_NUMBER_OF_PLAYERS);
        }
    }

    public static getCollectionOfMafiaRole(numberOfMafia: number): Array<MafiaRole> {
        return this.getCollectionOfSpecificRole(numberOfMafia, MafiaRole.MAFIA);
    }

    public static getCollectionOfDetectiveRole(numberOfDetectives: number): Array<MafiaRole> {
        return this.getCollectionOfSpecificRole(numberOfDetectives, MafiaRole.DETECTIVE);
    }

    public static getCollectionOfDoctorRole(numberOfDoctors: number): Array<MafiaRole> {
        return this.getCollectionOfSpecificRole(numberOfDoctors, MafiaRole.DOCTOR);
    }

    public static getCollectionOfInnocentRole(numberOfInnocents: number): Array<MafiaRole> {
        return this.getCollectionOfSpecificRole(numberOfInnocents, MafiaRole.INNOCENT);
    }

    public static getCollectionOfSpecificRole(numberOf: number, role: MafiaRole): Array<MafiaRole> {
        if (numberOf < 0) {
            throw new Error("Invalid Number");
        }

        return new Array(numberOf).fill(role);
    }
}

export default MafiaRoleUtils;