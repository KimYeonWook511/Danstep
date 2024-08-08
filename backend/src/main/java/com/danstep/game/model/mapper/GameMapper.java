package com.danstep.game.model.mapper;

import com.danstep.entity.GameInfoEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface GameMapper {
    List<Integer> getGamesId();

    GameInfoEntity getGameInfoById(Integer id);
}
