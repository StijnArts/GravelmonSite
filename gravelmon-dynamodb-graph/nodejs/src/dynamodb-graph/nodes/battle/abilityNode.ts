import { deserializerRegistry } from '../../service/deserializerRegistry';
import { DynamoNode } from '../../service/dynamoNodes';

export const AbilityEntity = "Ability";

class AbilityNode extends DynamoNode {
    description?: string;
    constructor(name: string, description?: string) {
        super(AbilityEntity, name);
        this.description = description;
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            description: this.description
        }
    }

    static deserialize(data: Record<string, any>): DynamoNode {
        return new AbilityNode(data.name, data.description);
    }
}

export function createAbilityNode(name: string, description?: string): AbilityNode {
    return new AbilityNode(name, description);
}

deserializerRegistry.register(AbilityEntity, AbilityNode.deserialize);