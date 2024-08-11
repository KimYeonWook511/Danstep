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


        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/{username}")
    public ResponseEntity<?> updateUserByUsername(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                                  @ModelAttribute UpdateUserDTO updateUserDTO,
                                                  @RequestPart(name = "profile", required = false) MultipartFile profile) {

        System.out.println(customUserDetails.getUsername());
        System.out.println(customUserDetails.getPassword());
//        updateUserDTO.setUsername(customUserDetails.getUsername());
        System.out.println(updateUserDTO.toString());
        System.out.println(profile);

//        String originalProfile = profile.getOriginalFilename(); //profile의 원본 이름
//        int dotIdx = originalProfile.lastIndexOf('.');
//        String extension = originalProfile.substring(dotIdx);
//        String originalProfileName = originalProfile.substring(0, dotIdx);


        return new ResponseEntity<>(HttpStatus.OK);
    }

}
