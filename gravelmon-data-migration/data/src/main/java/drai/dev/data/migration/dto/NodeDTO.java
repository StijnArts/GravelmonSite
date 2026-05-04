package drai.dev.data.migration.dto;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;

public record NodeDTO(String name) implements JsonSerializable {

    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        json.addProperty("name", name);
        return json;
    }
}
