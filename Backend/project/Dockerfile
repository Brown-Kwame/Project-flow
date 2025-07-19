# Stage 1: Build the application
# Use a JDK image for compilation. eclipse-temurin:17-jdk-alpine is a good, small choice.
FROM eclipse-temurin:24-jdk-alpine AS build
# Set the working directory inside the container
WORKDIR /app
# Copy Maven wrapper files and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies first to leverage Docker's build cache.
# This step only re-runs if pom.xml or mvnw/pom.xml changes.
# -B for batch mode (non-interactive)
RUN ./mvnw dependency:go-offline -B

# Copy the rest of the source code
COPY src src

# Build the Spring Boot application JAR.
# -DskipTests to skip running tests during the Docker build, which speeds it up.
RUN ./mvnw install -DskipTests

# Stage 2: Create the final lightweight runtime image
# Use a JRE image for running the application. JRE images are much smaller than JDK images.
FROM eclipse-temurin:24-jre-alpine
# Set the working directory for the runtime
WORKDIR /app

# Copy the built JAR from the 'build' stage into the final image.
# 'app.jar' is a common convention for the application JAR name.
COPY --from=build /app/target/*.jar app.jar

# Expose the port your Spring Boot application runs on.
# This is for documentation and network configuration.
# IMPORTANT: Change this port for EACH service!
# Eureka: 8761, API Gateway: 8080, User: 8086, Auth: 8081, Portfolio: 8082
EXPOSE 8084

# Command to run the application when the container starts.
# This executes the JAR file.
ENTRYPOINT ["java","-jar","app.jar"]