package com.danstep.controller;

import com.danstep.model.dto.ResponseDTO;
import com.danstep.model.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/users")
public class UserController {

    @Autowired
    UserService userService;

    @RequestMapping(value = "/findAll", method = RequestMethod.POST)
    public ResponseEntity<?> findAll() {
        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setResultCode("S0001");
        responseDTO.setRes(userService.findAll());
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return new ResponseEntity<>("hi!", HttpStatus.OK);
    }
}