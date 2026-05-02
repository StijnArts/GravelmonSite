package drai.dev.data.migration.dto.minecraft;

import net.minecraft.resources.*;

import java.util.*;

public record StructureTagDTO(ResourceLocation resourceLocation, List<ResourceLocation> containsStructures) {
}
