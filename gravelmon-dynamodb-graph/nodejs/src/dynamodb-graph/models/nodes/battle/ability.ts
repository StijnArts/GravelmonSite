import { DynamoNode } from '../../dynamoNodes';

export const AbilityEntity = "Ability";

class AbilityNode extends DynamoNode {
    description?: string;
    constructor(name: string, description?: string) {
        super(AbilityEntity, name);
        this.description = description;
    }
}

export function createAbilityNode(name: string, description?: string): AbilityNode {
    return new AbilityNode(name, description);
}