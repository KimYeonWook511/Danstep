package com.danstep.game.model.mapper;

import com.danstep.entity.GameInfoEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface GameMapper {
    GameInfoEntity getGameInfoById(Integer id);
}
