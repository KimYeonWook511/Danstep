package com.danstep;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.danstep")
public class DanstepApplication {

	public static void main(String[] args) {
		SpringApplication.run(DanstepApplication.class, args);
	}

}
