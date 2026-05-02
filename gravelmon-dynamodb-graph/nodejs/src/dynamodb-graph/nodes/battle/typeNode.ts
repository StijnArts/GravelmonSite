import { deserializerRegistry } from '../../service/deserializerRegistry';
import { DynamoNode } from '../../service/dynamoNodes';

export const TypeEntity = "Type";

export function createTypeNode(name: string, resists?: string[], immunities?: string[], weaknesses?: string[], introducedByGames?: string[]): TypeNode {
    return new TypeNode(name, resists, immunities, weaknesses, introducedByGames);
}

export class TypeNode extends DynamoNode {
    private resists?: string[];
    private immunities?: string[];
    private weaknesses?: string[];
    private introducedByGames?: string[];

    constructor(name: string, resists?: string[], immunities?: string[], weaknesses?: string[], introducedByGames?: string[]) {
        super(TypeEntity, name);
        this.resists = resists;
        this.immunities = immunities;
        this.weaknesses = weaknesses;
        this.introducedByGames = introducedByGames;
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            resists: this.resists,
            immunities: this.immunities,
            weaknesses: this.weaknesses,
            introducedByGames: this.introducedByGames
        }
    }

    static deserialize(data: Record<string, any>): DynamoNode {
        const typeNode = new TypeNode(data.name);
        typeNode.resists = data.resists;
        typeNode.immunities = data.immunities;
        typeNode.weaknesses = data.weaknesses;
        typeNode.introducedByGames = data.introducedByGames;
        return typeNode;
    }
}

deserializerRegistry.register(TypeEntity, TypeNode.deserialize);