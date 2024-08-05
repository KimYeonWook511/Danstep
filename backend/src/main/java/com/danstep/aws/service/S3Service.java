package com.danstep.aws.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.danstep.aws.dao.S3Dao;
import com.danstep.aws.dto.TempDto;
import com.danstep.aws.dto.GameInfoDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;

@Slf4j
//@RequiredArgsConstructor
@Service
public class S3Service{

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.cloudfront.domain}")
    private String cloudFrontDomain;

    private final AmazonS3 amazonS3;
    private final S3Dao s3Dao;

    public S3Service(AmazonS3 amazonS3, S3Dao s3Dao) {
        this.amazonS3 = amazonS3;
        this.s3Dao = s3Dao;
    }

    public ObjectMetadata makeMetadata(MultipartFile uploadFile) throws IOException{
        ObjectMetadata metadata = new ObjectMetadata();
        //메타데이터 content type과 length를 설정하는 이유
        //type = 올바른 MIME 타입을 제공받기 위함
        //length = S3가 저장 공간을 효율적으로 관리하기 위함
        metadata.setContentLength(uploadFile.getSize());
        metadata.setContentType(uploadFile.getContentType());
        return metadata;
    }

    public String uploadProfile(MultipartFile uploadProfile)
            throws IOException{

        String originalProfile = uploadProfile.getOriginalFilename(); //profile의 원본 이름
        int dot = originalProfile.lastIndexOf('.');
        String extension = originalProfile.substring(dot);
        String originalProfileName = originalProfile.substring(0,dot);

        System.out.println("originalProfileName ==> " + originalProfileName);
        System.out.println("extension ==> " + extension);

        String folderId = String.valueOf(findNextIndex("profiles")); //S3의 profile 파일 내부의 ID(순서) 가져옴
        String uuid = UUID.randomUUID() + extension;

        //일단 DTO가 같으므로 GameInfoDto 사용 추후 변경 예정
        s3Dao.insertProfileUUID(new TempDto(folderId,uuid));

        String profilePath = createUUIDName("profiles",folderId,uuid);//경로 profiles/{id}/{uuid}
        ObjectMetadata metadata = makeMetadata(uploadProfile);//metadata 생성

        //버킷, 저장경로, 파일을 읽기 위한 inputstream, 메타데이터
        amazonS3.putObject(bucket, profilePath, uploadProfile.getInputStream(), metadata);
        return amazonS3.getUrl(bucket, originalProfileName).toString();
    }

    public String uploadVideoFile(GameInfoDto uploadVideoFile)
            throws IOException{

        //String originalFile = uploadVideoFile.getOriginalName() + uploadVideoFile.getExtension();

        String folderId = String.valueOf(findNextIndex("games"));
        String uuid = UUID.randomUUID() + uploadVideoFile.getExtension();
        String originalFile = createUUIDName("games",folderId,uuid);

        s3Dao.insertGameUUID(new TempDto(folderId,uuid));

        ObjectMetadata metadata = makeMetadata(uploadVideoFile.getFile());

        //System.out.println(originalFile);
        amazonS3.putObject(bucket, originalFile, uploadVideoFile.getFile().getInputStream(), metadata);
        return amazonS3.getUrl(bucket, originalFile).toString();

    }

    private String createUUIDName(String folder, String folderId,String uuid){
        return folder + "/" + folderId + "/" + uuid;
    }

    private int findNextIndex(String folder){
        ListObjectsV2Request req = new ListObjectsV2Request()
                .withBucketName(bucket)
                .withPrefix(folder+"/")
                .withDelimiter("/");

        ListObjectsV2Result result = amazonS3.listObjectsV2(req);
        int idx = 0;

        for(String prefix : result.getCommonPrefixes()){
            String folderName = prefix.replace(folder+"/","").replace("/","");
            try{
                int index = Integer.parseInt(folderName);
                if(index > idx){
                    idx = index;
                }
            }catch(NumberFormatException e) {continue;}
        }

        return idx+1;
    }


    public ResponseEntity<byte[]> download(String originalFilename) throws IOException {
        String encodedFileName = URLEncoder.encode(originalFilename, "UTF-8").replaceAll("\\+", "%20");

        String uuid = s3Dao.getGameUUID(encodedFileName);

        int dot = uuid.lastIndexOf('.');
        String extension = uuid.substring(dot+1);
        originalFilename = uuid.substring(0,dot);

        String cloudFrontUrl = getCloudFront(encodedFileName,uuid);
        System.out.println("cloudeFrontURL --> "+cloudFrontUrl);
        ResponseEntity<byte[]> responseEntity = downloadUrl(cloudFrontUrl, originalFilename,extension);
        return responseEntity;
    }

//    private ResponseEntity<byte[]> downloadUrl(String url, String originalFilename) throws IOException{
//        try {
//            // HTTP 요청을 통해 CloudFront에서 파일 다운로드 (예시로 HttpClient 사용)
//            HttpClient httpClient = HttpClient.newBuilder().build();
//            HttpRequest request = HttpRequest.newBuilder()
//                    .uri(URI.create(url))
//                    .build();
//
//            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
//            byte[] bytes = response.body();
//            String fileName = URLEncoder.encode(originalFilename, "UTF-8").replaceAll("\\+", "%20");
//            HttpHeaders httpHeaders = new HttpHeaders();
//            httpHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
//            httpHeaders.setContentLength(bytes.length);
//            httpHeaders.setContentDispositionFormData("attachment", fileName);
//            return new ResponseEntity<>(bytes, httpHeaders, HttpStatus.OK);
//        } catch (InterruptedException e) {
//            Thread.currentThread().interrupt(); // 스레드의 인터럽트 상태를 복원
//            throw new IOException("다운로드 실패했어염", e);
//        }
//    }

    private ResponseEntity<byte[]> downloadUrl(String url, String originalFilename,String extension) throws IOException{
        try {
            // HTTP 요청을 통해 CloudFront에서 파일 다운로드 (예시로 HttpClient 사용)
            HttpClient httpClient = HttpClient.newBuilder().build();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            byte[] bytes = response.body();
            String contentType = "video/"+extension;
            System.out.println("contentType=>>" +contentType );
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setContentType(MediaType.parseMediaType(contentType));
            //httpHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            httpHeaders.setContentLength(bytes.length);
            httpHeaders.setContentDispositionFormData("attachment", originalFilename);

            return new ResponseEntity<>(bytes, httpHeaders, HttpStatus.OK);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // 스레드의 인터럽트 상태를 복원
            throw new IOException("다운로드 실패했어염", e);
        }
    }

//    private String getCloudFront(String fileName) throws IOException{
//        String encodedFileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
//        return String.format("https://%s/%s", cloudFrontDomain, encodedFileName);
//    }

    private String getCloudFront(String encodedFileName,String uuid) throws IOException{

        return String.format("https://%s/games/%s/%s", cloudFrontDomain, encodedFileName,uuid);
    }

    public String getUrl(String originalFileName) throws IOException{

        String fileName = URLEncoder.encode(originalFileName, "UTF-8").replaceAll("\\+", "%20");
        System.out.println("h2h2h2h2" + fileName);
        String uuid = s3Dao.getGameUUID(fileName);
        String path = "games"+"/"+originalFileName+"/"+uuid;
        System.out.println("경로입니다 ==>" + path);
        return "https://"+cloudFrontDomain+"/"+path;
    }
}
