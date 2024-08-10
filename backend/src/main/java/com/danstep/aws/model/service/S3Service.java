package com.danstep.aws.model.service;

import com.amazonaws.services.s3.model.ObjectMetadata;
import com.danstep.aws.model.dto.GameInfoDTOno;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface S3Service {

//    ObjectMetadata makeMetadata(MultipartFile uploadFile) throws IOException;
//
//    String uploadProfile(MultipartFile uploadProfile) throws IOException;
//
//    String uploadVideoFile(GameInfoDTOno uploadVideoFile) throws IOException;
//
//    ResponseEntity<byte[]> download(String originalFilename) throws IOException;
//
//    byte[] getBytes(String f1, String pk, String fileUUID) throws IOException;

    String getPublicJson(String folder, String id, String filename);

    String getPrivateJson(String folder, String id, String filename);

    String getPublicUrl(String folder, String id, String filename);

    String getPrivateUrl(String folder, String id, String filename);
}
