import { DynamoNode } from '../dynamo';

const MovesetEntity = "Moveset";

export class MovesetNode extends DynamoNode {
    constructor(name: string) {
        super(MovesetEntity, name);
    }
}

// TODO: Implement Moveset relationships:
// - LevelUpEdge to MoveNode
// - TeachEdge to MoveNode
// - EggEdge to MoveNode