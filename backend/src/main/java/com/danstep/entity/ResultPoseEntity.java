package com.danstep.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "result_pose")
public class ResultPoseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "result_info_id", nullable = false)
    private ResultInfoEntity resultInfoEntity; // ResultInfo 엔티티와의 관계

    @Column(name = "pose_filename", nullable = false)
    private String poseFilename;
}
