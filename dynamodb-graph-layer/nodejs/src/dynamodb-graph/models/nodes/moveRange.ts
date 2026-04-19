import { DynamoNode } from '../dynamo';

const MoveRangeEntity = "MoveRange";

export class MoveRangeNode extends DynamoNode {
    constructor(name: string) {
        super(MoveRangeEntity, name);
    }
}

// TODO: Implement MoveRange relationships if any