import { ArraySchema, MapSchema } from '@colyseus/schema';

abstract class ColyseusUtils {
    public static convertArrayToArraySchema(collection: Array<any>): ArraySchema {
        const arraySchema = new ArraySchema();
        collection.map(item => arraySchema.push(item));
        return arraySchema;
    }

    public static getMaxOccurrenceInMapSchema(map: MapSchema): string {
        let maxOccurrence = 0, maxKey = '';
        if (map.size) {
            const keys = [...map.keys()];
            keys.forEach(key => {
                const occurrence = map.get(key);
                if (occurrence > maxOccurrence) {
                    maxOccurrence = occurrence;
                    maxKey = key;
                }
            });
        }

        return maxKey;
    }
}

export default ColyseusUtils;
