FROM gradle:8-jdk21 AS build
WORKDIR /app

COPY build.gradle settings.gradle ./
RUN gradle build --no-daemon -x test > /dev/null 2>&1 || true

COPY src ./src
RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]