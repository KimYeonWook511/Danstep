package com.danstep.result.controller;

import com.danstep.jwt.JWTUtil;
import com.danstep.result.model.dto.GetReplayDTO;
import com.danstep.result.model.dto.GetUserResultDTO;
import com.danstep.result.model.dto.ReplayDTO;
import com.danstep.result.model.dto.SaveResultDTO;
import com.danstep.result.model.service.ResultService;
import com.danstep.user.model.dto.CustomUserDetails;
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

        saveResultDTO.setUsername(customUserDetails.getUsername());
        resultService.saveResult(saveResultDTO);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<GetUserResultDTO>> getUserResults(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                                                 @PathVariable String username) {

        System.out.println("getUserResults(custom): " + username+ "(" + customUserDetails.getUsername() + ")");

        return new ResponseEntity<>(resultService.getUserResults(customUserDetails.getUsername()), HttpStatus.OK);
    }

//  audiourl backgroundurl poseData myPoseData

    @GetMapping("/{username}/replay/{resultInfoId}")
    public ResponseEntity<GetReplayDTO> getUserReplay(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                                      @PathVariable String username,
                                                      @PathVariable Integer resultInfoId) {

        System.out.println("getUserResultPoseByResultInfoId: " + customUserDetails.getUsername());
        System.out.println("getUserResultPoseByResultInfoId: " + username);
        System.out.println("getUserResultPoseByResultInfoId: " + resultInfoId);

        ReplayDTO replayDTO = ReplayDTO.builder()
                .username(username)
                .resultInfoId(resultInfoId)
                .build();

        return new ResponseEntity<>(resultService.getUserReplay(replayDTO), HttpStatus.OK);
    }


}
