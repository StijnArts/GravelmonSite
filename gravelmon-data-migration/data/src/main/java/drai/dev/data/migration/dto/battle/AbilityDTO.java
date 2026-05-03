package drai.dev.data.migration.dto.battle;

import javax.annotation.*;

public record AbilityDTO(AbilityIdentifier identifier, @Nullable String description, @Nullable String rebalancedDescription) {
    public record AbilityIdentifier(String game, String name) {}
}
