import { DynamoEdge, getNodePK } from '../dynamo';
import { GenderDifferenceNode as GenderDifference } from './assets/genderDifference';
import { Hitbox, PokemonNode } from './pokemon';
import { AspectEntity, HasAspectEdgeType } from './properties/aspect';
import { Stats } from './properties/stats';

export const FormEntity = "Form";

export function createFormHasAspectEdge(formName: string, aspectName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(FormEntity, formName), HasAspectEdgeType, AspectEntity, aspectName);
}

export class FormNode extends PokemonNode {
    genderDifference?: GenderDifference;
    constructor(
        name: string, 
        baseStats: Stats, 
        evYield: Stats, 
        heightInMeters: number, 
        weightInKg: number, 
        catchRate: number, 
        maleRatio: number, 
        baseExperience: number, 
        baseFriendship: number, 
        eggCycles: number, 
        hitbox: Hitbox, 
        baseScale: number = 1.0, 
        cannotDynamax: boolean = false, 
        pokedexEntry: string = "",
        genderDifference?: GenderDifference
    ) 
    {
        super(name, baseStats, evYield, heightInMeters, weightInKg, catchRate, maleRatio, baseExperience, baseFriendship, eggCycles, hitbox, baseScale, cannotDynamax, pokedexEntry);
        this.PK = getNodePK(FormEntity, name);
        this.entityType = FormEntity;
        this.genderDifference = genderDifference;
    }
}

// TODO: Implement Form relationships:
// - IsFormOfEdge to PokemonNode
// - HasAbilityEdge to AbilityNode
// - MoveSetOfEdge to MoveSetNode
// - HasEvolutionEdge to EvolutionNode
// - PrimaryTypeEdge to TypeNode
// - SecondaryTypeEdge to TypeNode
// - HasLabelEdge to LabelNode
// - DropsEdge to ItemNode
// - HasAspectEdge to AspectNode
// - PerformsEdge to BehaviourNode