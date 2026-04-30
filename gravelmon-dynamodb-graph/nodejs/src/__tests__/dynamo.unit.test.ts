import { DynamoNode, DynamoEdge, getNodePK, getEdgeSK, buildSkCondition, ItemType } from "../dynamodb-graph/models/dynamoNodes";

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
        expect(edge.isReverseEdge()).toBe(false);
    });

    test("should create reverse edge", () => {
        const edge = new DynamoEdge("NODE#Pokemon#Pikachu", "evolves_to", "Pokemon", "Raichu");
        const reverse = edge.reverseEdge();
        expect(reverse.PK).toBe("NODE#Pokemon#Raichu");
        expect(reverse.SK).toBe("EDGE#IN#evolves_to#Pokemon#Pikachu");
        expect(reverse.isReverseEdge()).toBe(true);
    });

    test("utility functions", () => {
        expect(getNodePK("Pokemon", "Pikachu")).toBe("NODE#Pokemon#Pikachu");
        expect(getEdgeSK("evolves_to", "Pokemon", "Raichu")).toBe("EDGE#evolves_to#Pokemon#Raichu");
        expect(getEdgeSK("evolves_to", "Pokemon", "Raichu", true)).toBe("EDGE#IN#evolves_to#Pokemon#Raichu");
    });

    test("buildSkCondition branches", () => {
        expect(buildSkCondition({ eq: "EDGE#foo#Pokemon#Bar" })).toEqual({
            expression: "SK = :sk",
            values: { ':sk': "EDGE#foo#Pokemon#Bar" }
        });

        expect(buildSkCondition({ beginsWith: "EDGE#" })).toEqual({
            expression: "begins_with(SK, :sk)",
            values: { ':sk': "EDGE#" }
        });

        expect(buildSkCondition({ between: { start: "EDGE#A", end: "EDGE#Z" } })).toEqual({
            expression: "SK BETWEEN :start AND :end",
            values: { ':start': "EDGE#A", ':end': "EDGE#Z" }
        });

        expect(buildSkCondition({ ge: "EDGE#A" })).toEqual({
            expression: "SK >= :sk",
            values: { ':sk': "EDGE#A" }
        });

        expect(buildSkCondition({ le: "EDGE#Z" })).toEqual({
            expression: "SK <= :sk",
            values: { ':sk': "EDGE#Z" }
        });

        expect(buildSkCondition({ gt: "EDGE#A" })).toEqual({
            expression: "SK > :sk",
            values: { ':sk': "EDGE#A" }
        });

        expect(buildSkCondition({ lt: "EDGE#Z" })).toEqual({
            expression: "SK < :sk",
            values: { ':sk': "EDGE#Z" }
        });
    });
});