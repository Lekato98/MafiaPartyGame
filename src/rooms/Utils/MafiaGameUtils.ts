import {
    InvalidNumberOfPlayersError,
    MafiaRoomErrorsEnum
} from "../Errors/MafiaRoomErrors";

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
}

abstract class MafiaGameUtils {
    public static isValidNumberOfPlayers(numberOfPlayers: number) {
        return numberOfPlayers >= MafiaGameEnum.MIN_NUMBER_OF_PLAYERS
            && numberOfPlayers <= MafiaGameEnum.MAX_NUMBER_OF_PLAYERS;
    }

    public static createGameRolesCollection(numberOfPlayers: number, shuffle: boolean = false): Array<MafiaRolesEnum> {
        if (this.isValidNumberOfPlayers(numberOfPlayers)) {
            const numberOfMafia = this.getNumberOfMafia(numberOfPlayers);
            const numberOfDetectives = this.getNumberOfDetectives(numberOfPlayers);
            const numberOfDoctors = this.getNumberOfDoctors(numberOfPlayers);
            const numberOfInnocents = this.getNumberOfInnocents(numberOfPlayers);

            const gameRolesCollection = this.getGameRolesCollection(numberOfMafia, numberOfDetectives, numberOfDoctors, numberOfInnocents);

            if (shuffle) {
                this.shuffleCollections(gameRolesCollection);
            }

            return gameRolesCollection;
        } else {
            throw new InvalidNumberOfPlayersError(MafiaRoomErrorsEnum.INVALID_NUMBER_OF_PLAYERS);
        }
    }

    public static getUniqueGameRolesCollection() {
        return [MafiaRolesEnum.MAFIA, MafiaRolesEnum.DETECTIVE, MafiaRolesEnum.DOCTOR, MafiaRolesEnum.INNOCENT];
    }

    public static getGameRolesCollection(numberOfMafia: number, numberOfDetectives: number, numberOfDoctors: number, numberOfInnocents: number): Array<MafiaRolesEnum> {
        const mafiaCollection = this.getCollectionOfMafiaRole(numberOfMafia);
        const detectivesCollection = this.getCollectionOfDetectiveRole(numberOfDetectives);
        const doctorCollection = this.getCollectionOfDoctorRole(numberOfDoctors);
        const innocentsCollection = this.getCollectionOfInnocentRole(numberOfInnocents);

        return [...mafiaCollection, ...detectivesCollection, ...doctorCollection, ...innocentsCollection];
    }

    public static getNumberOfMafia(numberOfPlayers: number): number {
        return Math.max(Math.floor(numberOfPlayers / 4), 0);
    }

    public static getNumberOfDetectives(numberOfPlayers: number): number {
        const numberOfMafia = this.getNumberOfMafia(numberOfPlayers);
        return Math.max(numberOfMafia - 1, 0);
    }

    public static getNumberOfDoctors(numberOfPlayers: number): number {
        return Math.max(Math.min(1, numberOfPlayers), 0);
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
        numberOf = Math.max(numberOf, 0);
        const collection = [];
        while (numberOf--) {
            collection.push(role);
        }

        return collection;
    }

    // Fisher-Yates (aka Knuth) Shuffle Algorithm
    public static shuffleCollections(collection: Array<any>): void {
        let currentIndex: number = collection.length;
        let temporaryValue: any;
        let randomIndex: number;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = collection[currentIndex];
            collection[currentIndex] = collection[randomIndex];
            collection[randomIndex] = temporaryValue;
        }
    }
}

export default MafiaGameUtils;