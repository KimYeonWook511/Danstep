package com.danstep.game.model.service;

import com.danstep.game.model.dto.GameDTO;

public interface GameService {
    GameDTO getGame(Integer gameId);
}
