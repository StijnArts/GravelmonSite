import { MoveIdentifier, PokemonIdentifier } from "../nodes";
import { ResourceLocation } from "./minecraft/resourceLocation";

export interface GameData {
    name: string;
    developer: string;
    wikiPage: string;
    isPermitted: boolean;
    s3LogoLocation?: string;
    introducesPokemon: Record<number, PokemonIdentifier>; //dex number to pokemon identifier
    introducesItem: ResourceLocation[];
    introducesMoves: MoveIdentifier[];
    introducesAbilities: string[];
    introducesAspects: string[];
    introducesMechanics: string[];
    introducesTypes: string[];
}