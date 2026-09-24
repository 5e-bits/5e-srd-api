# This recipe is pulled from: https://stackoverflow.com/a/33601894

# Parent Dockerfile https://github.com/docker-library/mongo/blob/982328582c74dd2f0a9c8c77b84006f291f974c3/3.0/Dockerfile
FROM mongo:7.0.43

# Modify child mongo to use /data/db2 as dbpath (because /data/db wont persist the build)
COPY packages/5e-database/docker/mongodb.conf /etc
RUN mkdir -p /data/db2 \
  && chown -R mongodb:mongodb /data/db2

RUN apt-get update \
  && apt-get -y install curl \
  && apt-get clean \
  && rm -rf /var/apt/lists/*
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -y nodejs \
  && apt-get clean \
  && rm -rf /var/apt/lists/*
RUN npm install -g pnpm@12.4.2

ENV MONGODB_URI=mongodb://localhost:27017/5e-database

## Add code. Built from the monorepo root (see release workflow), so this
## installs via the shared workspace lockfile rather than a package-local one.
WORKDIR /data/db2
COPY --chown=mongodb:mongodb pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=mongodb:mongodb packages/5e-database/package.json ./packages/5e-database/package.json
RUN pnpm install --frozen-lockfile
COPY --chown=mongodb:mongodb packages/5e-database ./packages/5e-database

# Compile TypeScript scripts before running them
RUN pnpm --filter 5e-database run build:ts

RUN mongod --fork --logpath /var/log/mongodb.log --dbpath /data/db2 \
  && pnpm --filter 5e-database run db:refresh \
  && mongod --dbpath /data/db2 --shutdown \
  && chown -R mongodb:mongodb /data/db2

# Make the new dir a VOLUME to persists it
VOLUME /data/db2

HEALTHCHECK CMD curl --connect-timeout 10 --silent --fail http://localhost:27017 || exit 1

CMD ["mongod", "--config", "/etc/mongodb.conf"]
