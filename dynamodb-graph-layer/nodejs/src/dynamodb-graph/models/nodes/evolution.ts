import { DynamoNode } from '../dynamo';

const EvolutionEntity = "Evolution";

export class EvolutionNode extends DynamoNode {
    constructor(name: string) {
        super(EvolutionEntity, name);
    }
}

// TODO: Implement Evolution relationships:
// - IsTypeEdge to EvolutionTypeNode
// - LearnsUponEvolvingEdge to MoveNode
// - HasRequirementEdge to EvolutionRequirementNode
// - EvolvesFromEdge to FormNode
// - EvolvesIntoEdge to FormNode
// - ShedsEdge to FormNode
// - EvolutionRequirementEdge (self-referential)