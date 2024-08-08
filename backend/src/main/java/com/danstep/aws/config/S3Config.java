package com.danstep.aws.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class S3Config {

    @Value("${cloud.aws.credentials.admin.accessKey}")
    private String adminAccessKey;
    @Value("${cloud.aws.credentials.admin.secretKey}")
    private String adminSecretKey;

    @Value("${cloud.aws.credentials.user.accessKey}")
    private String userAccessKey;
    @Value("${cloud.aws.credentials.user.secretKey}")
    private String userSecretKey;

    @Value("${cloud.aws.region.static}")
    private String region;

    @Bean
    public AmazonS3 amazonS3Admin() {
        BasicAWSCredentials credentials = new BasicAWSCredentials(adminAccessKey, adminSecretKey);

        return AmazonS3ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .build();
    }

    @Bean
    public AmazonS3 amazonS3User() {
        BasicAWSCredentials credentials = new BasicAWSCredentials(userAccessKey, userSecretKey);

        return AmazonS3ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .build();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}