import { DynamoNode, DynamoEdge, ItemType, createEdge, PK, getPkName, getPkType } from '../../dynamodb-graph/models/dynamo';
import { DynamoDBClient, PutItemCommand, TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';

const mockSend = jest.fn();
const mockDynamoClient = DynamoDBClient as jest.MockedClass<typeof DynamoDBClient>;

describe('DynamoItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (DynamoDBClient as any).mockImplementation(() => ({
      send: mockSend,
    }));
  });
});

class TestDynamoNode extends DynamoNode {
    constructor(entityType: string, name: string) {
        super(entityType, name);
    }
}

class TestDynamoEdge extends DynamoEdge {
    reverseEdge(): DynamoEdge {
        return new TestDynamoEdge(getPkType(this.Target), getPkName(this.Target), getPkType(this.PK), getPkName(this.PK), true);
    }
    constructor(pk: PK, edgeType: string, targetEntityType: string, targetName: string, reverse: boolean = false) {
        super(pk, edgeType, targetEntityType, targetName, reverse);
    }
}

describe('DynamoNode', () => {
  it('should create node with correct PK', () => {
    const node = new TestDynamoNode('Pokemon', 'Pikachu');

    expect(node.PK).toBe('NODE#Pokemon#Pikachu');
    expect(node.SK).toBe('METADATA');
    expect(node.TYPE).toBe(ItemType.NODE);
    expect(node.entityType).toBe('Pokemon');
    expect(node.Name).toBe('Pikachu');
  });
});

describe('DynamoEdge', () => {
  it('should create edge with correct properties', () => {
    const edge = new TestDynamoEdge('NODE#Pokemon#Pikachu', 'evolves_to', 'Pokemon', 'Raichu');

    expect(edge.PK).toBe('NODE#Pokemon#Pikachu');
    expect(edge.TYPE).toBe(ItemType.EDGE);
    expect(edge.entityType).toBe('evolves_to');
    expect(edge.Target).toBe('NODE#Pokemon#Raichu');
  });
});

describe('createEdgeWithReverse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (DynamoDBClient as any).mockImplementation(() => ({
      send: mockSend,
    }));
  });

  it('should create edge with reverse in transaction', async () => {
    const edge = new TestDynamoEdge('NODE#Pokemon#Pikachu', 'evolves_to', 'Pokemon', 'Raichu');
    mockSend.mockResolvedValue({});

    await createEdge(edge);

    expect(mockSend).toHaveBeenCalledWith(
      expect.any(TransactWriteItemsCommand)
    );
    const call = mockSend.mock.calls[0][0];
    expect(call.input.TransactItems).toHaveLength(2);
  });
});

describe('getPkType and getPkName', () => {
    

  describe('getTargetEntityType', () => {
    it('should return target entity type', () => {
      const pk = 'NODE#Pokemon#Raichu';
      expect(getPkType(pk)).toBe('Pokemon');
    });
  });

  describe('getTargetName', () => {
    it('should return target name', () => {
      const pk = 'NODE#Pokemon#Raichu';
      expect(getPkName(pk)).toBe('Raichu');
    });
  });
});