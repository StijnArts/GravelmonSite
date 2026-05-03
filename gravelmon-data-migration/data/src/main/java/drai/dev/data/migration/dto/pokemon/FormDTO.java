package drai.dev.data.migration.dto.pokemon;

import drai.dev.data.migration.dto.assets.*;
import drai.dev.data.migration.dto.assets.posing.*;
import drai.dev.data.migration.dto.spawning.*;

import javax.annotation.*;
import java.util.*;

public record FormDTO(PokemonDTO.PokemonData pokemonData, FormData formData)  {
    public enum LiquidGlowMode {
        LAND
    }

    public record LightingData(
            int lightLevel,
            Optional<LiquidGlowMode> liquidGlowMode
    ) {}
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
    ) {}
}
