package drai.dev.data.migration.dto.pokemon;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;
import drai.dev.data.migration.dto.battle.*;
import drai.dev.data.migration.service.*;
import drai.dev.gravelmon.pokemon.attributes.*;
import net.minecraft.resources.*;

import javax.annotation.*;
import java.util.*;

public record EvolutionDTO(EvolutionOptions evolutionOptions) implements JsonSerializable {
    @Override
    public JsonElement toJson() {
        JsonObject json = new JsonObject();
        json.add("evolutionOptions", evolutionOptions.toJson());
        return json;
    }

    public record EvolutionIdentifier(PokemonDTO.PokemonIdentifier source,
                                      PokemonDTO.PokemonIdentifier result) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            JsonObject json = new JsonObject();
            json.add("source", source.toJson());
            json.add("result", result.toJson());
            return json;
        }
    }

    public record EvolutionOptions(EvolutionIdentifier identifier,
                                   EvolutionType type,
                                   Optional<Boolean> consumesHeldItem,
                                   Optional<Boolean> isOptional,
                                   List<EvolutionConditionDTO> evolutionConditions,
                                   @Nullable ResourceLocation needsToHoldItem,
                                   @Nullable ResourceLocation requiresItemUsedOn,
                                   PokemonDTO.PokemonIdentifier evolvesFromForm,
                                   PokemonDTO.PokemonIdentifier evolvesIntoForm,
                                   PokemonDTO.PokemonIdentifier shedsIntoForm,
                                   @Nullable List<MoveDTO.MoveIdentifier> learnsMoveUponEvolving
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            JsonObject json = new JsonObject();
            json.add("identifier", identifier.toJson());
            json.addProperty("type", type.getName());

            consumesHeldItem.ifPresent(value -> json.addProperty("consumesHeldItem", value));
            isOptional.ifPresent(value -> json.addProperty("isOptional", value));

            json.add("evolutionConditions", MigrationUtil.listToJsonArray(evolutionConditions, EvolutionConditionDTO::toJson));

            if (needsToHoldItem != null) json.addProperty("needsToHoldItem", needsToHoldItem.toString());
            if (requiresItemUsedOn != null) json.addProperty("requiresItemUsedOn", requiresItemUsedOn.toString());
            json.add("evolvesFromForm", evolvesFromForm.toJson());
            json.add("evolvesIntoForm", evolvesIntoForm.toJson());
            json.add("shedsIntoForm", shedsIntoForm.toJson());
            if( learnsMoveUponEvolving != null) json.add("learnsMoveUponEvolving",
                    MigrationUtil.listToJsonArray(learnsMoveUponEvolving, MoveDTO.MoveIdentifier::toJson));
            return json;
        }
    }

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
