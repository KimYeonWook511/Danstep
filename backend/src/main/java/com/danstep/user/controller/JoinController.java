package com.danstep.user.controller;

import com.danstep.exception.InvalidNicknameException;
import com.danstep.exception.InvalidUsernameException;
import com.danstep.user.model.dto.JoinDTO;
import com.danstep.user.model.service.JoinService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class JoinController {

    @Value("username.regex")
    private String usernameRegex;

    @Value("nickname.regex")
    private String nicknameRegex;

    private final JoinService joinService;

    public JoinController(JoinService joinService) {

        this.joinService = joinService;
    }

    @PostMapping("/join")
    public ResponseEntity<String> joinProcess(@RequestBody JoinDTO joinDTO) {

        if (!joinDTO.getUsername().matches(usernameRegex) || joinDTO.getUsername().length() < 4 || joinDTO.getUsername().length() > 20) {
            throw new InvalidUsernameException("유효하지 않은 아이디입니다.");
        }

        if (!joinDTO.getNickname().matches(nicknameRegex) || joinDTO.getNickname().length() < 2 || joinDTO.getNickname().length() > 6) {
            throw new InvalidNicknameException("유효하지 않은 닉네임입니다.");
        }

        joinService.joinProcess(joinDTO);

        return new ResponseEntity<>("ok", HttpStatus.OK);
    }
}