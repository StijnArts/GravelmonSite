import {DynamoEdge, DynamoNode, getNodePK, getPkName} from '../dynamo';
import {MoveEntity} from "./battle/move/move";
import {PokemonEntity, PokemonIdentifier} from "./pokemon";
import {FormEntity} from "./form";
import {AbilityEntity} from "./battle/ability";
import {ItemEntity} from "./minecraft/item";
import {AspectEntity} from "./properties/aspect";
import {MechanicEntity} from "./battle/mechanic";
import {TypeEntity} from "./battle/type";
import {ResourceLocation} from "./minecraft/resourceLocation";

export const GameEntity = "Game";

export const IntroducesEdgeType = "Introduces";
export const Adds = "Adds";

export function createGameNode(name: string, developer: string, wikiPage: string, isPermitted: boolean, s3LogoLocation: string = ""): GameNode {
    return new GameNode(name, developer, wikiPage, isPermitted, s3LogoLocation);
}

export function createGameAddsPokemonEdge(gameName: string, pokemonName: PokemonIdentifier, dexNumber: number): DynamoEdge {
    return new AddsEdge(gameName, pokemonName.toString(), dexNumber);
}

export function createGameIntroducesMoveEdge(gameName: string, moveName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(GameEntity, gameName), IntroducesEdgeType, MoveEntity, moveName);
}

export function createGameIntroducesFormEdge(gameName: string, formName: PokemonIdentifier): DynamoEdge {
    return new DynamoEdge(getNodePK(GameEntity, gameName), IntroducesEdgeType, FormEntity, formName.toString());
}

export function createGameIntroducesAbilityEdge(gameName: string, abilityName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(GameEntity, gameName), IntroducesEdgeType, AbilityEntity, abilityName);
}

export function createGameIntroducesItemEdge(gameName: string, itemName: ResourceLocation): DynamoEdge {
    return new DynamoEdge(getNodePK(GameEntity, gameName), IntroducesEdgeType, ItemEntity, itemName.toString());
}

export function createGameIntroducesAspectEdge(gameName: string, aspectName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(GameEntity, gameName), IntroducesEdgeType, AspectEntity, aspectName);
}

export function createGameIntroducesMechanicEdge(gameName: string, mechanicName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(GameEntity, gameName), IntroducesEdgeType, MechanicEntity, mechanicName);
}

export function createGameIntroducesTypeEdge(gameName: string, typeName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(GameEntity, gameName), IntroducesEdgeType, TypeEntity, typeName);
}

class GameNode extends DynamoNode {
    developer: string;
    wikiPage: string;
    isPermitted: boolean;
    s3LogoLocation?: string;

    constructor(name: string, developer: string, wikiPage: string, isPermitted: boolean, s3LogoLocation: string) {
        super(GameEntity, name);
        this.developer = developer;
        this.wikiPage = wikiPage;
        this.isPermitted = isPermitted;
        this.s3LogoLocation = s3LogoLocation;
    }
}

class AddsEdge extends DynamoEdge {
    dexNumber: number;
    constructor(sourceName: string, targetName: string, dexNumber: number, isReverseEdge: boolean = false) {
        super(getNodePK(isReverseEdge? PokemonEntity : GameEntity, sourceName),
            Adds,
            isReverseEdge? GameEntity : PokemonEntity, targetName, isReverseEdge);
        this.dexNumber = dexNumber;
    }

    reverseEdge(): DynamoEdge {
        return new AddsEdge(getPkName(this.Target), getPkName(this.PK), this.dexNumber, !this.isReverseEdge());
    }
}