package com.danstep.game.model.service;

import com.danstep.exception.GameNotFoundException;
import com.danstep.game.model.dto.GameInfoDTO;
import com.danstep.game.model.dto.GameRankTop3DTO;
import com.danstep.game.model.dto.GetAllGameDTO;
import com.danstep.game.model.mapper.GameMapper;
import com.danstep.util.S3Util;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class GameServiceImpl implements GameService {

    private final GameMapper gameMapper;
    private final S3Util s3Util;

    public GameServiceImpl(S3Util s3Util, GameMapper gameMapper) {
        this.s3Util = s3Util;
        this.gameMapper = gameMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<GetAllGameDTO> getAllGames() {
        List<Integer> gamesIdList = gameMapper.getGamesId();

        if (gamesIdList == null || gamesIdList.isEmpty()) {
            throw new GameNotFoundException("Game does not exist");
        }

        List<GetAllGameDTO> gameList = new ArrayList<>();
        int len = 0;

        for (Integer id : gamesIdList) {
            GameInfoDTO gameInfoDTO = this.getGameInfo(id);
            List<GameRankTop3DTO> gameRankTop3List = this.getGameRankTop3ById(id);
            len = gameRankTop3List.size();

            for (int i = 0; i < len; i++) {
                gameRankTop3List.get(i).setRank(i + 1);
            }

            gameList.add(new GetAllGameDTO(gameInfoDTO, gameRankTop3List));
        }

        return gameList;
    }

    @Override
    @Transactional(readOnly = true)
    public GameInfoDTO getGameInfo(Integer id) {
        GameInfoDTO gameInfo = gameMapper.getGameInfoById(id);

        if (gameInfo == null) {
            throw new GameNotFoundException("Game not found with id " + id);
        }

        GameInfoDTO gameInfoDTO = GameInfoDTO.builder()
                .id(id)
                .title(gameInfo.getTitle())
                .uploadDate(gameInfo.getUploadDate())
                .playtime(gameInfo.getPlaytime())
                .level(gameInfo.getLevel())
                .build();

        // 썸네일 url 가져오기
        gameInfoDTO.setThumbnailUrl(s3Util.getPublicUrl("games", Integer.toString(id), gameInfo.getThumbnailFilename()));

        // mp3파일 url 가져오기
        gameInfoDTO.setAudioUrl(s3Util.getPublicUrl("games", Integer.toString(id), gameInfo.getAudioFilename()));

        // background mp4 url 가져오기
        gameInfoDTO.setBackgroundUrl(s3Util.getPublicUrl("games", Integer.toString(id), gameInfo.getBackgroundFilename()));

        return gameInfoDTO;
    }

    @Override
    @Transactional(readOnly = true)
    public List<GameRankTop3DTO> getGameRankTop3ById(Integer id) {
//        List<GameRankTop3DTO> gameRankTop3List = gameMapper.getGameRankTop3ById(id);

        return gameMapper.getGameRankTop3ById(id);
    }

    @Override
    public String getGamePose(Integer id) {
        GameInfoDTO gameInfo = gameMapper.getGameInfoById(id);

        return s3Util.getPublicJson("games", Integer.toString(id), gameInfo.getPoseFilename());
    }
}
