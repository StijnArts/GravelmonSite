package drai.dev.data.migration.service;

import com.google.gson.*;
import net.minecraft.resources.*;
import org.apache.commons.lang3.*;

import java.util.*;
import java.util.function.*;

public class MigrationUtil {

    public static String getEnvOrThrow(String key) {
        String value = System.getenv(key);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("Missing required environment variable: " + key);
        }
        return value;
    }

    public static <T extends Number> JsonElement rangeToJson(NumberRange<T> range) {
        var json = new JsonObject();
        json.addProperty("min", range.getMinimum());
        json.addProperty("max", range.getMaximum());
        return json;
    }

    public static <T> JsonArray listToJsonArray(List<T> list, Function<T, JsonElement> mapper) {
        var json = new JsonArray();

        for (var item : list) {
            json.add(mapper.apply(item));
        }
        return json;
    }

    public static <K, V> JsonElement mapToJsonArray(Map<K, V> typeGemCost, Function<K, JsonElement> keyMapper, Function<V, JsonElement> valueMapper) {
        var json = new JsonArray();
        for (var entry : typeGemCost.entrySet()) {
            var jsonEntry = new JsonObject();
            jsonEntry.add("key", keyMapper.apply(entry.getKey()));
            jsonEntry.add("value", valueMapper.apply(entry.getValue()));
            json.add(jsonEntry);
        }
        return json;
    }

    public static JsonObject resourceLocationToJson(ResourceLocation resourceLocation) {
        var json = new JsonObject();
        json.addProperty("namespace", resourceLocation.getNamespace());
        json.addProperty("path", resourceLocation.getPath());
        return json;
    }
}
