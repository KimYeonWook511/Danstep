package com.danstep.result.model.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SaveResultPoseDTO {
    private Integer id;
    private Integer resultInfoId;
    private String poseFilename;
}
