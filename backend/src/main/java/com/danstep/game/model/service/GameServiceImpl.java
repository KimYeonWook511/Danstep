package com.danstep.game.model.service;

import com.danstep.aws.model.service.S3Service;
import com.danstep.game.model.dto.GameDTO;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Base64;

@Service
public class GameServiceImpl implements GameService {
    private final S3Service s3Service;

    public GameServiceImpl(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @Override
    public GameDTO getGame(Integer gameId) {
//        GameDTO gameDTO = gameMapper.getGameInfo(gameId);
        GameDTO gameDTO = new GameDTO();
        gameDTO.setGameId(gameId);
        gameDTO.setFileUUID("90d2b0b7-8aed-4273-bd85-4e3a56ac8b7d.mp4");

        try {
            byte[] bytes = s3Service.getBytes("games", Integer.toString(gameDTO.getGameId()), gameDTO.getFileUUID());
            gameDTO.setFileLength(bytes.length);
            gameDTO.setFileData(Base64.getEncoder().encodeToString(bytes));

        } catch (IOException e) {
            e.printStackTrace();
        }

        return gameDTO;
    }
}
