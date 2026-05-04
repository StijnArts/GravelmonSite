package drai.dev.data.migration.dto;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;
import drai.dev.data.migration.dto.battle.*;
import drai.dev.data.migration.dto.pokemon.*;
import drai.dev.data.migration.service.*;
import net.minecraft.resources.*;

import javax.annotation.*;
import java.util.*;

public record GameDTO(GameData gameData) implements JsonSerializable {

    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        json.add("gameData", gameData.toJson());
        return json;
    }

    public record GameData(
            String name,
            @Nullable String nameSpace,
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
    ) implements JsonSerializable {

        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.addProperty("name", name);
            if(nameSpace != null) json.addProperty("nameSpace", nameSpace);
            json.addProperty("developer", developer);
            json.addProperty("wikiPage", wikiPage);
            json.addProperty("isPermitted", isPermitted);

            if (s3LogoLocation != null) json.addProperty("s3LogoLocation", s3LogoLocation);
            json.add("introducesPokemon", MigrationUtil.mapToJsonArray(introducesPokemon,
                    JsonPrimitive::new, PokemonDTO.PokemonIdentifier::toJson));
            json.add("introducesItem", MigrationUtil.listToJsonArray(introducesItem, MigrationUtil::resourceLocationToJson));
            json.add("introducesMoves", MigrationUtil.listToJsonArray(introducesMoves, MoveDTO.MoveIdentifier::toJson));
            json.add("introducesAbilities", MigrationUtil.listToJsonArray(introducesAbilities, JsonPrimitive::new));
            json.add("introducesAspects", MigrationUtil.listToJsonArray(introducesAspects, JsonPrimitive::new));
            json.add("introducesMechanics", MigrationUtil.listToJsonArray(introducesMechanics, JsonPrimitive::new));
            json.add("introducesTypes", MigrationUtil.listToJsonArray(introducesTypes, JsonPrimitive::new));

            return json;
        }
    }
}
