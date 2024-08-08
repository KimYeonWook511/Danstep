package com.danstep.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
@Entity
public class UserInfo {

    @Id
    private Integer id;
    private String username;
    private String password;
    private String nickname;
    private String refresh;
    private Date registDate;
    private String role; // 나중에 FK로 해줘야함
    private String profile;
}