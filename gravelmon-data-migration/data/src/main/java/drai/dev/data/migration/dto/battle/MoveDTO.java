package drai.dev.data.migration.dto.battle;

import kotlin.*;

import java.util.*;

public record MoveDTO(MoveIdentifier moveIdentifier, MoveData moveData, Optional<MoveData> rebalancedMoveData, List<String> moveLabels) {
    public record MoveIdentifier(String game, String name) {
    }

    public record MoveType(String type, boolean isRebalanced) {
    }

    public enum MoveCategory {
        Physical,
        Special,
        Status;
    }

    public enum MoveRange {
        SingleTarget,
        Self,
        SingleAlly,
        AllPokemon,
        AllAllies,
        AllOpponents,
        RandomOpponent,
        EntireField,
        OpponentSide,
        UserSide,
        Varies
    }

    public record MoveData(
            Pair<MoveType, MoveType> moveTypes,
            int powerPoints,
            int basePower,
            int priority,
            int accuracy,
            MoveRange moveRange,
            MoveCategory moveCategory,
            Optional<String> description,
            Optional<String> zMoveEffect,
            Map<String, Integer> typeGemCost,
            Optional<List<String>> associatedWeathers,
            Optional<List<String>> associatedTerrain,
            Optional<List<String>> associatedFieldEffects
    ) {
    }
}
