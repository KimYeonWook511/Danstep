package com.danstep.game.contoller;

import com.danstep.game.model.dto.GameDTO;
import com.danstep.game.model.service.GameService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/games")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/{gameId}")
    public ResponseEntity<GameDTO> getGame(@PathVariable Integer gameId) {
        System.out.println("getGame 호출!");

        if (gameId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        GameDTO gameDTO = gameService.getGame(gameId);

        if (gameDTO == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // HTTP 응답 반환
//        return ResponseEntity.ok().body(gameDTO);
        return new ResponseEntity<>(gameDTO, HttpStatus.OK);
    }
}
