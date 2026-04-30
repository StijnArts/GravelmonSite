import {DynamoEdge, DynamoNode, getNodePK} from '../../dynamoNodes';
import {PokemonIdentifier} from "../pokemon";
import {AspectEntity} from "../properties/aspect";
import {FormEntity} from "../form";

export const ResolverDataEntity = "ResolverData";

export const ResolverForAspectEdgeType = "ResolverForAspect";
export const ResolverForFormEdgeType = "ResolverForForm";

export function createResolverForAspectEdge(pokemonIdentifier: PokemonIdentifier, aspect: string): DynamoEdge {
    return new DynamoEdge(getNodePK(ResolverDataEntity, pokemonIdentifier.toString()), ResolverForAspectEdgeType, AspectEntity, aspect);
}

export function createResolverForFormEdge(pokemonIdentifier: PokemonIdentifier, aspect: PokemonIdentifier): DynamoEdge {
    return new DynamoEdge(getNodePK(ResolverDataEntity, pokemonIdentifier.toString()), ResolverForFormEdgeType, FormEntity, aspect.toString());
}

export function createResolverDataNode(name: PokemonIdentifier, layers: ResolverLayer[]): ResolverDataNode {
    return new ResolverDataNode(name, layers);
}

export enum CommonLayerNames {
    Emissive = "emissive",
    TransparentEmissive = "transparentEmissive",
    Tail = "tail",
    Transparent_Emissive = "transparent_emissive",
    Emissive2 = "emissive2",
    Flame = "flame",
    Glow = "glow",
}

export interface ResolverLayer {
    name: string | CommonLayerNames;
    textureName: string;
    isEmissive?: boolean;
    isTranslucent?: boolean;
    framerate?: number;
    loops: boolean;
    numberOfFrames?: number;
}

class ResolverDataNode extends DynamoNode {
    //texturename, model name and poser name will all be solved programmatically
    layers: ResolverLayer[];
    constructor(name: PokemonIdentifier, layers: ResolverLayer[]) {
        super(ResolverDataEntity, name.toString());
        this.layers = layers;
    }
}