package com.danstep.game.model.mapper;

import com.danstep.game.model.dto.GameInfoDTO;
import com.danstep.game.model.dto.GameRankTop3DTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface GameMapper {

    List<Integer> getGamesId();

    GameInfoDTO getGameInfoById(Integer id);

    GameRankTop3DTO getGameRankTop3ById(Integer id);

}
