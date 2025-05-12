# 5e-srd-api

[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/5e-bits/5e-srd-api/ci.yml?style=flat&logo=github&logoColor=white)](https://github.com/5e-bits/5e-srd-api/actions/workflows/ci.yml)
[![Discord](https://img.shields.io/discord/656547667601653787?style=flat&logo=discord&logoColor=white)](https://discord.gg/TQuYTv7)
![Uptime](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2F5e-bits%2Fdnd-uptime%2Fmain%2Fapi%2Fwebsite%2Fresponse-time.json)
![Uptime](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2F5e-bits%2Fdnd-uptime%2Fmain%2Fapi%2Fwebsite%2Fuptime.json)

REST API to access [D&amp;D 5th Edition SRD API](https://www.dnd5eapi.co/)

Talk to us [on Discord!](https://discord.gg/TQuYTv7)

## How to Run

Make sure you have the latest version of the database:

```shell
docker compose pull
```

Then run it with docker-compose:

```shell
docker compose up --build
```

### M1/M2/M3 Macs

The command above pulls the latest image of the database from ghcr.io, which only targets the amd64 platform. If you are running on a different platform (like a Mac with Apple Silicon), you will need to build the image yourself. See the [5e-database](https://github.com/5e-bits/5e-database#how-to-run) repo for additional details.

```shell
cd ../
git clone https://github.com/5e-bits/5e-database.git
```

Then back over here in the 5e-srd-api repo, in the file `docker-compose.yml`, you can replace the line `image: bagelbits/5e-database` with `build: ../5e-database` (or whatever you named the custom db image).

## Making API Requests

Make API requests by using the root address:
`http://localhost:3000/api/2014`

You should get a response with the available endpoints for the root:

```json
{
  "ability-scores": "/api/2014/ability-scores",
  "classes": "/api/2014/classes",
  "conditions": "/api/2014/conditions",
  "damage-types": "/api/2014/damage-types",
  "equipment-categories": "/api/2014/equipment-categories",
  "equipment": "/api/2014/equipment",
  "features": "/api/2014/features",
  "languages": "/api/2014/languages",
  "magic-schools": "/api/2014/magic-schools",
  "monsters": "/api/2014/monsters",
  "proficiencies": "/api/2014/proficiencies",
  "races": "/api/2014/races",
  "skills": "/api/2014/skills",
  "spells": "/api/2014/spells",
  "subclasses": "/api/2014/subclasses",
  "subraces": "/api/2014/subraces",
  "traits": "/api/2014/traits",
  "weapon-properties": "/api/2014/weapon-properties"
}
```

### Versioning

The API is versioned by release years of the SRD. Currently only `/api/2014` is available. The next version will be `/api/2024`.

## Working with a local image of 5e Database

If you are working on a feature which requires changes to both this repo, _and_ the 5e-database repo, it is useful to know how to connect the former to the latter for testing purposes. A simple process for doing so is as follows:

1. In the file `docker-compose.yml`, you can replace the line `image: bagelbits/5e-database` with `build: [relativePathToDatabaseRepo]`. Make sure not to commit this change, as it is intended for local testing only.

2. Run your branch of 5e-srd-api using the method outlined in the above section of this readme file. So long as there are no transient errors, the API should build successfully, and your changes to both repos should be noticeable.

## Working with image resources from s3

The API uses s3 to store image files for monsters. The image files live in a bucket called `dnd-5e-api-images` under the `/monsters` folder.

To test locally, you can [use `localstack` to mock s3](https://docs.localstack.cloud/user-guide/aws/s3/). To do so, you will first need to install `localstack`,
`awscli`, and `awslocal`. You can then run the following commands to configure and start the localstack container:

```shell
export AWS_CONFIG_ENV=localstack_dev
localstack start
awslocal s3api create-bucket --bucket dnd-5e-api-images
awslocal s3 cp aboleth.png s3://dnd-5e-api-images/monsters/
npm run dev
```

Request the image by navigating to an image URL in a browser, or via HTTP request:

```shell
curl http://localhost:3000/api/2014/monsters/aboleth.png --output downloaded-aboleth.png
```

When interacting with the image you should see logs in the terminal where you started localstack. You can also use [localstack's webui](https://app.localstack.cloud/dashboard) to view the bucket and
contents.

## Data Issues

If you see anything wrong with the data itself, please open an issue or PR over [here.](https://github.com/5e-bits/5e-database/)

## Running Tests

### Unit Tests

You can run unit tests locally by using the command: `npm run test:unit`

### Integration Tests

Integration tests need to be ran in the API docker container for them to function properly.
In order to run integration tests locally you can use the command: `npm run test:integration:local`

## Documentation

Public facing API documentation lives [here.](https://www.dnd5eapi.co/docs)

The [docs repository](https://github.com/5e-bits/docs) contains the source for the public facing API documentation. It uses
[Docusaurus](https://docusaurus.io/) to generate the site from a bundled OpenAPI spec.

More details on working with the OpenAPI spec can be found in the [`src/swagger`](src/swagger/) directory's [README](src/swagger/README.md). The most up-to-date bundled OpenAPI specs themselves are included in [the latest release](https://github.com/5e-bits/5e-srd-api/releases/latest) in both [JSON](https://github.com/5e-bits/5e-srd-api/releases/latest/download/openapi.json) and [YAML](https://github.com/5e-bits/5e-srd-api/releases/latest/download/openapi.yml) formats, which can be used to generate your own documentation, clients, etc.

A [Postman collection](https://github.com/5e-bits/5e-srd-api/releases/latest/download/collection.postman.json) can also be found in the latest release. This can be imported into [the Postman HTTP client](https://www.postman.com/) to execute test requests against production & local deployments of the API.

## Contributing

- Fork this repository
- Create a new branch for your work
- Push up any changes to your branch, and open a pull request. Don't feel it needs to be perfect — incomplete work is totally fine. We'd love to help get it ready for merging.

## Code of Conduct

The Code of Conduct for this repo can be found [here.](https://github.com/5e-bits/5e-srd-api/wiki#code-of-conduct)

## Contributors

<a href="https://github.com/5e-bits/5e-srd-api/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=5e-bits/5e-srd-api" />
</a>
