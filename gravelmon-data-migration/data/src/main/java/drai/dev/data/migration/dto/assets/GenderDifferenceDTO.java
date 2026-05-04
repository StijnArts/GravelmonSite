package drai.dev.data.migration.dto.assets;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;

public record GenderDifferenceDTO(boolean hasGenderedTexture, boolean hasGenderedModel, boolean hasGenderedAnimation) implements JsonSerializable {
    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        json.addProperty("hasGenderedTexture", hasGenderedTexture);
        json.addProperty("hasGenderedModel", hasGenderedModel);
        json.addProperty("hasGenderedAnimation", hasGenderedAnimation);
        return json;
    }
}
