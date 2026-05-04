package drai.dev.data.migration.dto.minecraft;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;
import drai.dev.data.migration.service.*;
import net.minecraft.resources.*;

import javax.annotation.*;

public record ItemNode(String name, ResourceLocation resourceLocation, @Nullable String s3TextureLocation, boolean isPlaceable,
                       @Nullable String inBattleEffect,
                       @Nullable String rebalancedInBattleEffect) implements JsonSerializable {

    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        json.addProperty("name", name);
        json.add("resourceLocation", MigrationUtil.resourceLocationToJson(resourceLocation));
        json.addProperty("isPlaceable", isPlaceable);
        if (s3TextureLocation != null) {
            json.addProperty("s3TextureLocation", s3TextureLocation);
        }
        if (inBattleEffect != null) {
            json.addProperty("inBattleEffect", inBattleEffect);
        }
        if (rebalancedInBattleEffect != null) {
            json.addProperty("rebalancedInBattleEffect", rebalancedInBattleEffect);
        }

        return json;
    }
}
