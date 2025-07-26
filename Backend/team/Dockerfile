# Stage 1: Build the application
FROM eclipse-temurin:24-jdk-alpine AS build
WORKDIR /app

# Copy Maven wrapper files and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies first to leverage Docker's build cache
RUN ./mvnw dependency:go-offline -B

# Copy the rest of the source code
COPY src src

# Build the Spring Boot application JAR
RUN ./mvnw install -DskipTests

# Stage 2: Create the final lightweight runtime image
FROM eclipse-temurin:24-jre-alpine
WORKDIR /app

# Copy the built JAR from the 'build' stage into the final image
COPY --from=build /app/target/*.jar app.jar

# Expose the port for the Team Service
EXPOSE 8095

# Command to run the application when the container starts
ENTRYPOINT ["java","-jar","app.jar"] 