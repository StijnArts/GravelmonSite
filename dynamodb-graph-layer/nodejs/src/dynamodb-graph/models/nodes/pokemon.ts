import { DynamoNode, DynamoEdge, getNodePK, getPkName } from '../dynamo';

const PokemonEntity = "Pokemon";
const TypeEntity = "Type";

export class PokemonIdentifier {
    game: string;
    pokemon: string;
    formName?: string;
    constructor(game: string, pokemon: string, formName?: string) {
        this.game = game;
        this.pokemon = pokemon;
        this.formName = formName;
    }

    toString(): string {
        const formSuffix = this.formName ? `#${this.formName}` : "";
        return `${this.game}#${this.pokemon}${formSuffix}`;
    }
}

export class PokemonNode extends DynamoNode {
    constructor(name: string) {
        super(PokemonEntity, name);
    }
}

export enum PokemonTypeRelationship {
    PRIMARY_TYPE = "PrimaryType",
    SECONDARY_TYPE = "SecondaryType"
}

abstract class PokemonTypeEdge extends DynamoEdge {
    constructor(pokemonName: string, typeName: string, relationship: PokemonTypeRelationship) {
        super(getNodePK(PokemonEntity, pokemonName), relationship, TypeEntity, typeName);
    }

    reverseEdge(): PokemonTypeEdge {
        // For type relationships, reverse might not be directly applicable, but we can implement if needed
        throw new Error("Reverse edge not implemented for Pokemon-Type relationships");
    }
}

export class PrimaryTypeEdge extends PokemonTypeEdge {
    constructor(pokemonName: string, typeName: string) {
        super(pokemonName, typeName, PokemonTypeRelationship.PRIMARY_TYPE);
    }
}

export class SecondaryTypeEdge extends PokemonTypeEdge {
    constructor(pokemonName: string, typeName: string) {
        super(pokemonName, typeName, PokemonTypeRelationship.SECONDARY_TYPE);
    }
}

export function getPokemonIdentifier(game: string, pokemon: string, formName?: string): PokemonIdentifier {
    return new PokemonIdentifier(game, pokemon, formName);
}
// TODO: Implement remaining Pokemon relationships