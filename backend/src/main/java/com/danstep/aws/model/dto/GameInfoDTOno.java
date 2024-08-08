package com.danstep.aws.model.dto;


import lombok.*;
import org.springframework.web.multipart.MultipartFile;



@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GameInfoDTOno {
    private Integer gameId;
    private String title;
    private String content;
    private String duration; // 재생 시간
    private String originalName;
    private String extension;

    private MultipartFile file;
}
