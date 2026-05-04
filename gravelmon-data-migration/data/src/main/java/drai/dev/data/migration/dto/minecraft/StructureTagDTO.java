package drai.dev.data.migration.dto.minecraft;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;
import drai.dev.data.migration.service.*;
import net.minecraft.resources.*;

import java.util.*;

public record StructureTagDTO(ResourceLocation resourceLocation, List<ResourceLocation> containsStructures) implements JsonSerializable {
    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        json.add("resourceLocation", MigrationUtil.resourceLocationToJson(resourceLocation));
        json.add("containsBiomes", MigrationUtil.listToJsonArray(containsStructures, MigrationUtil::resourceLocationToJson));
        return json;
    }
}
