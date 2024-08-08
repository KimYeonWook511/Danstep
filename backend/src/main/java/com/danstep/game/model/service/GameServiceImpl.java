package com.danstep.game.model.service;

import com.danstep.aws.model.service.S3Service;
import com.danstep.entity.GameInfoEntity;
import com.danstep.game.model.dto.GameInfoDTO;
import com.danstep.game.model.mapper.GameMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public GameInfoDTO getGameInfo(Integer id) {
        System.out.println("서비스까지 호출");
        GameInfoEntity gameInfoEntity = gameMapper.getGameInfoById(id);
        System.out.println("통과");

        if (gameInfoEntity == null) { return null; }

        GameInfoDTO gameInfoDTO = GameInfoDTO.builder()
                .id(id)
                .title(gameInfoEntity.getTitle())
                .uploadDate(gameInfoEntity.getUploadDate())
                .playtime(gameInfoEntity.getPlaytime())
                .level(gameInfoEntity.getLevel())
                .build();

        // 썸네일 url 가져오기
        gameInfoDTO.setThumbnailUrl(s3Service.getPublicUrl("games", Integer.toString(id), gameInfoEntity.getThumbnailFilename()));

        // mp3파일 url 가져오기
        gameInfoDTO.setAudioUrl(s3Service.getPublicUrl("games", Integer.toString(id), gameInfoEntity.getAudioFilename()));

        return gameInfoDTO;
    }

    @Override
    public Object getGamePose(Integer id) {
        GameInfoEntity gameInfoEntity = gameMapper.getGameInfoById(id);

        try {
            // Json파일 가져오기
            return s3Service.getPublicJson("games", Integer.toString(id), gameInfoEntity.getPoseFilename());

        } catch (RuntimeException e) {
            // GET 요청 보내면서 문제 생김
            // 처리할 로직 작성해야함!
            return null;
        }
    }
}
