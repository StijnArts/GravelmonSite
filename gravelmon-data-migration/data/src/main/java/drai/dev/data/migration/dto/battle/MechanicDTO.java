package drai.dev.data.migration.dto.battle;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;
import drai.dev.data.migration.dto.pokemon.*;
import drai.dev.data.migration.service.*;
import net.minecraft.resources.*;

import javax.annotation.*;
import java.util.*;

public record MechanicDTO(String name, @Nullable String description, @Nullable List<ResourceLocation> usesItems,
                          @Nullable List<PokemonDTO.PokemonIdentifier> affectsForms) implements JsonSerializable {
    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        json.addProperty("name", name);
        json.addProperty("description", description);
        if (usesItems != null) json.add("usesItems", MigrationUtil.listToJsonArray(usesItems, MigrationUtil::resourceLocationToJson));
        if (affectsForms != null) json.add("affectsForms", MigrationUtil.listToJsonArray(affectsForms, PokemonDTO.PokemonIdentifier::toJson));
        return json;
    }
}
