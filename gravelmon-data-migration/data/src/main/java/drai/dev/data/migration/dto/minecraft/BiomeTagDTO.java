package drai.dev.data.migration.dto.minecraft;

import net.minecraft.resources.*;

import java.util.*;

public record BiomeTagDTO(ResourceLocation resourceLocation, List<ResourceLocation> containsBiomes) {
}
