import { DynamoNode } from '../dynamo';

const MoveCategoryEntity = "MoveCategory";

export class MoveCategoryNode extends DynamoNode {
    constructor(name: string) {
        super(MoveCategoryEntity, name);
    }
}

// TODO: Implement MoveCategory relationships if any