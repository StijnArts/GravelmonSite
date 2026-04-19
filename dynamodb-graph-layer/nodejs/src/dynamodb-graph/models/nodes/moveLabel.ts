import { DynamoNode } from '../dynamo';

const MoveLabelEntity = "MoveLabel";

export class MoveLabelNode extends DynamoNode {
    constructor(name: string) {
        super(MoveLabelEntity, name);
    }
}

// TODO: Implement MoveLabel relationships if any