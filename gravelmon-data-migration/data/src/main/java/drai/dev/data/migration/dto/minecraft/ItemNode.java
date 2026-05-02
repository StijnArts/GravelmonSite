package drai.dev.data.migration.dto.minecraft;

import net.minecraft.resources.*;

import java.util.*;

public record ItemNode(ResourceLocation resourceLocation, Optional<String> s3TextureLocation, boolean isPlaceable,
                       Optional<String> inBattleEffect, Optional<String> rebalancedInBattleEffect) {
}
