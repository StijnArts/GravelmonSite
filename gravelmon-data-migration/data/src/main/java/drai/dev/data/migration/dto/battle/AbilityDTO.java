package drai.dev.data.migration.dto.battle;

import java.util.*;

public record AbilityDTO(AbilityIdentifier identifier, Optional<String> description, Optional<String> rebalancedDescription) {
    public record AbilityIdentifier(String game, String name) {}
}
