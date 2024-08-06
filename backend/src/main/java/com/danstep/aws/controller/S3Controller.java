package com.danstep.aws.controller;

import com.danstep.aws.model.dto.GameInfoDTO;
import com.danstep.aws.model.service.S3Service;
import com.danstep.aws.model.service.S3ServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.http.HttpResponse;

@RestController
@RequestMapping("/api/v1/s3")
//@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000")
public class S3Controller {

    private final S3Service s3Service;

    public S3Controller(S3ServiceImpl s3Service) {
        this.s3Service = s3Service;
    }

    @PostMapping("/profile")
    public ResponseEntity<String> uploadProfile(
            @RequestParam("profile") MultipartFile profile //파일
    ) {
        System.out.println("제대로 프로필이 입력되었을까");
        try {
            String fileUrl = s3Service.uploadProfile(profile);

//            return ResponseEntity.ok(fileUrl);
            return new ResponseEntity<>(fileUrl, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/video")
    public ResponseEntity<String> uploadVideoFile(
            @RequestParam("file") MultipartFile file, //파일
            @RequestParam("title") String title, //제목
            @RequestParam("content") String content, //내용
            @RequestParam("duration") String duration
//            @RequestParam("originalName") String originalName,
//            @RequestParam("extension") String extension //확장자
         ) throws IOException{

        System.out.println("============");
        System.out.println(title); //제목, 내용, 영상길이
        String originalFilename = file.getOriginalFilename();
        int dot = originalFilename.lastIndexOf('.');
        String extension = originalFilename.substring(dot); //오리지널 이름
        originalFilename = originalFilename.substring(0, dot); //확장자명
        System.out.println("originalName: " + originalFilename.substring(0, dot));
        System.out.println("확장자: " + originalFilename.substring(dot));
        System.out.println("=============");
        // 제목, 내용, 영상길이, original영상명, UUID명, 확장자명, '버킷에 저장될 폴더명/UUID.확장자'

        String mimeType = file.getContentType();
        if(!mimeType.startsWith("video/")){
            return ResponseEntity.badRequest().body("동영상이 아닙니다");
        }

        GameInfoDTO uploadFile = new GameInfoDTO(1, title, content, duration, originalFilename, extension, file);
        String fileUrl = s3Service.uploadVideoFile(uploadFile);
        return ResponseEntity.ok(fileUrl);
    }

//    @GetMapping("/download/{fileName}")
//    public ResponseEntity<byte[]> download(@PathVariable String fileName) throws IOException {
//        ResponseEntity<byte[]> response = s3Service.download(fileName);
//        //System.out.println(response);
//        return response;
//    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<byte[]> download(@PathVariable String fileName) throws IOException {
        ResponseEntity<byte[]> response = s3Service.download(fileName);
        //System.out.println(response);
        return response;
    }

    @GetMapping("/getUrl/{fileName}")
    public String getUrl(@PathVariable String fileName) throws IOException{
        System.out.println("지금 나를 부른건가>???");
//        String ex = s3Service.getUrl(fileName);

//        String uuid = s3Dao.getGameUUID(fileName);
//        String path = "games"+"/"+originalFileName+"/"+uuid;
        String ex = "https://d3gnfa5yiksyfe.cloudfront.net/games" + "/" + "4" + "/" + "cab86047-4688-440b-a35d-8baafc423613.mp4";
//        System.out.println("경로입니다 ==>" + path);
//        return "https://"+cloudFrontDomain+"/"+path;

        System.out.println("url  ==>  "+ex);
        return ex;
    }

//    @GetMapping("/games/{gameId}")
//    public ResponseEntity<byte[]> getGame(@PathVariable Integer gameId) throws IOException {
//        if (gameId == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//
//        HttpResponse<byte[]> response = s3Service.getFile(1);
//
//        if (response.statusCode() == HttpStatus.OK.value()) {
//            byte[] videoBytes = response.body();
//            ByteArrayResource resource = new ByteArrayResource(videoBytes);
//
//            // HTTP 응답 반환
//            return ResponseEntity.ok()
//                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + videoName + "\"")
//                    .contentLength(videoBytes.length)
//                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                    .body(resource);
//        } else {
//            return ResponseEntity.status(response.statusCode()).build();
//        }
//
//        return new ResponseEntity<>(, HttpStatus.OK);
//    }
}