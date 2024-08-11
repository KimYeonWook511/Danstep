package com.danstep.user.controller;

import com.danstep.user.model.dto.CustomUserDetails;
import com.danstep.user.model.dto.UpdateUserDTO;
import com.danstep.user.model.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getUser(@PathVariable String username,
                                     @AuthenticationPrincipal CustomUserDetails customUserDetails) {

        // 생각할 거리
        // 1. username과 customUserDetails의 username이 다르면 무슨 처리르 할 것인가!?
        // 2. customUserDetails는 null이 될 수 없는가?
        // 3. getUsername이 null이면 어떻게 되는가?

        return new ResponseEntity<>(userService.getUserInfoByUsername(customUserDetails.getUsername()), HttpStatus.OK);
    }

    @PatchMapping("/{username}")
    public ResponseEntity<?> updateUserByUsername(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                                  @ModelAttribute UpdateUserDTO updateUserDTO,
                                                  @RequestPart(name = "profile", required = false) MultipartFile profile) {

        if (profile == null) {
            // 확장자 검증 해야함!!

        }

        System.out.println(customUserDetails.getUsername());
        System.out.println(customUserDetails.getPassword());
        System.out.println(updateUserDTO.toString());
        System.out.println(profile);


        updateUserDTO.setUsername(customUserDetails.getUsername());
        userService.updateUserByUsername(updateUserDTO, profile);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}
