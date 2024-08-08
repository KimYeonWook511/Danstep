package com.danstep.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
@Entity
@Table(name = "game_info") // 테이블 이름 설정
public class GameInfoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID 자동 생성 전략
    private Integer id; // 게임 ID

    @Column(nullable = false, length = 200) // 필수 | 최대 길이 200
    private String title; // 게임 제목

    @Column(name = "upload_date", nullable = false, columnDefinition = "datetime default now()")
    private Date uploadDate; // 업로드 날짜

    @Column(nullable = false)
    private Integer playtime; // 플레이 시간

    @Column(name = "thumbnail_filename", nullable = false, length = 200)
    private String thumbnailFilename; // 썸네일 파일 이름

    @Column(name = "audio_filename", nullable = false, length = 200)
    private String audioFilename; // 오디오 파일 이름

    @Column(name = "pose_filename", nullable = false, length = 200)
    private String poseFilename; // 포즈 파일 이름

    @Column(name = "video_filename", nullable = false, length = 200)
    private String videoFilename; // 비디오 파일 이름

    @Column(nullable = false)
    private Integer level; // 게임 레벨
}
