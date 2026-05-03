package drai.dev.data.migration.dto;

import drai.dev.data.migration.dto.battle.*;
import drai.dev.data.migration.dto.pokemon.*;
import net.minecraft.resources.*;

import javax.annotation.*;
import java.util.*;

public record GameDTO(GameData gameData) {
    public record GameData(
            String name,
            String developer,
            String wikiPage,
            boolean isPermitted,

            @Nullable String s3LogoLocation,

            Map<Integer, PokemonDTO.PokemonIdentifier> introducesPokemon,
            List<ResourceLocation> introducesItem,
            List<MoveDTO.MoveIdentifier> introducesMoves,
            List<String> introducesAbilities,
            List<String> introducesAspects,
            List<String> introducesMechanics,
            List<String> introducesTypes
    ) {}
}
