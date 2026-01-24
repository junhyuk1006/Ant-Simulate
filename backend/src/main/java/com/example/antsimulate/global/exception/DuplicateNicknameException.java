package com.example.antsimulate.global.exception;

public class DuplicateNicknameException extends RuntimeException {
    public DuplicateNicknameException() {
        super("이미 사용 중인 닉네임입니다.");
    }
}
