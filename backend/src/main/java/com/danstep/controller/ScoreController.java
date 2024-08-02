package com.danstep.controller;

import com.danstep.model.dto.Score;
import com.danstep.model.service.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/scores")
@CrossOrigin(origins = "http://localhost:3000") // Adjust the origin to match your React app's URL
public class ScoreController {


    @Autowired
    private final ScoreService scoreService;

    public ScoreController(ScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @PostMapping
    public void receiveScores(@RequestBody Score score) {
        // Here you can process the received scores, save them to the database, etc.
        scoreService.insertScore(score);
        System.out.println("Received scores: " + score);
    }

    @GetMapping
    public List<Score> getScores() {
        return scoreService.getAllScore();
    }
}
