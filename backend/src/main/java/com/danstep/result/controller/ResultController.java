package com.danstep.result.controller;

import com.danstep.jwt.JWTUtil;
import com.danstep.result.model.dto.GetReplayDTO;
import com.danstep.result.model.dto.GetUserResultDTO;
import com.danstep.result.model.dto.ReplayDTO;
import com.danstep.result.model.dto.SaveResultDTO;
import com.danstep.result.model.service.ResultService;
import com.danstep.user.model.dto.CustomUserDetails;
import org.apache.ibatis.annotations.Delete;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/results")
public class ResultController {

    private final ResultService resultService;
    private final JWTUtil jwtUtil;

    public ResultController(ResultService resultService, JWTUtil jwtUtil) {
        this.resultService = resultService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<?> saveResult(@AuthenticationPrincipal CustomUserDetails customUserDetails,
            @RequestBody SaveResultDTO saveResultDTO) {
        /*
        // @AuthenticationPrincipal로 바꿈!!
        // SecurityContext에서 Authentication 객체 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
            UserInfoDTO userInfo = customUserDetails.getUserInfoDTO();
            return ResponseEntity.ok(userInfo);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
         */

        if (customUserDetails == null) {
            String jsonResponse = "{\"message\": \"User not authenticated\", \"errorCode\": \"ACCESS_TOKEN_EXPIRED\"}";
            return new ResponseEntity<>(jsonResponse, HttpStatus.UNAUTHORIZED);
        }

        saveResultDTO.setUsername(customUserDetails.getUsername());
        resultService.saveResult(saveResultDTO);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getUserResults(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                                                 @PathVariable String username) {

        if (customUserDetails == null) {
            String jsonResponse = "{\"message\": \"User not authenticated\", \"errorCode\": \"ACCESS_TOKEN_EXPIRED\"}";
            return new ResponseEntity<>(jsonResponse, HttpStatus.UNAUTHORIZED);
        }

        System.out.println("getUserResults(custom): " + username+ "(" + customUserDetails.getUsername() + ")");

        return new ResponseEntity<>(resultService.getUserResults(customUserDetails.getUsername()), HttpStatus.OK);
    }

//  audiourl backgroundurl poseData myPoseData

    @GetMapping("/{username}/replay/{resultInfoId}")
    public ResponseEntity<?> getUserReplay(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                                      @PathVariable String username,
                                                      @PathVariable Integer resultInfoId) {

        if (customUserDetails == null) {
            String jsonResponse = "{\"message\": \"User not authenticated\", \"errorCode\": \"ACCESS_TOKEN_EXPIRED\"}";
            return new ResponseEntity<>(jsonResponse, HttpStatus.UNAUTHORIZED);
        }

        System.out.println("getUserResultPoseByResultInfoId: " + customUserDetails.getUsername());
        System.out.println("getUserResultPoseByResultInfoId: " + username);
        System.out.println("getUserResultPoseByResultInfoId: " + resultInfoId);

        ReplayDTO replayDTO = ReplayDTO.builder()
                .username(customUserDetails.getUsername())
                .resultInfoId(resultInfoId)
                .build();

        return new ResponseEntity<>(resultService.getUserReplay(replayDTO), HttpStatus.OK);
    }

    @DeleteMapping("/{username}/replay/{resultInfoId}")
    public ResponseEntity<?> deleteUserResultPose(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                                  @PathVariable String username,
                                                  @PathVariable Integer resultInfoId) {
        System.out.println("deleteUserResult Controller");
        if (customUserDetails == null) {
            String jsonResponse = "{\"message\": \"User not authenticated\", \"errorCode\": \"ACCESS_TOKEN_EXPIRED\"}";
            return new ResponseEntity<>(jsonResponse, HttpStatus.UNAUTHORIZED);
        }
        System.out.println("customUserDetails: " + customUserDetails.getUsername());

        ReplayDTO replayDTO = ReplayDTO.builder()
                .username(customUserDetails.getUsername())
                .resultInfoId(resultInfoId)
                .build();
        System.out.println("replayDTO: " + replayDTO.toString());
        resultService.deleteUserResultPost(replayDTO);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
