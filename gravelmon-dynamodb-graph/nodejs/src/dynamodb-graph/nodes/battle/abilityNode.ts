import { deserializerRegistry } from '../../service/deserializerRegistry';
import { DynamoNode } from '../../service/dynamoNodes';

export const AbilityEntity = "Ability";

export class AbilityIdentifier {
    game: string;
    ability: string;

    constructor(game: string, ability: string) {
        this.game = game;
        this.ability = ability;
    }

    toString(): string {
        return `${this.game}#${this.ability}`;
    }

    static fromString(identifier: string): AbilityIdentifier {
        const [game, ability] = identifier.split("#");
        return new AbilityIdentifier(game, ability);
    }

    getAbility(): string {
        return this.ability;
    }

    serialize(): any {
        return {
            game: this.game,
            ability: this.ability
        };
    }

    static deserialize(data: any): AbilityIdentifier {
        return new AbilityIdentifier(data.game, data.ability);
    }
}

export class AbilityNode extends DynamoNode {
    description?: string;
    identifier: AbilityIdentifier;

    constructor(name: AbilityIdentifier, description?: string) {
        super(AbilityEntity, name.toString());
        this.description = description;
        this.identifier = name;
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            description: this.description,
            identifier: this.identifier.serialize()
        }
    }

    static deserialize(data: Record<string, any>): DynamoNode {
        return new AbilityNode(AbilityIdentifier.deserialize(data.identifier), data.description);
    }
}

export function createAbilityNode(name: AbilityIdentifier, description?: string): AbilityNode {
    return new AbilityNode(name, description);
}

deserializerRegistry.register(AbilityEntity, AbilityNode.deserialize);