import { DynamoNode, DynamoEdge, getNodePK, getPkName } from '../dynamo';
import { TypeEntity } from './type';

export const PokemonEntity = "Pokemon";

export class PokemonIdentifier {
    static fromString(leader: string): PokemonIdentifier {
        throw new Error('Method not implemented.');
    }
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

    fromString(identifier: string): PokemonIdentifier {
        const [game, pokemonWithForm] = identifier.split("#");
        const [pokemon, formName] = pokemonWithForm.split("#");
        return new PokemonIdentifier(game, pokemon, formName);
    }

    isForm(): boolean {
        return !!this.formName;
    }
}

export class PokemonNode extends DynamoNode {
    constructor(name: string) {
        super(PokemonEntity, name);
    }
}

export enum PokemonTypeRelationship {
    PrimaryType = "PrimaryType",
    SecondaryType = "SecondaryType"
}

abstract class PokemonTypeEdge extends DynamoEdge {
    constructor(pokemonName: string, typeName: string, relationship: PokemonTypeRelationship, isReverseEdge: boolean = false) {
        super(
            getNodePK(isReverseEdge? TypeEntity : PokemonEntity, pokemonName), 
        relationship,
        isReverseEdge? PokemonEntity : TypeEntity, 
        typeName, isReverseEdge);
    }

    reverseEdge(): PokemonTypeEdge {
        const pokemonName = getPkName(this.PK);
        const typeName = getPkName(this.Target);
        switch (this.entityType) {
            case PokemonTypeRelationship.PrimaryType:
                return new PrimaryTypeEdge(pokemonName, typeName, !this.isReverseEdge());
            case PokemonTypeRelationship.SecondaryType:
                return new SecondaryTypeEdge(pokemonName, typeName, !this.isReverseEdge());
            default:
                throw new Error(`Unknown Pokemon-Type relationship: ${this.entityType}`);
        }
    }
}

export class PrimaryTypeEdge extends PokemonTypeEdge {
    constructor(pokemonName: string, typeName: string, isReverseEdge: boolean = false) {
        super(pokemonName, typeName, PokemonTypeRelationship.PrimaryType, isReverseEdge);
    }
}

export class SecondaryTypeEdge extends PokemonTypeEdge {
    constructor(pokemonName: string, typeName: string, isReverseEdge: boolean = false) {
        super(pokemonName, typeName, PokemonTypeRelationship.SecondaryType, isReverseEdge);
    }
}

export function getPokemonIdentifier(game: string, pokemon: string, formName?: string): PokemonIdentifier {
    return new PokemonIdentifier(game, pokemon, formName);
}
// TODO: Implement remaining Pokemon relationships