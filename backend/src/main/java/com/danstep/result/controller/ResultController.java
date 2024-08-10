package com.danstep.result.controller;

import com.danstep.result.model.dto.ResultInfoDTO;
import com.danstep.result.model.service.ResultService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @PostMapping
    public ResponseEntity<?> saveResult(@RequestBody ResultInfoDTO resultInfoDTO) {
        resultService.saveResult(resultInfoDTO);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
