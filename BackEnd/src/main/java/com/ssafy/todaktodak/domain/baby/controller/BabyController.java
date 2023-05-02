package com.ssafy.todaktodak.domain.baby.controller;

import com.ssafy.todaktodak.domain.baby.dto.BabyInfoResponseDto;
import com.ssafy.todaktodak.domain.baby.dto.BabyUpdateRequestDto;
import com.ssafy.todaktodak.domain.baby.service.BabyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@RestController
@RequiredArgsConstructor
public class BabyController {

    private final BabyService babyService;

    @GetMapping("/baby/info/{babyId}")
    public BabyInfoResponseDto BabyInfo(Authentication authentication, @PathVariable("babyId") Integer babyId){

//        UserDetails principal = (UserDetails) authentication.getPrincipal();

//        return babyService.babyInfoService(babyId,principal.getUsername());
        String userTestId = String.valueOf(1);
        return babyService.babyInfoService(babyId, userTestId);
    }

    @PatchMapping("/baby/info/update/{babyId}")
    public BabyInfoResponseDto BabyInfoUpdate(Authentication authentication,
                                              @PathVariable("babyId") Integer babyId,
                                              @RequestPart("babyImage") MultipartFile babyImage,
                                              @RequestPart(value="request") BabyUpdateRequestDto babyUpdateRequestDto)
            throws IOException {

//        UserDetails principal = (UserDetails) authentication.getPrincipal();
//
//        return babyService.babyInfoUpdateService(babyId,babyImage,babyUpdateRequestDto,principal.getUsername());
        String userTestId = String.valueOf(1);
        return babyService.babyInfoUpdateService(babyId,babyImage,babyUpdateRequestDto,userTestId);
    }



}