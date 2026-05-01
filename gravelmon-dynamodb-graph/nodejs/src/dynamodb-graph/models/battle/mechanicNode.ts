import {DynamoEdge, DynamoNode, getNodePK} from '../../service/dynamoNodes';
import {ResourceLocation} from "../minecraft/resourceLocation";
import {ItemEntity} from "../../nodes/minecraft/itemNode";
import {PokemonIdentifier} from "../../nodes/pokemon/pokemonNode";
import {FormEntity} from "../../nodes/pokemon/formNode";

export const MechanicEntity = "Mechanic";

export const UsesItemEdgeType = "UsesItem";
export const AffectsFormEdgeType = "AffectsForm";

class MechanicNode extends DynamoNode {
    description?: string;
    usesItems?: ResourceLocation[];
    affectsForms?: PokemonIdentifier[];

    constructor(name: string, description?: string, usesItems?: ResourceLocation[], affectsForms?: PokemonIdentifier[]) {
        super(MechanicEntity, name);
        this.description = description;
        this.usesItems = usesItems;
        this.affectsForms = affectsForms;
    }
}

export function createMechanicNode(name: string, description?: string, usesItems?: ResourceLocation[], affectsForms?: PokemonIdentifier[]): MechanicNode {
    return new MechanicNode(name, description, usesItems, affectsForms);
}

//This is not supposed to point towards the mega evolution in case of the mega evolution mechanic, but the base form
export function createMechanicAffectsFormEdge(mechanicName: string, pokemonIdentifier: PokemonIdentifier) : DynamoEdge {
    return new DynamoEdge(getNodePK(MechanicEntity, mechanicName), AffectsFormEdgeType, FormEntity, pokemonIdentifier.toPK());
}