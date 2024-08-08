package com.danstep.model.mapper;

import com.danstep.model.dto.Score;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface ScoreMapper {

    void insertScore(Score score);
    List<Score> getScore();
}
