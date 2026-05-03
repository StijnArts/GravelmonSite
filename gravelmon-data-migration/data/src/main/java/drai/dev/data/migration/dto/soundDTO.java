package drai.dev.data.migration.dto;

import javax.annotation.*;

public record soundDTO(String name, @Nullable String s3Location, String madeBy) {
}
