package com.danstep.aws.model.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ListObjectsV2Request;
import com.amazonaws.services.s3.model.ListObjectsV2Result;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.danstep.aws.model.dto.GameInfoDTOno;
import com.danstep.aws.model.dto.TempDTO;
import com.danstep.aws.model.mapper.S3Mapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.*;
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
public class S3ServiceImpl implements S3Service {

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

    public S3ServiceImpl(@Qualifier("amazonS3Admin") AmazonS3 amazonS3Admin,
                         @Qualifier("amazonS3User") AmazonS3 amazonS3User,
                         RestTemplate restTemplate) {
        this.amazonS3Admin = amazonS3Admin;
        this.amazonS3User = amazonS3User;
        this.restTemplate = restTemplate;
    }

//    private String createUUIDName(String folder, String folderId,String uuid) {
//        return folder + "/" + folderId + "/" + uuid;
//    }
//
//    private int findNextIndex(String folder){
//        ListObjectsV2Request req = new ListObjectsV2Request()
//                .withBucketName(bucket)
//                .withPrefix(folder+"/")
//                .withDelimiter("/");
//
//        ListObjectsV2Result result = amazonS3.listObjectsV2(req);
//        int idx = 0;
//
//        for(String prefix : result.getCommonPrefixes()){
//            String folderName = prefix.replace(folder+"/","").replace("/","");
//            try{
//                int index = Integer.parseInt(folderName);
//                if(index > idx){
//                    idx = index;
//                }
//            }catch(NumberFormatException e) {continue;}
//        }
//
//        return idx+1;
//    }
//
//    private String getCloudFront(String encodedFileName,String uuid) throws IOException {
//        return String.format("https://%s/games/%s/%s", cloudFrontDomain, encodedFileName,uuid);
//    }
//
//    @Override
//    public byte[] getBytes(String f1, String pk, String fileUUID) throws IOException {
//        try {
//            System.out.println(cloudFrontDomain);
//            System.out.println(cloudFrontUrl + "/" + f1 + "/" + pk + "/" + fileUUID);
//            HttpClient httpClient = HttpClient.newBuilder().build();
//            HttpRequest request = HttpRequest.newBuilder()
//                    .uri(URI.create(cloudFrontUrl + "/" + f1 + "/" + pk + "/" + fileUUID))
//                    .build();
//
//            // 요청 보내고 응답 받기
//            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
//
//            if (response.statusCode() == HttpStatus.OK.value()) {
//                return response.body();
//            } else {
//                return null;
//            }
//
//        } catch (InterruptedException e) {
//            throw new RuntimeException(e);
//        }
//    }
//
//    private URL generatePresignedUrl(String objectKey) {
//        GeneratePresignedUrlRequest generatePresignedUrlRequest =
//                new GeneratePresignedUrlRequest(
//                        amazonS3.getBucketName(), objectKey)
//                        .withMethod(com.amazonaws.HttpMethod.GET)
//                        .withExpiration(new Date(System.currentTimeMillis() + 3600 * 1000)); // 1시간 유효
//
//        return amazonS3.generatePresignedUrl(generatePresignedUrlRequest);
//    }

    @Override
    public Object getPublicJson(String folder, String id, String filename) {
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
            return restTemplate.getForObject(sb.toString(), Object.class);
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

    @Override
    public Object getPrivateJson(String folder, String id, String filename) {
        return null;
    }

    @Override
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

    @Override
    public String getPrivateUrl(String folder, String id, String filename) {
        sb = new StringBuilder().append("현재 아직 구현 안 함");;

//        sb.append(cloudFrontUrl)
//                .append("/private/")
//                .append()

        return sb.toString();
    }
}
