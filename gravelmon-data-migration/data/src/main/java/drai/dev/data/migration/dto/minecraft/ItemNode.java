package drai.dev.data.migration.dto.minecraft;

import net.minecraft.resources.*;

import javax.annotation.*;

public record ItemNode(ResourceLocation resourceLocation, @Nullable String s3TextureLocation, boolean isPlaceable,
                       @Nullable String inBattleEffect, @Nullable String rebalancedInBattleEffect) {
}
