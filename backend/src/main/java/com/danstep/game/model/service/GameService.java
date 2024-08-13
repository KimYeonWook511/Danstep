package com.danstep.game.model.service;

import com.danstep.game.model.dto.GameInfoDTO;
import com.danstep.game.model.dto.GameRankTop3DTO;
import com.danstep.game.model.dto.GetAllGameDTO;

import java.util.List;

public interface GameService {
    List<GetAllGameDTO> getAllGames();

    GameInfoDTO getGameInfo(Integer id);

    List<GameRankTop3DTO> getGameRankTop3ById(Integer id);

    String getGamePose(Integer id);
}
