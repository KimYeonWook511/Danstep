package com.danstep.game.model.service;

import com.danstep.game.model.dto.GameInfoDTO;
import com.danstep.game.model.dto.GameRankTop3DTO;

import java.util.List;

public interface GameService {
    List<GameInfoDTO> getAllGames();

    GameInfoDTO getGameInfo(Integer id);

    GameRankTop3DTO getGameRankTop3ById(Integer id);

    String getGamePose(Integer id);
}
