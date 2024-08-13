package com.danstep.game.contoller;

import com.danstep.game.model.dto.GameInfoDTO;
import com.danstep.game.model.dto.GetAllGameDTO;
import com.danstep.game.model.service.GameService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/games")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping
    public ResponseEntity<List<GetAllGameDTO>> getAllGames() {
        System.out.println("getAllGames 호출");

        List<GetAllGameDTO> gameList = gameService.getAllGames();

        return new ResponseEntity<>(gameList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameInfoDTO> getGame(@PathVariable Integer id) {
        System.out.println("getGame 호출");

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
    public ResponseEntity<String> getGamePose(@PathVariable Integer id) {
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        String poseData = gameService.getGamePose(id);

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
