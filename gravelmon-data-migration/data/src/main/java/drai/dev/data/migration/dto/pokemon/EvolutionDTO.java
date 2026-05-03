package drai.dev.data.migration.dto.pokemon;

import drai.dev.data.migration.dto.battle.*;
import drai.dev.gravelmon.pokemon.attributes.*;
import net.minecraft.resources.*;

import javax.annotation.*;
import java.util.*;

public record EvolutionDTO(EvolutionOptions evolutionOptions) {
    public record EvolutionIdentifier(PokemonDTO.PokemonIdentifier source, PokemonDTO.PokemonIdentifier result) {}
    public record EvolutionOptions(EvolutionIdentifier identifier, EvolutionType type, Optional<Boolean> consumesHeldItem,
                                   Optional<Boolean> isOptional, List<EvolutionConditionDTO> evolutionConditions,
                                   @Nullable ResourceLocation needsToHoldItem, @Nullable ResourceLocation requiresItemUsedOn,
                                   PokemonDTO.PokemonIdentifier evolvesFromForm, PokemonDTO.PokemonIdentifier evolvesIntoForm,
                                   PokemonDTO.PokemonIdentifier shedsIntoForm, List<MoveDTO.MoveIdentifier> learnsMoveUponEvolving) {}


    public enum EvolutionConditionType {
        LEVEL,
        TIME,
        RATIO,
        HAS_MOVE,
        HELD_ITEM,
        PROPERTY,
        GENDER,
        FRIENDSHIP,
        PARTY_MEMBER,
        PARTY_MEMBER_OF_TYPE,
        BIOME,
        WEATHER,
        BLOCKS_TRAVELED,
    }

    public enum StatRatio {
        DEFENCE_HIGHER,
        ATTACK_HIGHER,
        EQUAL
    }

    public enum Gender {
        MALE,
        FEMALE
    }
}
