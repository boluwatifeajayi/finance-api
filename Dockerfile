FROM node:20

USER root

# python3: required for parser.py in test.sh
# libcurl4: required by mongodb-memory-server dynamic linking
# git: required for git reset --hard in per-task Dockerfiles
RUN apt-get update && apt-get install -y \
    python3 \
    libcurl4 \
    git \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./

# Install production dependencies using lockfile (exact versions)
RUN npm ci

# Install test tooling — pinned, not saved to package.json
RUN npm install --no-save \
    jest@29.7.0 \
    mongodb-memory-server@9.1.1 \
    supertest@6.3.3 \
    write-file-atomic@4.0.2 \
    signal-exit@3.0.7

COPY . .

# Environment variables required for tests to run without a real config
ENV JWT_SEC=finance-test-secret-key
ENV NODE_ENV=test
ENV MONGOMS_VERSION=7.0.5

# Pre-download mongodb-memory-server binary to avoid first-run latency in tests
RUN node -e "require('mongodb-memory-server').MongoBinary.getPath({version:'7.0.5'}).catch(()=>{})" || true

# Clear any inherited ENTRYPOINT so the Harbor test harness takes control
ENTRYPOINT []

# Pre-create the Harbor reward file so it exists even if the verifier crashes early
RUN mkdir -p /logs/verifier \
    && echo 0 > /logs/verifier/reward.txt \
    && chmod -R 0777 /logs

EXPOSE 4070
