package drai.dev.data.migration.dto.minecraft;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;
import drai.dev.data.migration.service.*;
import net.minecraft.resources.*;

public record StructureDTO(ResourceLocation resourceLocation) implements JsonSerializable {
    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        json.add("resourceLocation", MigrationUtil.resourceLocationToJson(resourceLocation));
        return json;
    }
}
