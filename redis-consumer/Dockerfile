FROM openjdk:21-jdk-slim
WORKDIR /opt
CMD ["./gradlew", "clean", "bootJar"]
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} pie-consumer-0.0.1-SNAPSHOT.jar
#EXPOSE 8083
ENTRYPOINT ["java", "-jar", "pie-consumer-0.0.1-SNAPSHOT.jar"]

