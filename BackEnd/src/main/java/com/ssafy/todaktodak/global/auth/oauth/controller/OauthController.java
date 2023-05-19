package com.ssafy.todaktodak.global.auth.oauth.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ssafy.todaktodak.global.auth.oauth.dto.LoginResponseDto;
import com.ssafy.todaktodak.global.auth.oauth.service.OauthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class OauthController {
    private final OauthService oauthService;

    @GetMapping("/login/oauth2/code/kakao")
    public ResponseEntity<LoginResponseDto> kakaoCallback(@RequestParam("code") String code) throws JsonProcessingException {
        return oauthService.verification(code);
    }

    @PostMapping("/token/reissue")
    public ResponseEntity<?> tokenReissue(HttpServletRequest request) {

        return oauthService.tokenReissue(request);
    }




}
