package com.danstep.aws.model.service;

import com.amazonaws.services.s3.model.ObjectMetadata;
import com.danstep.aws.model.dto.GameInfoDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.http.HttpResponse;

public interface S3Service {

    ObjectMetadata makeMetadata(MultipartFile uploadFile) throws IOException;

    String uploadProfile(MultipartFile uploadProfile) throws IOException;

    String uploadVideoFile(GameInfoDTO uploadVideoFile) throws IOException;

    ResponseEntity<byte[]> download(String originalFilename) throws IOException;

    String getUrl(String originalFileName) throws IOException;

    byte[] getBytes(String f1, String pk, String fileUUID) throws IOException;
}
