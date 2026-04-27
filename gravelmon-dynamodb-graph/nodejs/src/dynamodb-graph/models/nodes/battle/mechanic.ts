import {DynamoEdge, DynamoNode, getNodePK} from '../../dynamo';
import {ResourceLocation} from "../minecraft/resourceLocation";
import {ItemEntity} from "../minecraft/item";
import {PokemonIdentifier} from "../pokemon";
import {FormEntity} from "../form";

export const MechanicEntity = "Mechanic";

export const UsesItemEdgeType = "UsesItem";
export const AffectsFormEdgeType = "AffectsForm";

class MechanicNode extends DynamoNode {
    description?: string;
    constructor(name: string, description?: string) {
        super(MechanicEntity, name);
        this.description = description;
    }
}

export function createMechanicNode(name: string, description?: string): MechanicNode {
    return new MechanicNode(name, description);
}

export function createMechanicUsesItemEdge(mechanicName: string, itemResourceLocation: ResourceLocation) : DynamoEdge {
    return new DynamoEdge(getNodePK(MechanicEntity, mechanicName), UsesItemEdgeType, ItemEntity, itemResourceLocation.toString());
}

//This is not supposed to point towards the mega evolution in case of the mega evolution mechanic, but the base form
export function createMechanicAffectsFormEdge(mechanicName: string, pokemonIdentifier: PokemonIdentifier) : DynamoEdge {
    return new DynamoEdge(getNodePK(MechanicEntity, mechanicName), AffectsFormEdgeType, FormEntity, pokemonIdentifier.toString());
}