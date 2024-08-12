package com.danstep.exception;

public class ReplayNotFoundException extends RuntimeException {

    public ReplayNotFoundException(String message) {
        super(message);
    }

    public ReplayNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
