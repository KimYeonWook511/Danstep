package com.danstep.user.controller;

import com.danstep.jwt.JWTUtil;
import com.danstep.user.model.mapper.RefreshMapper;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class ReissueController {

    private final JWTUtil jwtUtil;

    private final RefreshMapper refreshMapper;

    public ReissueController(JWTUtil jwtUtil, RefreshMapper refreshMapper) {

        this.jwtUtil = jwtUtil;
        this.refreshMapper = refreshMapper;
    }

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {

        //get refresh token
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {

                if (cookie.getName().equals("refresh")) {
                    refresh = cookie.getValue();
                }
            }
        }

        if (refresh == null) {

            //response status code
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        //expired check
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {

            //response status code
            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refresh);

        if (!category.equals("refresh")) {

            //response status code
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        //DB에 저장되어 있는지 확인
        String username = jwtUtil.getUsername(refresh);
        String role = jwtUtil.getRole(refresh);
        String nickname = jwtUtil.getNickname(refresh);
        Boolean isExist = existsRefresh(username, refresh);

        if (!isExist) {
            //response body
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        //make new JWT
//        String newAccess = jwtUtil.createJwt("access", username, nickname, role, 600000L);
//        String newRefresh = jwtUtil.createJwt("refresh", username, nickname, role, 86400000L);
        String newAccess = jwtUtil.createJwt("access", username, nickname, role, 59000L); // 59초
        String newRefresh = jwtUtil.createJwt("refresh", username, nickname, role, 120000L); // 2분

        //Refresh 토큰 저장 DB에 기존의 Refresh 토큰 삭제 후 새 Refresh 토큰 저장
        reissueRefresh(username, newRefresh);

        //response
        response.setHeader("Authorization", "Bearer " + newAccess);
        response.addCookie(createCookie("refresh", refresh));

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private void reissueRefresh(String username, String refresh) {

        Map<String, Object> param = new HashMap<>();
        param.put("username", username);
        param.put("refresh", refresh);
        refreshMapper.insertRefresh(param);
    }

    private boolean existsRefresh(String username, String refresh) {

        Map<String, Object> param = new HashMap<>();
        param.put("username", username);
        param.put("refresh", refresh);
        return refreshMapper.existsByRefresh(param);
    }

//    private void addRefreshEntity(String username, String refresh, Long expiredMs) {
//
//        Date date = new Date(System.currentTimeMillis() + expiredMs);
//
//        RefreshEntity refreshEntity = new RefreshEntity();
//        refreshEntity.setUsername(username);
//        refreshEntity.setRefresh(refresh);
//        refreshEntity.setExpiration(date.toString());
//
//        refreshMapper.InsertRefresh(refreshEntity);
//    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
//        cookie.setMaxAge(24*60*60);
        cookie.setMaxAge(2*60);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }
}
