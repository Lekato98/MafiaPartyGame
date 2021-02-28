export enum MafiaRolesEnum {
    MAFIA,
    DETECTIVE,
    DOCTOR,
    INNOCENT
}

export enum MafiaGameEnum {
    MIN_NUMBER_OF_PLAYERS = 4,
    MAX_NUMBER_OF_PLAYERS = 16,
}

class MafiaGameUtils {
    public static isValidNumberOfPlayers(numberOfPlayers: number) {
        return numberOfPlayers >= MafiaGameEnum.MIN_NUMBER_OF_PLAYERS
            && numberOfPlayers <= MafiaGameEnum.MAX_NUMBER_OF_PLAYERS;
    }

    public static createGameRolesCollection(numberOfPlayers: number): Array<MafiaRolesEnum> {
        if (this.isValidNumberOfPlayers(numberOfPlayers)) {
            const numberOfMafia = this.getNumberOfMafia(numberOfPlayers);
            const numberOfDetectives = this.getNumberOfDetectives(numberOfPlayers);
            const numberOfDoctors = this.getNumberOfDoctors(numberOfPlayers);
            const numberOfInnocents = this.getNumberOfInnocents(numberOfPlayers);

            return this.getGameRolesCollection(numberOfMafia, numberOfDetectives, numberOfDoctors, numberOfInnocents);
        } else {
            throw new InvalidNumberOfPlayersError(MafiaRoomErrorsEnum.INVALID_NUMBER_OF_PLAYERS);
        }
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
}

export default MafiaGameUtils;