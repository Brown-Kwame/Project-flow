# Use an official OpenJDK runtime as a parent image
# Make sure this Java version matches your project's compiled version (e.g., 17 or 21)
FROM openjdk:17-jdk-slim

# Set a working directory inside the container
WORKDIR /app

# Copy the fat JAR file into the container at /app
# The JAR file is created by 'mvn package' or 'gradle build'
# It will be in target/skype-clone-backend-0.0.1-SNAPSHOT.jar (check your artifactId and version in pom.xml)
COPY target/skype-clone-backend-0.0.1-SNAPSHOT.jar app.jar

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the JAR file when the container launches
ENTRYPOINT ["java", "-jar", "app.jar"]