package com.danstep.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "user_info")
public class UserInfoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 20, unique = true)
    private String username;

    @Column(nullable = false, length = 200)
    private String password;

    @Column(nullable = false, length = 20, unique = true)
    private String nickname;

    @Column(nullable = false, columnDefinition = "datetime default now()")
    private Date registDate;

    @Column(length = 200)
    private String refresh;

    @Column(nullable = false, length = 20, columnDefinition = "varchar(20) default 'ROLE_USER'")
    private String role;

    @Column(length = 200)
    private String profile;
}
