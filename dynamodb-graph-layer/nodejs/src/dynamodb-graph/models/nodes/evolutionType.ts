import { DynamoNode } from '../dynamo';

const EvolutionTypeEntity = "EvolutionType";

export class EvolutionTypeNode extends DynamoNode {
    constructor(name: string) {
        super(EvolutionTypeEntity, name);
    }
}

// TODO: Implement EvolutionType relationships if any