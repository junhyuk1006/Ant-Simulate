package com.example.antsimulate.domain.auth.service;

import com.example.antsimulate.domain.auth.dto.LoginRequest;
import com.example.antsimulate.domain.auth.dto.LoginResponse;
import com.example.antsimulate.domain.auth.dto.SignupRequest;
import com.example.antsimulate.domain.auth.dto.SignupResponse;
import com.example.antsimulate.domain.user.entity.User;
import com.example.antsimulate.domain.user.repository.UserRepository;
import com.example.antsimulate.global.exception.DuplicateEmailException;
import com.example.antsimulate.global.exception.DuplicateNicknameException;
import com.example.antsimulate.global.exception.LoginFailedException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public SignupResponse signup(SignupRequest request){
        String email = request.getEmail();
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        String name = request.getName();
        String nickname = request.getNickname();

        if(userRepository.existsByEmail(email)){
            throw new DuplicateEmailException();
        }

        if(userRepository.existsByNickname(nickname)){
            throw new DuplicateNicknameException();
        }

        User user = User.builder().email(email).password(encodedPassword).name(name).nickname(nickname).build();
        User savedUser = userRepository.save(user);

        return new SignupResponse(savedUser.getName(), savedUser.getNickname());
    }

    public LoginResponse login(LoginRequest request){
        User user = userRepository.findByEmail(request.getEmail()).
                orElseThrow(LoginFailedException::new);

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new LoginFailedException();
        }

        return new LoginResponse(user.getName(), user.getNickname());
    }
}
