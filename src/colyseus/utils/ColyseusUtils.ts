import { ArraySchema, MapSchema } from '@colyseus/schema';

class MaxOccurrence {
    public key: string = '';
    public occurrence: number = 0; // number of occurrence time for the key
    public maxFreq: number = 0; // number of occurrence that have the same max occurrence

    public update(key: string, occurrence: number): void {
        if (occurrence > this.occurrence) {
            this.setAll(key, occurrence, 1);
        } else if (occurrence === this.occurrence) {
            this.maxFreq++;
        }
    }

    public setAll(key: string, occurrence: number, maxFreq: number): void {
        this.key = key;
        this.occurrence = occurrence;
        this.maxFreq = maxFreq;
    }
}

abstract class ColyseusUtils {
    public static convertArrayToArraySchema(collection: Array<any>): ArraySchema {
        const arraySchema = new ArraySchema();
        collection.map(item => arraySchema.push(item));
        return arraySchema;
    }

    public static getMaxOccurrenceInMapSchema<Type>(map: MapSchema): MaxOccurrence {
        const maxOccurrence = new MaxOccurrence();
        if (map.size) {
            const keys = [...map.keys()];
            keys.forEach(key => {
                const occurrence = map.get(key);
                maxOccurrence.update(key, occurrence);
            });
        }

        return maxOccurrence;
    }
}

export default ColyseusUtils;
