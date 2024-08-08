package com.danstep.game.contoller;

import com.danstep.game.model.dto.GameInfoDTO;
import com.danstep.game.model.service.GameService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/games")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameInfoDTO> getGame(@PathVariable Integer id) {
        System.out.println("getGame 호출!");

        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        GameInfoDTO gameInfoDTO = gameService.getGameInfo(id);

        if (gameInfoDTO == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(gameInfoDTO, HttpStatus.OK);
    }

    @GetMapping("/{id}/pose")
    public ResponseEntity<Object> getGamePose(@PathVariable Integer id) {
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Object poseData = gameService.getGamePose(id);

        if (poseData == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(poseData, HttpStatus.OK);
    }

    // 우선순위 후순위
//    @PostMapping
//    public ResponseEntity<GameDTO> createGame(@RequestBody GameDTO gameDTO) {
//        return new ResponseEntity<>(HttpStatus.CREATED);
//    }
}
