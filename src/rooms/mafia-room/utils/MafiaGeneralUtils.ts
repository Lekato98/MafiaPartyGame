abstract class MafiaGeneralUtils {
    public static isIntersected(collectionA: Array<any>, collectionB: Array<any>): boolean {
        const intersection = collectionA.filter(item => collectionB.includes(item));
        return intersection.length !== 0;
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

export default MafiaGeneralUtils;
