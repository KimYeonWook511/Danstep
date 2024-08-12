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

    @OneToOne(cascade = CascadeType.REMOVE) // ResultInfo 삭제 시 RankInfo도 삭제됨
    @JoinColumn(name = "result_info_id", nullable = false)
    private UserInfoEntity resultInfoEntity; // ResultInfo 엔티티와의 관계
}
