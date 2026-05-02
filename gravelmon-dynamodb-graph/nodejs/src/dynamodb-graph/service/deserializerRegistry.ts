import {DynamoEdge, DynamoNode, ItemType} from "./dynamoNodes";

export type Deserializer<T> = (data: Record<string, any>) => T;

class DeserializerRegistry {
    private map = new Map<string, Deserializer<any>>();

    register<T>(type: string, fn: Deserializer<T>) {
        this.map.set(type, fn);
    }

    get<T>(type: string): Deserializer<T> | undefined {
        return this.map.get(type);
    }

    deserialize<T>(entityType: string, itemType: ItemType, data: Record<string, any>): T {
        const fn = this.map.get(entityType);

        if (!fn) {
            switch (itemType) {
                case ItemType.NODE : return DynamoNode.deserialize(data) as T;
                case ItemType.EDGE : return DynamoEdge.deserialize(data) as T;
                default: throw new Error(`No deserializer registered for ${entityType}`);
            }
        }

        return fn(data);
    }
}

export const deserializerRegistry = new DeserializerRegistry();