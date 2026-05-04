package drai.dev.data.migration.dto.battle;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;
import drai.dev.data.migration.service.*;

import java.util.*;

public record TypeDTO(String name, List<String> resists, List<String> immunities, List<String> weaknesses,
                      List<String> introducedByGames) implements JsonSerializable {
    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        json.addProperty("name", name);
        json.add("resists", MigrationUtil.listToJsonArray(resists, JsonPrimitive::new));
        json.add("immunities", MigrationUtil.listToJsonArray(immunities, JsonPrimitive::new));
        json.add("weaknesses", MigrationUtil.listToJsonArray(weaknesses, JsonPrimitive::new));
        json.add("introducedByGames", MigrationUtil.listToJsonArray(introducedByGames, JsonPrimitive::new));
        return json;
    }
}
