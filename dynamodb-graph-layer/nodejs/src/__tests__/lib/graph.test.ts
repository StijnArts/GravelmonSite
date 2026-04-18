import {
  createNode,
  createEdge,
  getNode,
  getEdge,
  getNeighbors,
  queryNodes,
  ensureTableExists,
} from '../../dynamodb-graph/lib/graph';
import { DynamoDBClient, CreateTableCommand, PutItemCommand, GetItemCommand, QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';

const mockSend = jest.fn();

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({
    send: mockSend,
  })),
  CreateTableCommand: jest.fn(),
  PutItemCommand: jest.fn(),
  GetItemCommand: jest.fn(),
  QueryCommand: jest.fn(),
  ScanCommand: jest.fn(),
}));

describe('graph functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSend.mockClear();
  });

  describe('ensureTableExists', () => {
    it('should create table if it does not exist', async () => {
      mockSend.mockResolvedValue({});

      const result = await ensureTableExists();

      expect(result).toBe(true);
      expect(mockSend).toHaveBeenCalledWith(
        expect.any(CreateTableCommand)
      );
    });

    it('should return false if table already exists', async () => {
      const error = new Error('Table exists');
      error.name = 'ResourceInUseException';
      mockSend.mockRejectedValue(error);

      const result = await ensureTableExists();

      expect(result).toBe(false);
    });
  });

  describe('createNode', () => {
    it('should create a node', async () => {
      mockSend.mockResolvedValue({});

      const node = await createNode({
        id: 'test-node',
        name: 'Test Node',
        description: 'A test node',
        metadata: { key: 'value' },
      });

      expect(node).toEqual({
        id: 'test-node',
        name: 'Test Node',
        description: 'A test node',
        metadata: { key: 'value' },
      });
      expect(mockSend).toHaveBeenCalledWith(
        expect.any(PutItemCommand)
      );
    });

    it('should throw error if id is missing', async () => {
      await expect(createNode({} as any)).rejects.toThrow('Node id is required.');
    });
  });

  describe('createEdge', () => {
    it('should create an edge', async () => {
      mockSend.mockResolvedValue({});

      const edge = await createEdge({
        sourceId: 'source',
        targetId: 'target',
        relation: 'relates_to',
        properties: { weight: 1 },
      });

      expect(edge).toEqual({
        sourceId: 'source',
        targetId: 'target',
        relation: 'relates_to',
        properties: { weight: 1 },
      });
    });

    it('should throw error if sourceId or targetId is missing', async () => {
      await expect(createEdge({ sourceId: 'source' } as any)).rejects.toThrow('sourceId and targetId are required.');
    });
  });

  describe('getNode', () => {
    it('should return node if found', async () => {
      const mockItem = {
        PK: 'NODE#test-node',
        SK: 'NODE',
        Type: 'Node',
        Name: 'Test Node',
        Description: 'Description',
        Metadata: JSON.stringify({ key: 'value' }),
      };
      mockSend.mockResolvedValue({ Item: mockItem });

      const node = await getNode('test-node');

      expect(node).toEqual({
        id: 'test-node',
        name: 'Test Node',
        description: 'Description',
        metadata: { key: 'value' },
      });
    });

    it('should return null if node not found', async () => {
      mockSend.mockResolvedValue({ Item: undefined });

      const node = await getNode('test-node');

      expect(node).toBeNull();
    });
  });

  describe('getEdge', () => {
    it('should return edge if found', async () => {
      const mockItem = {
        PK: 'NODE#source',
        SK: 'EDGE#target',
        Type: 'Edge',
        SourceId: 'source',
        TargetId: 'target',
        Relation: 'relates_to',
        Properties: JSON.stringify({ weight: 1 }),
      };
      mockSend.mockResolvedValue({ Item: mockItem });

      const edge = await getEdge('source', 'target');

      expect(edge).toEqual({
        sourceId: 'source',
        targetId: 'target',
        relation: 'relates_to',
        properties: { weight: 1 },
      });
    });
  });

  describe('getNeighbors', () => {
    it('should return neighbors', async () => {
      const mockItems = [
        {
          PK: 'NODE#source',
          SK: 'EDGE#target1',
          SourceId: 'source',
          TargetId: 'target1',
          Relation: 'relates_to',
        },
      ];
      mockSend.mockResolvedValue({ Items: mockItems });

      const edges = await getNeighbors('source');

      expect(edges).toHaveLength(1);
      expect(edges[0]).toEqual({
        sourceId: 'source',
        targetId: 'target1',
        relation: 'relates_to',
        properties: null,
      });
    });
  });

  describe('queryNodes', () => {
    it('should return nodes', async () => {
      const mockItems = [
        {
          PK: 'NODE#node1',
          SK: 'NODE',
          Type: 'Node',
          Name: 'Node 1',
        },
      ];
      mockSend.mockResolvedValue({ Items: mockItems });

      const nodes = await queryNodes();

      expect(nodes).toHaveLength(1);
      expect(nodes[0]).toEqual({
        id: 'node1',
        name: 'Node 1',
        description: null,
        metadata: null,
      });
    });
  });
});