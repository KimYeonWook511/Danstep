package com.danstep.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
@Table(name = "rank_info")
public class RankInfoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(cascade = CascadeType.REMOVE) // UserInfo 삭제 시 RankInfo도 삭제됨
    @JoinColumn(name = "user_info_id", nullable = false)
    private UserInfoEntity userInfoEntity; // UserInfo 엔티티와의 관계

    @ManyToOne(cascade = CascadeType.REMOVE) // GameInfo 삭제 시 RankInfo도 삭제됨
    @JoinColumn(name = "game_info_id", nullable = false)
    private GameInfoEntity gameInfoEntity; // GameInfo 엔티티와의 관계

    @Column(name = "high_score", nullable = false)
    private Integer highScore;
}
