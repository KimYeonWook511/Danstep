package com.danstep.game.model.service;

import com.danstep.game.model.dto.GameInfoDTO;

import java.util.List;

public interface GameService {
    List<GameInfoDTO> getAllGames();

    GameInfoDTO getGameInfo(Integer id);

    Object getGamePose(Integer id);
}
