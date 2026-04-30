import { DynamoNode, DynamoEdge, getNodePK, getEdgeSK, ItemType } from "../dynamodb-graph/service/dynamoNodes";

describe("DynamoDB Graph Unit Tests", () => {
    test("should create a node", () => {
        const node = new DynamoNode("Pokemon", "Pikachu");
        expect(node.PK).toBe("NODE#Pokemon#Pikachu");
        expect(node.SK).toBe("METADATA");
        expect(node.TYPE).toBe(ItemType.NODE);
        expect(node.entityType).toBe("Pokemon");
        expect(node.name).toBe("Pikachu");
    });

    test("should create an edge", () => {
        const edge = new DynamoEdge("NODE#Pokemon#Pikachu", "evolves_to", "Pokemon", "Raichu");
        expect(edge.PK).toBe("NODE#Pokemon#Pikachu");
        expect(edge.SK).toBe("EDGE#evolves_to#Pokemon#Raichu");
        expect(edge.TYPE).toBe(ItemType.EDGE);
        expect(edge.entityType).toBe("evolves_to");
        expect(edge.Target).toBe("NODE#Pokemon#Raichu");
    });

    test("utility functions", () => {
        expect(getNodePK("Pokemon", "Pikachu")).toBe("NODE#Pokemon#Pikachu");
        expect(getEdgeSK("evolves_to", "Pokemon", "Raichu")).toBe("EDGE#evolves_to#Pokemon#Raichu");
    });
});