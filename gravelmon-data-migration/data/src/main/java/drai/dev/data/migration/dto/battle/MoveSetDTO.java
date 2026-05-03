package drai.dev.data.migration.dto.battle;

import javax.annotation.*;
import java.util.*;

public record MoveSetDTO(List<LevelUpEntry> levelUpMoves, List<MoveSetEntry> teachMoves, List<MoveSetEntry> eggMoves, List<MoveSetEntry> legacyMoves) {
    public enum MoveSetLearnType {
        LevelUp("LevelUp"),
        Teach("Teach"),
        Egg("Egg"),
        Legacy("Legacy");

        private final String name;
        MoveSetLearnType(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }

    public record MoveSetEntry(MoveDTO.MoveIdentifier moveName, MoveDTO.MoveCategory category, int basePower, int accuracy, String type,
                               @Nullable String rebalancedBasePower, @Nullable String rebalancedAccuracy, @Nullable String rebalancedType) {}
    public record LevelUpEntry(List<MoveSetEntry> moves, int level) {}
}
