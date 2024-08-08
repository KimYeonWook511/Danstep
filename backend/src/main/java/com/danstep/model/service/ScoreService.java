package com.danstep.model.service;

import com.danstep.model.dto.Score;
import com.danstep.model.mapper.ScoreMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoreService {

    private final ScoreMapper scoreMapper;

    public ScoreService(ScoreMapper scoreMapper) {
        this.scoreMapper = scoreMapper;
    }

    public void insertScore(Score score) {
         scoreMapper.insertScore(score);
    };

    public List<Score> getAllScore(){
        return scoreMapper.getScore();
    }
}
