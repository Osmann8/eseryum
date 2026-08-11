# syntax=docker/dockerfile:1

# ---------- Build ----------
# Projede mvnw wrapper yok; surumu sabitlemek icin maven imajini kullaniyoruz.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

# Once sadece pom.xml: kaynak degistiginde bagimlilik indirme katmani cache'ten gelsin.
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 mvn -B -q dependency:go-offline

COPY src ./src
# Testler burada calismaz: Testcontainers'in Docker'a ihtiyaci var, build sirasinda yok.
# Testleri CI ve local calistirir.
RUN --mount=type=cache,target=/root/.m2 mvn -B -q clean package -DskipTests

# Spring Boot katmanli jar: bagimliliklar ile uygulama kodu ayri katmanlara duser,
# tek satir kod degisiminde 60 MB'lik bagimlilik katmani yeniden yazilmaz.
RUN java -Djarmode=tools -jar target/*.jar extract --layers --launcher --destination extracted

# ---------- Runtime ----------
FROM eclipse-temurin:21-jre-alpine AS runtime

# Uygulama root ile calismaz: konteyner kacisi durumunda hasari sinirlar.
RUN addgroup -S spring && adduser -S spring -G spring
WORKDIR /app

COPY --from=build --chown=spring:spring /build/extracted/dependencies/ ./
COPY --from=build --chown=spring:spring /build/extracted/spring-boot-loader/ ./
COPY --from=build --chown=spring:spring /build/extracted/snapshot-dependencies/ ./
COPY --from=build --chown=spring:spring /build/extracted/application/ ./

USER spring
EXPOSE 8080

# Konteyner cgroup limitine gore heap ayarlansin; sabit -Xmx vermiyoruz.
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]
