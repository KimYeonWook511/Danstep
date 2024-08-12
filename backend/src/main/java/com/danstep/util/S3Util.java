package com.danstep.util;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Date;
import java.util.UUID;

@Component
public class S3Util {

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.cloudfront.domain}")
    private String cloudFrontDomain;

    @Value("${cloud.aws.cloudfront.url}")
    private String cloudFrontUrl;

    private final AmazonS3 amazonS3Admin;
    private final AmazonS3 amazonS3User;
    private final RestTemplate restTemplate;

    private StringBuilder sb;

    public S3Util(@Qualifier("amazonS3Admin") AmazonS3 amazonS3Admin,
                  @Qualifier("amazonS3User") AmazonS3 amazonS3User,
                  RestTemplate restTemplate) {
        this.amazonS3Admin = amazonS3Admin;
        this.amazonS3User = amazonS3User;
        this.restTemplate = restTemplate;
    }

    public String getUUIDFilename(String filename) {
        int dotIdx = filename.lastIndexOf('.');
        String extension = filename.substring(dotIdx);

        return UUID.randomUUID() + extension;
    }

    public String uploadProfile(MultipartFile profile, String username, String UUIDFilename) {
        // 파일 경로 및 파일 명
        sb = new StringBuilder().append("private/users/")
                .append(username)
                .append("/")
                .append(UUIDFilename);

        try {
            //메타데이터 content type과 length를 설정하는 이유
            //type = 올바른 MIME 타입을 제공받기 위함
            //length = S3가 저장 공간을 효율적으로 관리하기 위함
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(profile.getSize());
            metadata.setContentType(profile.getContentType());

            // S3에 업로드
            amazonS3Admin.putObject(new PutObjectRequest(bucket, sb.toString(), profile.getInputStream(), metadata));

            return sb.toString();

        } catch (IOException ioException) {
            throw new RuntimeException("Error obtaining input stream for file: " + profile.getOriginalFilename());
        }
    }

    public String getPublicJson(String folder, String id, String filename) {
        // 결국 나중엔 publicJson은 없음! (모든 포즈는 보호해야함)
        // 임시 허용해주는 url생성해서 접근해야할 듯
        // 다만 임시 허용해주는 부분동안은 접근이 가능하니 game pose같은 경우는 사실상 public같은 느낌이 들긴 함
        
        sb = new StringBuilder().append(cloudFrontUrl)
                .append("/public/")
                .append(folder)
                .append("/")
                .append(id)
                .append("/")
                .append(filename);

        try {
            return restTemplate.getForObject(sb.toString(), String.class);

        } catch (HttpClientErrorException e) {
            throw new RuntimeException("클라이언트 오류: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e);

        } catch (HttpServerErrorException e) {
            throw new RuntimeException("서버 오류: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e);

        } catch (ResourceAccessException e) {
            throw new RuntimeException("네트워크 오류: " + e.getMessage(), e);

        } catch (RestClientException e) {
            throw new RuntimeException("REST 클라이언트 오류: " + e.getMessage(), e);
        }
    }

    public String getPrivateJson(String folder, String id, String filename) {
        sb = new StringBuilder().append("private/")
                .append(folder)
                .append("/")
                .append(id)
                .append("/")
                .append(filename);

        System.out.println("getPrivateJson: " + sb.toString());

        Date expiration = new Date();
        long expTimeMillis = expiration.getTime();
        expTimeMillis += 1000 * 60 * 3; // 3분
        expiration.setTime(expTimeMillis);

        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucket, sb.toString())
                        .withMethod(com.amazonaws.HttpMethod.GET)
                        .withExpiration(expiration);

        System.out.println("GeneratePresignedUrlRequest 성공적");

        URL presignedUrl = amazonS3Admin.generatePresignedUrl(generatePresignedUrlRequest);

        System.out.println("presignedUrl: " + presignedUrl);

        try {
            System.out.println("URI: " + presignedUrl.toURI());
            System.out.println("path: " + presignedUrl.getPath());
            System.out.println("host: " + presignedUrl.getHost());
            System.out.println("query: " + presignedUrl.getQuery());
            System.out.println("full: " + presignedUrl.getPath() + (presignedUrl.getQuery() != null ? "?" + presignedUrl.getQuery() : ""));
            // RestTemplate을 사용하여 JSON 데이터 가져오기
            return restTemplate.getForObject(presignedUrl.toString(), String.class);

        } catch (HttpClientErrorException e) {
            throw new RuntimeException("클라이언트 오류: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e);

        } catch (HttpServerErrorException e) {
            throw new RuntimeException("서버 오류: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e);

        } catch (ResourceAccessException e) {
            throw new RuntimeException("네트워크 오류: " + e.getMessage(), e);

        } catch (RestClientException e) {
            throw new RuntimeException("REST 클라이언트 오류: " + e.getMessage(), e);

        } catch (Exception e) {
            throw new RuntimeException("S3Util getPrivateJson error: " + e.getMessage(), e);
        }
    }

    public String getPublicUrl(String folder, String id, String filename) {
//        path = URLEncoder.encode(path, "UTF-8").replaceAll("\\+", "%20");
        sb = new StringBuilder().append(cloudFrontUrl)
                .append("/public/")
                .append(folder)
                .append("/")
                .append(id)
                .append("/")
                .append(filename);

        return sb.toString();
    }

    public String getPrivateUrl(String folder, String id, String filename) {
        sb = new StringBuilder().append("현재 아직 구현 안 함");;

//        sb.append(cloudFrontUrl)
//                .append("/private/")
//                .append()

        return sb.toString();
    }

    public void uploadUserJson(String folder, String username, String gameInfoId, String filename, String poseData) {
        // 파일 경로 및 파일 명
        sb = new StringBuilder().append("private/")
                .append(folder)
                .append("/")
                .append(username)
                .append("/")
                .append(gameInfoId)
                .append("/")
                .append(filename);

        // S3에 업로드할 InputStream 생성
        ByteArrayInputStream inputStream = new ByteArrayInputStream(poseData.getBytes());

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(poseData.length());
        metadata.setContentType("application/json");

        // S3에 업로드
        amazonS3Admin.putObject(new PutObjectRequest(bucket, sb.toString(), inputStream, metadata));
    }
}
