package com.danstep.jwt;

import com.danstep.user.model.dto.CustomUserDetails;
import com.danstep.user.model.mapper.RefreshMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    //JWTUtil 주입
    private final JWTUtil jwtUtil;

    private final RefreshMapper refreshMapper;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, RefreshMapper refreshMapper) {
        setFilterProcessesUrl("/api/v1/users/login"); // 로그인 경로 변경
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshMapper = refreshMapper;
    }

    // 인증
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        //클라이언트 요청에서 username, password 추출
        String username = obtainUsername(request);
        String password = obtainPassword(request);
        System.out.println("LoginFilter - attempAuthentication: " + username + " | " + password);
        //스프링 시큐리티에서 username과 password를 검증하기 위해서는 token에 담아야 함
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);

        //token에 담은 검증을 위한 AuthenticationManager로 전달
//        return authenticationManager.authenticate(authToken);
        try {
            // token에 담은 검증을 위한 AuthenticationManager로 전달
            return authenticationManager.authenticate(authToken);
        } catch (AuthenticationException e) {
            // 실패 처리 메소드 호출
            System.out.println("Authentication failed for user: " + username);
            this.unsuccessfulAuthentication(request, response, e);

            return null;
        }
    }

    //로그인 성공시 실행하는 메소드 (여기서 JWT를 발급하면 됨)
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {

        //유저 정보
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal(); // CustomUserDetails로 캐스팅
        String username = authentication.getName();
//        String username = userDetails.getUsername();
        String nickname = userDetails.getNickname();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        //토큰 생성
//        String access = jwtUtil.createJwt("access", username, nickname, role, 600000L);
//        String refresh = jwtUtil.createJwt("refresh", username, nickname, role, 86400000L);
        String access = jwtUtil.createJwt("access", username, nickname, role, 120000L); // 2분
        String refresh = jwtUtil.createJwt("refresh", username, nickname, role, 59000L); // 59초

        //Refresh 토큰 저장
        addRefresh(username, refresh);

        //응답 설정
        response.setHeader("Authorization", "Bearer " + access);
        response.addCookie(createCookie("refresh", refresh));
        response.setStatus(HttpStatus.OK.value());
    }

    //로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
        System.out.println("LoginFilter - unsuccessfulAuthentication: " + failed.getMessage());
        //로그인 실패시 401 응답 코드 반환
        response.setStatus(401);
    }

    private void addRefresh(String username, String refresh) {

        Map<String, Object> param = new HashMap<>();
        param.put("username", username);
        param.put("refresh", refresh);

//        for (Object o : param.entrySet()) {
//            System.out.println(o.toString());
//        }

        refreshMapper.insertRefresh(param);
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
        cookie.setMaxAge(24*60*60);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }

//    private String createCookie(String key, String value) {
//
//        ResponseCookie cookie = ResponseCookie.from(key, value)
//                .path("/")
//                .sameSite("None")
//                .httpOnly(true)
//                .maxAge(24 * 60 * 60)
//                .build();
//
//        return cookie.toString();
//    }
}