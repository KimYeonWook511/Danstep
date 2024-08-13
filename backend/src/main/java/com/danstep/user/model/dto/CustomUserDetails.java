package com.danstep.user.model.dto;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private final UserInfoDTO userInfoDTO;

    public CustomUserDetails(UserInfoDTO userInfoDTO) {
        this.userInfoDTO = userInfoDTO;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        Collection<GrantedAuthority> collection = new ArrayList<>();

        collection.add(new GrantedAuthority() {

            @Override
            public String getAuthority() {

                return userInfoDTO.getRole();
            }
        });

        return collection;
    }

    @Override
    public String getPassword() {
        return userInfoDTO.getPassword();
    }

    @Override
    public String getUsername() {
        return userInfoDTO.getUsername();
    }

    // 내가 임의로 추가한 메소드
    public String getNickname() {
        return userInfoDTO.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {

        return true;
    }

    @Override
    public boolean isAccountNonLocked() {

        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {

        return true;
    }

    @Override
    public boolean isEnabled() {

        return true;
    }
}