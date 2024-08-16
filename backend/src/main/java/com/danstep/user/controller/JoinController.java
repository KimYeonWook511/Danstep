package com.danstep.user.controller;

import com.danstep.exception.InvalidNicknameException;
import com.danstep.exception.InvalidPasswordException;
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

import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/v1/users")
public class JoinController {

    @Value("${username.regex}")
    private String usernameRegex;

    @Value("${nickname.regex}")
    private String nicknameRegex;

    @Value("${password.regex}")
    private String passwordRegex;

    private final JoinService joinService;

    public JoinController(JoinService joinService) {

        this.joinService = joinService;
    }

    @PostMapping("/join")
    public ResponseEntity<String> joinProcess(@RequestBody JoinDTO joinDTO) {

        String username = joinDTO.getUsername();
        if (!Pattern.compile(usernameRegex).matcher(username).matches()) {
            throw new InvalidUsernameException("유효하지 않은 아이디입니다.");
        }

        String nickname = joinDTO.getNickname();
        if (!Pattern.compile(nicknameRegex).matcher(nickname).matches()) {
            throw new InvalidNicknameException("유효하지 않은 닉네임입니다.");
        }

        String password = joinDTO.getPassword();
        if (!Pattern.compile(passwordRegex).matcher(password).matches()) {
            throw new InvalidPasswordException("유효하지 않은 비밀번호입니다.");
        }

        joinService.joinProcess(joinDTO);

        return new ResponseEntity<>("ok", HttpStatus.OK);
    }
}