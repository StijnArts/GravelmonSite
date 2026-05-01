export type Deserializer<T> = (data: Record<string, any>) => T;

class DeserializerRegistry {
    private map = new Map<string, Deserializer<any>>();

    register<T>(type: string, fn: Deserializer<T>) {
        this.map.set(type, fn);
    }

    get<T>(type: string): Deserializer<T> | undefined {
        return this.map.get(type);
    }

    deserialize<T>(type: string, data: Record<string, any>): T {
        const fn = this.map.get(type);

        if (!fn) {
            throw new Error(`No deserializer registered for type: ${type}`);
        }

        return fn(data);
    }
}

export const deserializerRegistry = new DeserializerRegistry();