import { DynamoEdge, DynamoNode, getNodePK } from '../service/dynamoNodes';
import { FormEntity } from './pokemon/formNode';
import { PokemonEntity, PokemonIdentifier } from './pokemon/pokemonNode';

export const SoundEntity = "Sound";

export const SoundUsedByEdgeType = "UsedBy";

class SoundNode extends DynamoNode {
    s3Location?: string;
    madeBy: string;
    constructor(name: string, madeBy: string, s3Location?: string) {
        super(SoundEntity, name);
        this.s3Location = s3Location;
        this.madeBy = madeBy;
    }
}

export function createSoundNode(name: string, madeBy: string = "Unknown", s3Location?: string): SoundNode {
    return new SoundNode(name, madeBy, s3Location);
}

export function createSoundUsedByPokemonEdge(soundName: string, pokemonIdentifier: PokemonIdentifier): DynamoEdge {
    return new DynamoEdge(getNodePK(SoundEntity, soundName), SoundUsedByEdgeType, PokemonEntity, pokemonIdentifier.toPK());
}

export function createSoundUsedByFormEdge(soundName: string, formIdentifier: PokemonIdentifier): DynamoEdge {
    return new DynamoEdge(getNodePK(SoundEntity, soundName), SoundUsedByEdgeType, FormEntity, formIdentifier.toPK());
}