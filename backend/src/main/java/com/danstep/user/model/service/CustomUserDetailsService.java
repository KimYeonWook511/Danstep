package com.danstep.user.model.service;

import com.danstep.user.model.dto.CustomUserDetails;
import com.danstep.user.model.dto.UserDTO;
import com.danstep.user.model.mapper.UserMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserMapper userMapper;

    public CustomUserDetailsService(UserMapper userMapper) {

        this.userMapper = userMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        //DB에서 조회
        UserDTO userData = userMapper.findByUsername(username);

        if (userData != null) {

            //UserDetails에 담아서 return하면 AutneticationManager가 검증 함
            return new CustomUserDetails(userData);
        }

        return null;
    }
}