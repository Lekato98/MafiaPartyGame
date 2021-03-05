import {InvalidNumberOfPlayersError, MafiaRoomErrorsEnum} from "../Errors/MafiaRoomErrors";
import MafiaSupportUtils from "./MafiaSupportUtils";

export enum MafiaRolesEnum {
    MAFIA = 'MAFIA',
    DETECTIVE = 'DETECTIVE',
    DOCTOR = 'DOCTOR',
    INNOCENT = 'INNOCENT',
    DEADS = 'DEADS',
    MODERATOR = 'MODERATOR'
}

export enum MafiaGameEnum {
    MIN_NUMBER_OF_PLAYERS = 4,
    MAX_NUMBER_OF_PLAYERS = 16,
    STANDARD_NUMBER_OF_DOCTORS = 1,
    STANDARD_DIFFERENCE_BETWEEN_MAFIA_AND_DETECTIVES = 1,
    STANDARD_PERCENTAGE_FOR_MAFIA = 0.25,
    STANDARD_MIN_NUMBER_FOR_EACH_ROLE = 0
}

interface NumberOfEachRole {
    numberOfMafia: number;
    numberOfDetectives: number;
    numberOfDoctors: number;
    numberOfInnocents: number;
}

// @TODO Change class name to MafiaRoleUtils
abstract class MafiaRolesUtils {
    public static isValidNumberOfPlayers(numberOfPlayers: number): boolean {
        return numberOfPlayers >= MafiaGameEnum.MIN_NUMBER_OF_PLAYERS
            && numberOfPlayers <= MafiaGameEnum.MAX_NUMBER_OF_PLAYERS;
    }

    public static createStandardGameRolesCollection(numberOfPlayers: number): Array<MafiaRolesEnum> {
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
            throw new InvalidNumberOfPlayersError(MafiaRoomErrorsEnum.INVALID_NUMBER_OF_PLAYERS);
        }
    }

    public static createShuffledGameRolesCollection(numberOfPlayers: number): Array<MafiaRolesEnum> {
        const shuffledGameRolesCollection = this.createStandardGameRolesCollection(numberOfPlayers);
        MafiaSupportUtils.shuffleCollections(shuffledGameRolesCollection);
        return shuffledGameRolesCollection;
    }

    public static getUniqueGameRolesCollection(): Array<MafiaRolesEnum> {
        return [MafiaRolesEnum.MAFIA, MafiaRolesEnum.DETECTIVE, MafiaRolesEnum.DOCTOR, MafiaRolesEnum.INNOCENT];
    }

    public static getGameRolesCollection(numberOfEachRole: NumberOfEachRole): Array<MafiaRolesEnum> {
        const mafiaCollection = this.getCollectionOfMafiaRole(numberOfEachRole.numberOfMafia);
        const detectivesCollection = this.getCollectionOfDetectiveRole(numberOfEachRole.numberOfDetectives);
        const doctorCollection = this.getCollectionOfDoctorRole(numberOfEachRole.numberOfDoctors);
        const innocentsCollection = this.getCollectionOfInnocentRole(numberOfEachRole.numberOfInnocents);

        return [...mafiaCollection, ...detectivesCollection, ...doctorCollection, ...innocentsCollection];
    }

    public static getNumberOfMafia(numberOfPlayers: number): number {
        const numberOfMafia = Math.floor(numberOfPlayers * MafiaGameEnum.STANDARD_PERCENTAGE_FOR_MAFIA);
        return Math.max(numberOfMafia, MafiaGameEnum.STANDARD_MIN_NUMBER_FOR_EACH_ROLE);
    }

    public static getNumberOfDetectives(numberOfPlayers: number): number {
        const numberOfMafia = this.getNumberOfMafia(numberOfPlayers);
        const numberOfDetectives = numberOfMafia - MafiaGameEnum.STANDARD_DIFFERENCE_BETWEEN_MAFIA_AND_DETECTIVES;
        return Math.max(numberOfDetectives, MafiaGameEnum.STANDARD_MIN_NUMBER_FOR_EACH_ROLE);
    }

    public static getNumberOfDoctors(numberOfPlayers: number): number {
        const numberOfDoctors = Math.min(MafiaGameEnum.STANDARD_NUMBER_OF_DOCTORS, numberOfPlayers);
        return Math.max(numberOfDoctors, MafiaGameEnum.STANDARD_MIN_NUMBER_FOR_EACH_ROLE);
    }

    public static getNumberOfInnocents(numberOfPlayers: number): number {
        const numberOfMafia = this.getNumberOfMafia(numberOfPlayers);
        const numberOfDetectives = this.getNumberOfDetectives(numberOfPlayers);
        const numberOfDoctors = this.getNumberOfDoctors(numberOfPlayers);
        return numberOfPlayers - numberOfMafia - numberOfDetectives - numberOfDoctors;
    }

    public static getCollectionOfMafiaRole(numberOfMafia: number): Array<MafiaRolesEnum> {
        return this.getCollectionOfSpecificRole(numberOfMafia, MafiaRolesEnum.MAFIA);
    }

    public static getCollectionOfDetectiveRole(numberOfDetectives: number): Array<MafiaRolesEnum> {
        return this.getCollectionOfSpecificRole(numberOfDetectives, MafiaRolesEnum.DETECTIVE);
    }

    public static getCollectionOfDoctorRole(numberOfDoctors: number): Array<MafiaRolesEnum> {
        return this.getCollectionOfSpecificRole(numberOfDoctors, MafiaRolesEnum.DOCTOR);
    }

    public static getCollectionOfInnocentRole(numberOfInnocents: number): Array<MafiaRolesEnum> {
        return this.getCollectionOfSpecificRole(numberOfInnocents, MafiaRolesEnum.INNOCENT);
    }

    public static getCollectionOfSpecificRole(numberOf: number, role: MafiaRolesEnum): Array<MafiaRolesEnum> {
        numberOf = Math.max(numberOf, MafiaGameEnum.STANDARD_MIN_NUMBER_FOR_EACH_ROLE);
        const collection = [];
        while (numberOf--) {
            collection.push(role);
        }

        return collection;
    }
}

export default MafiaRolesUtils;