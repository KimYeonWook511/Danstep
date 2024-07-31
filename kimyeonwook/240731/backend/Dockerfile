FROM openjdk:17-jdk
WORKDIR /app
COPY build/libs/danstep.jar app.jar
EXPOSE 8080

# 시간대 설정
#ENV TZ=Asia/Seoul
#RUN apt-get update && apt-get install -y tzdata && \
#    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
#    echo $TZ > /etc/timezone

CMD ["java", "-jar", "app.jar"]