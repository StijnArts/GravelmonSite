package drai.dev.data.migration.dto.assets;

import com.cobblemon.mod.common.entity.*;
import kotlin.*;

import java.util.*;

public record ResolverDataDTO(List<ResolverLayer> layers, Optional<Pair<String, String>> variationForAspectChoice) {
    public enum CommonLayerNames {
        Emissive("emissive"),
        TransparentEmissive("transparentEmissive"),
        Tail("tail"),
        Transparent_Emissive("transparent_emissive"),
        Emissive2("emissive2"),
        Flame("flame"),
        Glow("glow");

        public final String name;

        CommonLayerNames(String name) {
            this.name = name;
        }
        public String getName() {
            return name;
        }
    }

    public record ResolverLayer(String name, String textureName, Optional<Boolean> isEmissive, Optional<Boolean> isTranslucent,
                                Optional<Integer> framerate, boolean loops, Optional<Integer> numberOfFrames) {}
}