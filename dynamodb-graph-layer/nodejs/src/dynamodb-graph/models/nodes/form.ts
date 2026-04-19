import { DynamoNode } from '../dynamo';

export const FormEntity = "Form";

export class FormNode extends DynamoNode {
    constructor(name: string) {
        super(FormEntity, name);
    }
}

// TODO: Implement Form relationships:
// - IsFormOfEdge to PokemonNode
// - HasAbilityEdge to AbilityNode
// - MovesetOfEdge to MovesetNode
// - HasEvolutionEdge to EvolutionNode
// - PrimaryTypeEdge to TypeNode
// - SecondaryTypeEdge to TypeNode
// - HasLabelEdge to LabelNode
// - DropsEdge to ItemNode
// - HasAspectEdge to AspectNode
// - PerformsEdge to BehaviourNode