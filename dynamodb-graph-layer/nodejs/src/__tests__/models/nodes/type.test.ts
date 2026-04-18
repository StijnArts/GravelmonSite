import { TypeNode, ImmunityEdge, WeaknessEdge, ResistanceEdge, TypeRelationShip } from '../../../dynamodb-graph/models/nodes/type';

describe('TypeNode', () => {
  it('should create type node', () => {
    const node = new TypeNode('Electric');

    expect(node.PK).toBe('NODE#Type#Electric');
    expect(node.SK).toBe('METADATA');
    expect(node.entityType).toBe('Type');
    expect(node.Name).toBe('Electric');
  });
});

describe('TypeRelationShipEdge', () => {
  describe('ImmunityEdge', () => {
    it('should create immunity edge', () => {
      const edge = new ImmunityEdge('Electric', 'Ground');

      expect(edge.PK).toBe('NODE#Type#Electric');
      expect(edge.entityType).toBe(TypeRelationShip.IMMUNITY);
      expect(edge.Target).toBe('NODE#Type#Ground');
    });

    it('should create reverse immunity edge', () => {
      const edge = new ImmunityEdge('Electric', 'Ground');
      const reverse = edge.reverseEdge();

      expect(reverse).toBeInstanceOf(ImmunityEdge);
      expect(reverse.PK).toBe('NODE#Type#Ground');
      expect(reverse.Target).toBe('NODE#Type#Electric');
    });
  });

  describe('WeaknessEdge', () => {
    it('should create weakness edge', () => {
      const edge = new WeaknessEdge('Electric', 'Ground');

      expect(edge.entityType).toBe(TypeRelationShip.WEAKNESS);
    });

    it('should create reverse weakness edge', () => {
      const edge = new WeaknessEdge('Electric', 'Ground');
      const reverse = edge.reverseEdge();

      expect(reverse).toBeInstanceOf(WeaknessEdge);
    });
  });

  describe('ResistanceEdge', () => {
    it('should create resistance edge', () => {
      const edge = new ResistanceEdge('Electric', 'Flying');

      expect(edge.entityType).toBe(TypeRelationShip.RESISTANCE);
    });

    it('should create reverse resistance edge', () => {
      const edge = new ResistanceEdge('Electric', 'Flying');
      const reverse = edge.reverseEdge();

      expect(reverse).toBeInstanceOf(ResistanceEdge);
    });
  });
});