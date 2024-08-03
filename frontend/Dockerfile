# 단계 1: 빌드 이미지 생성
# 최신 LTS 버전 사용
FROM node:lts AS build

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package.json ./
COPY package-lock.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 단계 2: Nginx 이미지 생성
FROM nginx:alpine

# Nginx 설정파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 React 애플리케이션을 Nginx의 기본 HTML 디렉토리로 복사
COPY --from=build /app/build /usr/share/nginx/html

# SSL 인증서와 키 파일을 복사 (필요한 경우)
# COPY ./path/to/certificates/fullchain.pem /etc/ssl/certs/fullchain.pem
# COPY ./path/to/certificates/privkey.pem /etc/ssl/private/privkey.pem
# -> container volume을 이용해서 해결함!

# 컨테이너가 80 포트를 사용할 수 있도록 설정 (HTTP)
# EXPOSE 80
# 컨테이너가 443 포트를 사용할 수 있도록 설정 (HTTPS)
# EXPOSE 443

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]