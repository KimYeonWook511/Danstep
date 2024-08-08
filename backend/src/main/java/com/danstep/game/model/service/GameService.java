package com.danstep.game.model.service;

import com.danstep.game.model.dto.GameInfoDTO;

public interface GameService {
    GameInfoDTO getGameInfo(Integer id);

    Object getGamePose(Integer id);
}
