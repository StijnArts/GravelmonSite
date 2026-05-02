package drai.dev.data.migration.dto.minecraft;

import net.minecraft.resources.*;

import java.util.*;

public record ModDTO(String name) {
    public record ModAddsDTO(String modId, List<ResourceLocation> entityResourceLocations) {
    }
}
