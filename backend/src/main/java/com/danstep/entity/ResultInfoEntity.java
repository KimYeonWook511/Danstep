package com.danstep.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;


@Getter
@Setter
@Entity
@Table(name = "result_info")
public class ResultInfoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(cascade = CascadeType.REMOVE) // UserInfo 삭제 시 RankInfo도 삭제됨
    @JoinColumn(name = "user_info_id", nullable = false)
    private UserInfoEntity userInfoEntity; // UserInfo 엔티티와의 관계

    @ManyToOne(cascade = CascadeType.REMOVE) // GameInfo 삭제 시 RankInfo도 삭제됨
    @JoinColumn(name = "game_info_id", nullable = false)
    private GameInfoEntity gameInfoEntity; // GameInfo 엔티티와의 관계

    @Column(nullable = false, columnDefinition = "datetime default now()")
    private Date resultDate;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    private Integer perfect;

    @Column(nullable = false)
    private Integer great;

    @Column(nullable = false)
    private Integer good;

    @Column(nullable = false)
    private Integer bad;

    @Column(name = "max_combo", nullable = false)
    private Integer maxCombo;
}
