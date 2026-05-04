package drai.dev.data.migration.dto.pokemon;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;
import drai.dev.data.migration.dto.assets.*;
import drai.dev.data.migration.dto.assets.posing.*;
import drai.dev.data.migration.dto.spawning.*;
import drai.dev.data.migration.service.*;

import javax.annotation.*;
import java.util.*;

public record FormDTO(PokemonDTO.PokemonData pokemonData, FormData formData) implements JsonSerializable {
    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        json.add("pokemonData", pokemonData.toJson());
        json.add("formData", formData.toJson());
        return json;
    }

    public enum LiquidGlowMode {
        LAND
    }

    public record LightingData(
            int lightLevel,
            Optional<LiquidGlowMode> liquidGlowMode
    ) {
        public JsonElement toJson() {
            var json = new JsonObject();
            json.addProperty("lightLevel", lightLevel);
            liquidGlowMode.ifPresent(mode -> json.addProperty("liquidGlowMode", mode.name()));
            return json;
        }
    }

    public record FormData(
            @Nullable GenderDifferenceDTO genderDifference,
            @Nullable LightingData lightingData,
            @Nullable List<EvolutionDTO.EvolutionIdentifier> evolutions,
            PokemonDTO.PokemonIdentifier isFormOf,
            @Nullable List<String> affectedByMechanics,
            @Nullable ResolverDataDTO resolverData,
            @Nullable PosingFileDataDTO posingData,
            List<String> aspects,
            @Nullable List<SpawnDataDTO> spawnData
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            if (genderDifference != null) json.add("genderDifference", genderDifference.toJson());
            if (lightingData != null) json.add("lightingData", lightingData.toJson());
            if (evolutions != null) json.add("evolutions",
                    MigrationUtil.listToJsonArray(evolutions, EvolutionDTO.EvolutionIdentifier::toJson));

            json.add("isFormOf", isFormOf.toJson());
            if (affectedByMechanics != null) json.add("affectedByMechanics",
                    MigrationUtil.listToJsonArray(affectedByMechanics, JsonPrimitive::new));
            if (resolverData != null)json.add("resolverData", resolverData.toJson());
            if (posingData != null) json.add("posingData", posingData.toJson());
            json.add("aspects", MigrationUtil.listToJsonArray(aspects, JsonPrimitive::new));
            if (spawnData != null) json.add("spawnData",
                    MigrationUtil.listToJsonArray(spawnData, SpawnDataDTO::toJson));

            return json;
        }
    }
}
