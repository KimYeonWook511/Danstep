package com.danstep.exception.handler;

import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.danstep.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AmazonS3Exception.class)
    public ResponseEntity<String> handleAmazonS3Exception(AmazonS3Exception ex) {
        // S3 관련 예외 처리
        return new ResponseEntity<>("S3 Error: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(UserNotFoundException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND); // 404 Not Found
    }

    @ExceptionHandler(GameNotFoundException.class)
    public ResponseEntity<String> handleGameNotFoundException(GameNotFoundException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND); // 404
    }

    @ExceptionHandler(ReplayNotFoundException.class)
    public ResponseEntity<String> handleReplayNotFoundException(ReplayNotFoundException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND); // 404
    }

    @ExceptionHandler(InvalidUsernameException.class)
    public ResponseEntity<String> handleInvalidUsernameException(InvalidUsernameException e) {
        String jsonResponse = "{\"message\": \"" + e.getMessage() + "\", \"errorCode\": \"4000\"}";
        return new ResponseEntity<>(jsonResponse, HttpStatus.BAD_REQUEST); // 400
    }

    @ExceptionHandler(InvalidNicknameException.class)
    public ResponseEntity<String> handleInvalidNicknameException(InvalidNicknameException e) {
        String jsonResponse = "{\"message\": \"" + e.getMessage() + "\", \"errorCode\": \"4001\"}";
        return new ResponseEntity<>(jsonResponse, HttpStatus.BAD_REQUEST); // 400
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<String> handleInvalidPasswordException(InvalidPasswordException e) {
        String jsonResponse = "{\"message\": \"" + e.getMessage() + "\", \"errorCode\": \"4002\"}";
        return new ResponseEntity<>(jsonResponse, HttpStatus.BAD_REQUEST); // 400
    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<String> handleUsernameAlreadyExistsException(UsernameAlreadyExistsException e) {
        String jsonResponse = "{\"message\": \"" + e.getMessage() + "\", \"errorCode\": \"4003\"}";
        return new ResponseEntity<>(jsonResponse, HttpStatus.CONFLICT); // 409
    }

    @ExceptionHandler(NicknameAlreadyExistsException.class)
    public ResponseEntity<String> handleNicknameAlreadyExistsException(NicknameAlreadyExistsException e) {
        String jsonResponse = "{\"message\": \"" + e.getMessage() + "\", \"errorCode\": \"4004\"}";
        return new ResponseEntity<>(jsonResponse, HttpStatus.CONFLICT); // 409
    }

    @ExceptionHandler(PasswordMismatchException.class)
    public ResponseEntity<String> handlePasswordMismatchException(PasswordMismatchException e) {
        String jsonResponse = "{\"message\": \"" + e.getMessage() + "\", \"errorCode\": \"4005\"}";
        return new ResponseEntity<>(jsonResponse, HttpStatus.UNAUTHORIZED); // 401
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
    }

}
