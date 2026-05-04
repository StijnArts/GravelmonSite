package drai.dev.data.migration.dto;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;

import javax.annotation.*;

public record SoundDTO(String name, @Nullable String s3Location, String madeBy) implements JsonSerializable {
    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        json.addProperty("name", name);
        json.addProperty("madeBy", madeBy);
        if (s3Location != null) json.addProperty("s3Location", s3Location);
        return json;
    }
}
