package com.danstep.game.model.service;

import com.danstep.aws.model.service.S3Service;
import com.danstep.entity.GameInfoEntity;
import com.danstep.game.model.dto.GameInfoDTO;
import com.danstep.game.model.mapper.GameMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class GameServiceImpl implements GameService {
    private final S3Service s3Service;
    private final GameMapper gameMapper;

    public GameServiceImpl(S3Service s3Service, GameMapper gameMapper) {
        this.s3Service = s3Service;
        this.gameMapper = gameMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<GameInfoDTO> getAllGames() {
        List<Integer> gamesIdList = gameMapper.getGamesId();

        if (gamesIdList == null || gamesIdList.isEmpty()) {
            System.out.println("게임 존재하지 않음!");
            return null;
        }

        List<GameInfoDTO> gameInfoDTOList = new ArrayList<>();
        for (Integer id : gamesIdList) {
            gameInfoDTOList.add(getGameInfo(id));
        }

        return gameInfoDTOList;
    }

    @Override
    @Transactional(readOnly = true)
    public GameInfoDTO getGameInfo(Integer id) {
        GameInfoDTO gameInfo = gameMapper.getGameInfoById(id);

        if (gameInfo == null) { return null; }

        GameInfoDTO gameInfoDTO = GameInfoDTO.builder()
                .id(id)
                .title(gameInfo.getTitle())
                .uploadDate(gameInfo.getUploadDate())
                .playtime(gameInfo.getPlaytime())
                .level(gameInfo.getLevel())
                .build();

        // 썸네일 url 가져오기
        gameInfoDTO.setThumbnailUrl(s3Service.getPublicUrl("games", Integer.toString(id), gameInfo.getThumbnailFilename()));

        // mp3파일 url 가져오기
        gameInfoDTO.setAudioUrl(s3Service.getPublicUrl("games", Integer.toString(id), gameInfo.getAudioFilename()));

        return gameInfoDTO;
    }

    @Override
    public String getGamePose(Integer id) {
        GameInfoDTO gameInfo = gameMapper.getGameInfoById(id);

        try {
            // Json파일 가져오기
            return s3Service.getPublicJson("games", Integer.toString(id), gameInfo.getPoseFilename());

        } catch (RuntimeException e) {
            // GET 요청 보내면서 문제 생김
            // 처리할 로직 작성해야함!
            return null;
        }
    }
}
