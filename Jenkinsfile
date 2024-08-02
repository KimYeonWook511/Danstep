pipeline {
    agent any 

    stages {
        stage('Build Backend') {
            steps {
                script {
                    // Backend 디렉토리로 이동
                    dir('danstep/backend') {
                        // Gradle 빌드
                        // sh 'gradlew build'
                        sh 'gradlew clean build -x test' // 테스트 생략

                        // Docker 이미지 빌드
                        sh 'docker build -t danstep-backend-image .'
                        
                        // 기존 컨테이너가 존재하면 제거
                        sh '''
                        if [ "$(docker ps -aq -f name=danstep-backend-container)" ]; then
                            docker rm -f danstep-backend-container
                        fi
                        '''
                        
                        // Docker 컨테이너 실행
                        sh 'docker run -d \
                                --name danstep-backend-container \
                                -e TZ=Asia/Seoul \
                                -p 8081:8080 \
                                danstep-backend-image'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    // Frontend 디렉토리로 이동
                    dir('danstep/frontend') {
                        // 필요한 패키지 설치
                        sh 'npm install'

                        // React TypeScript 애플리케이션 빌드
                        sh 'npm run build'

                        // Docker 이미지 빌드
                        sh 'docker build -t danstep-frontend-image .'
                        
                        // 기존 컨테이너가 존재하면 제거
                        sh '''
                        if [ "$(docker ps -aq -f name=danstep-frontend-container)" ]; then
                            docker rm -f danstep-frontend-container
                        fi
                        '''
                        
                        // Docker 컨테이너 실행
                        sh 'docker run -d \
                                --name danstep-frontend-container \
                                -e TZ=Asia/Seoul \
                                -p 80:80 \
                                -p 443:443 \
                                -v /etc/letsencrypt/live/i11a406.p.ssafy.io/fullchain.pem:/etc/letsencrypt/live/i11a406.p.ssafy.io/fullchain.pem \
                                -v /etc/letsencrypt/live/i11a406.p.ssafy.io/privkey.pem:/etc/letsencrypt/live/i11a406.p.ssafy.io/privkey.pem \
                                danstep-frontend-image'
                    }
                }
            }
        }
    }

    post {
        always {
            // 빌드 후 로그 출력
            echo 'Pipeline finished.'
        }
        failure {
            // 실패 시 알림
            echo 'Pipeline failed.'
        }
    }
}
