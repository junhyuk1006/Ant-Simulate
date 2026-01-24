package com.example.antsimulate.domain.auth.controller;

import com.example.antsimulate.domain.auth.dto.LoginRequest;
import com.example.antsimulate.domain.auth.dto.LoginResponse;
import com.example.antsimulate.domain.auth.dto.SignupRequest;
import com.example.antsimulate.domain.auth.dto.SignupResponse;
import com.example.antsimulate.domain.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@RequestBody SignupRequest request){
        SignupResponse response = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response); // 상태코드 201
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request){
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response); // 상태코드 200
    }
}
