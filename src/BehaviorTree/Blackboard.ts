import { PingCompensatedCharacter } from "alclient";
import { UniqueID } from "./UniqueID";

export type BlackboardMarkedKey = `key:${string}`;

/**
 * Represents a behavior tree blackboard.
 * The blackboard stores data that can be accessed by behavior tree nodes during execution.
 */
export class Blackboard {
    /**
     * The unique identifier of the blackboard.
     */
    id: string;

    /**
     * The character associated with the blackboard.
     */
    character: PingCompensatedCharacter;

    /**
     * An array containing the other connected characters.
     */
    contexts: Array<PingCompensatedCharacter> = [];

    /**
     * Represents the storage for a behavior tree blackboard.
     * Can store anything that is serializable.
     */
    private storage: Record<string, unknown> = {};

    /**
     * Creates a new instance of the Blackboard class.
     * @param character The character associated with the blackboard.
     * @param contexts An array of other connected characters.
     */
    constructor(
        character: PingCompensatedCharacter,
        contexts: Array<PingCompensatedCharacter> = [],
        id: string = UniqueID.getUniqueID(),
    ) {
        this.character = character;
        this.contexts = contexts;
        this.id = id;
    }

    /**
     * Checks if a key exists in the blackboard.
     * @param key The key to check.
     * @returns True if the key exists, false otherwise.
     */
    has(key: string): boolean {
        return key in this.storage;
    }

    /**
     * Retrieves the value associated with a key from the blackboard.
     * @param key The key to retrieve the value for.
     * @returns The value associated with the key, or undefined if the key does not exist.
     */
    get<T>(key: string): T | undefined {
        return this.storage[key] as T | undefined;
    }

    /**
     * Sets a value for a key in the blackboard.
     * @param key The key to set the value for.
     * @param value The value to set.
     */
    set<T>(key: string, value: T): void {
        this.storage[key] = value;
    }
}
