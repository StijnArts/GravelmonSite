package drai.dev.gravelmon.pokemon.attributes;

import org.apache.commons.lang3.*;

public class SpawnCondition {
    private SpawnConditionType conditionType;
    private String condition;

    public SpawnCondition(SpawnConditionType conditionType, String condition) {
        this.conditionType = conditionType;
        this.condition = condition;
    }

    public SpawnConditionType getConditionKind() {
        return conditionType;
    }

    public String getCondition() {
        return condition;
    }
    public void setCondition(String condition) {
        this.condition = condition;
    }

    @Override
    public String toString() {
        return StringUtils.capitalize(conditionType+ condition);
    }
}
