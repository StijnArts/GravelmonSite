import { SoundData } from '../models/soundData';
import { deserializerRegistry } from '../service/deserializerRegistry';
import { DynamoEdge, DynamoNode, getNodePK } from '../service/dynamoNodes';
import { FormEntity } from './pokemon/formNode';
import { PokemonEntity, PokemonIdentifier } from './pokemon/pokemonNode';

export const SoundEntity = "Sound";

export const SoundUsedByEdgeType = "UsedBy";

class SoundNode extends DynamoNode {
    soundData: SoundData;
    static version = 1;
    constructor(soundData: SoundData, lastEdited: number = Date.now()) {
        super(SoundEntity, soundData.name, SoundNode.version, lastEdited);
        this.soundData = soundData;
    }

    static deserialize(data: Record<string, any>): SoundNode {
        const soundData: SoundData = {
            name: data.soundData.name,
            s3Location: data.soundData.s3Location,
            madeBy: data.soundData.madeBy
        };
        return new SoundNode(soundData, data.lastEdited);
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            soundData: {
                name: this.soundData.name,
                s3Location: this.soundData.s3Location,
                madeBy: this.soundData.madeBy
            }
        }
    }
}

export function createSoundNode(soundData: SoundData): SoundNode {
    return new SoundNode(soundData);
}

export function createSoundUsedByPokemonEdge(soundName: string, pokemonIdentifier: PokemonIdentifier): DynamoEdge {
    return new DynamoEdge(getNodePK(SoundEntity, soundName), SoundUsedByEdgeType, PokemonEntity, pokemonIdentifier.toString());
}

export function createSoundUsedByFormEdge(soundName: string, formIdentifier: PokemonIdentifier): DynamoEdge {
    return new DynamoEdge(getNodePK(SoundEntity, soundName), SoundUsedByEdgeType, FormEntity, formIdentifier.toString());
}

deserializerRegistry.register(SoundEntity, SoundNode.deserialize);