package com.danstep.result.controller;

import com.danstep.jwt.JWTUtil;
import com.danstep.result.model.dto.GetResultInfoDTO;
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

        System.out.println("게임 결과 저장 username: " + customUserDetails.getUsername());


        saveResultDTO.setUsername(customUserDetails.getUsername());
        resultService.saveResult(saveResultDTO);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<GetResultInfoDTO>> getUserResults(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        return new ResponseEntity<>(resultService.getUserResultsByUsername(customUserDetails.getUsername()), HttpStatus.OK);
    }


}
