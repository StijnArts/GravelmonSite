package drai.dev.data.migration.dto.assets;

import drai.dev.data.migration.dto.assets.posing.*;

import javax.annotation.*;

public record AnimationDTO(String name, String primaryPoseType) {
    public record Animation(@Nullable String PK, @Nullable PosingFileDataDTO.ConditionalAnimation conditionalAnimation) {
        public Animation {
            if(PK == null && conditionalAnimation == null) throw new IllegalArgumentException("Must have PK or conditionalAnimation");
        }
    }
}
