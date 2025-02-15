FROM gradle:8.4.0-jdk17 AS builder

WORKDIR /app

COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle

RUN ./gradlew dependencies --no-daemon

COPY src ./src
RUN ./gradlew clean build -x test --no-daemon

FROM eclipse-temurin:17-jre-jammy

WORKDIR /app
COPY --from=builder /app/build/libs/*.jar pie-consumer-0.0.1-SNAPSHOT.jar

ENTRYPOINT ["java", "-jar", "pie-consumer-0.0.1-SNAPSHOT.jar"]
