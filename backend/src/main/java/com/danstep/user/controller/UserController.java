package com.danstep.user.controller;

import com.danstep.exception.InvalidNicknameException;
import com.danstep.jwt.JWTUtil;
import com.danstep.user.model.dto.CustomUserDetails;
import com.danstep.user.model.dto.UpdateUserDTO;
import com.danstep.user.model.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Value("nickname.regex")
    private String nicknameRegex;

    private final UserService userService;
    private final JWTUtil jwtUtil;

    public UserController(UserService userService, JWTUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getUser(@PathVariable String username,
                                     @AuthenticationPrincipal CustomUserDetails customUserDetails) {

        // 생각할 거리
        // 1. username과 customUserDetails의 username이 다르면 무슨 처리르 할 것인가!?
        // 2. customUserDetails는 null이 될 수 없는가?
        // 3. getUsername이 null이면 어떻게 되는가?

        if (customUserDetails == null) {
            String jsonResponse = "{\"message\": \"User not authenticated\", \"errorCode\": \"ACCESS_TOKEN_EXPIRED\"}";
            return new ResponseEntity<>(jsonResponse, HttpStatus.UNAUTHORIZED);
        }

        return new ResponseEntity<>(userService.getUserInfoByUsername(customUserDetails.getUsername()), HttpStatus.OK);
    }

    @PatchMapping("/{username}")
    public ResponseEntity<?> updateUserByUsername(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                                  @ModelAttribute UpdateUserDTO updateUserDTO,
                                                  @RequestPart(name = "profile", required = false) MultipartFile profile,
                                                  HttpServletRequest request,
                                                  HttpServletResponse response) {

        if (customUserDetails == null) {
            String jsonResponse = "{\"message\": \"User not authenticated\", \"errorCode\": \"ACCESS_TOKEN_EXPIRED\"}";
            return new ResponseEntity<>(jsonResponse, HttpStatus.UNAUTHORIZED);
        }

        if (profile == null) {
            // 프로필 적용시 확장자 검증 필수
        }

        if (!updateUserDTO.getNickname().matches(nicknameRegex) || updateUserDTO.getNickname().length() < 2 || updateUserDTO.getNickname().length() > 6) {
            throw new InvalidNicknameException("유효하지 않은 닉네임입니다.");
        }

        updateUserDTO.setUsername(customUserDetails.getUsername());
        userService.updateUserByUsername(updateUserDTO, profile);

        String oldAccessToken  = request.getHeader("Authorization").substring(7);
        String username = customUserDetails.getUsername();
        String nickname = updateUserDTO.getNickname().isEmpty() ? customUserDetails.getNickname() : updateUserDTO.getNickname();
        String role = jwtUtil.getRole(oldAccessToken);

        String access = jwtUtil.createJwt("access", username, nickname, role, 59000L); // 59초

        //응답 설정
        response.setHeader("Authorization", "Bearer " + access);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}
