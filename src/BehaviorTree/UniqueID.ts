/**
 * Represents a class that generates unique IDs.
 */
export class UniqueID {
    /**
     * The current ID.
     * Starts at 1 because 0 is falsy.
     */
    private static id = 1;

    /**
     * Gets a globally unique ID.
     * @returns A unique ID.
     */
    static getUniqueID(): string {
        return `${UniqueID.id++}`;
    }
}
