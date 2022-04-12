# OpenAPI for the DND API

The `/swagger` directory contains an OpenAPI 3.0 definition for the DND API.

We use [swagger-cli](https://github.com/APIDevTools/swagger-cli) to validate and bundle
our OpenAPI definition, and [RapiDoc](https://mrin9.github.io/RapiDoc/index.html) as the documentation viewer.

**_Note:_** there are currently a handful of small inconsistencies between the documentation and actual API response. If you come across any please let us know!

**_Possible Future Improvements (PRs Encouraged :)_**

- [ ] standardize schema object naming (mostly cleanup the /schemas directory)
- [ ] validate schemas against models or actual api responses
- [ ] validate schema and field descriptions are accurate
- [ ] reorganize tag ordering
- [ ] add tag descriptions
- [ ] enumerate the `class.class_specific` field
- [ ] give user option to change render style and schema style (rapidoc)
- [ ] generate pieces of documentation based on source code e.g., generate OpenAPI `SchemaObject` from a TypeScript `type` definition
- [ ] code snippet examples in various languages
- [ ] ...anything else you want!

## Background

### What is the OpenAPI Specification?

> The OpenAPI Specification (OAS) defines a standard, programming language-agnostic interface description for HTTP APIs, which allows both humans and computers to discover and understand the capabilities of a service without requiring access to source code, additional documentation, or inspection of network traffic. When properly defined via OpenAPI, a consumer can understand and interact with the remote service with a minimal amount of implementation logic. Similar to what interface descriptions have done for lower-level programming, the OpenAPI Specification removes guesswork in calling a service.[^openapi]

[^openapi]: https://github.com/OAI/OpenAPI-Specification/

### What is Swagger?

> Swagger is a set of open-source tools built around the OpenAPI Specification that can help you design, build, document and consume REST APIs.[^swagger]

[^swagger]: https://swagger.io/docs/specification/about/

### Demo

A valid OpenAPI definition gives us a bunch of options when it comes to surfacing docs to end users.

![example!](./assets/demo.gif 'example')

## Documenting an Endpoint

We need 3 pieces to document an endpoint under the OpenAPI spec:

- [PathItemObject][pathobj]: Describes the operations available on a single path. Defines the shape of parameters, requests, and responses for a particular endpoint.
- [Parameter Object][paramobj]: Describes a single operation parameter. The expected format, acceptable values, and whether the parameter is required or optional.
- [Schema Object][schemaobj]: Describes the definition of an input or output data types. These types can be objects, but also primitives and arrays.

[schemaobj]: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#schemaObject
[pathobj]: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#pathItemObject
[paramobj]: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#parameterObject

## File Organization

> An OpenAPI document MAY be made up of a single document or be divided into multiple, connected parts at the discretion of the user.[^oas_org]

[^oas_org]: An OpenAPI document is a document (or set of documents) that defines or describes an API. An OpenAPI definition uses and conforms to the OpenAPI Specification. An OpenAPI document that conforms to the OpenAPI Specification is itself a JSON object, which may be represented either in JSON or YAML format. https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#document-structure

The root of our OpenAPI definition lives in `swagger.yml`. This file contains general information about the API, endpoint definitions, and definitions of reusable components. Reference Objects[^oas_ref] are used to allow components to reference each other.

[^oas_ref]: A simple object to allow referencing other components in the specification, internally and externally. https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#referenceObject

For reusability and readability, definitions are split into 3 directories.

- `/schemas`
  - Each `.yml` file contains definitions of one or more `SchemaObject`. Each schema more or less corresponds to one of the models in the [`src/models` directory](https://github.com/5e-bits/5e-srd-api/tree/main/src/models). We use these schemas to describe the structure of response bodies.
- `/paths`
  - Each `.yml` file contains definitions of one or more `PathItemObject`, where each of those objects defines an operation on an endpoint. Each file more or less corresponds to a controller in the [`src/controllers/api` directory](https://github.com/5e-bits/5e-srd-api/tree/main/src/controllers/api). These objects also include the example response shown in the endpoint documentation.
- `/parameters`
  - Contains definitions of reusable path and query parameters.

Each of those directories contains a file named `combined.yml` consisting of named references to each of the objects defined in sibling `.yml` files in that directory. The `combined.yml` files provides a single source we can reference from other components. By only referencing objects from the `combined.yml` files, we avoid any problems with circular references.

## Developing Locally

There's many possible ways to make changes and view them locally, I'll describe my personal setup and workflow here.

- local copy of the [database](https://github.com/5e-bits/5e-database) running in a custom built docker container on a machine on my local network
- [`redis`](https://redis.io/) running on my laptop
- local copy of the [api](https://github.com/5e-bits/5e-srd-api) running against my local database
  - I start this by running `MONGODB_URI=mongodb://<LOCAL_IP>/5e-database npm start` where `LOCAL_IP` is the ip address of the machine running the database docker container
- [Swagger Viewer](https://marketplace.visualstudio.com/items?itemName=Arjun.swagger-viewer) extension for VSCode
  - be sure to trigger the "Preview Swagger" command from the `swagger.yml` file

### Useful Commands

From the root of the project directory two `npm` commands are available related to these docs.

`npm run validate-swagger`

- checks that the OpenAPI definition in `swagger/swagger.yml` is valid

`npm run bundle-swagger`

- bundles the OpenAPI definition in `swagger/swagger.json` with all the associated referenced files, and writes the file to the `swagger/dist` directory

## Postman

[Postman](https://learning.postman.com/docs/getting-started/introduction/) is a platform for building and using APIs, it provides a user friendly GUI for creating and testing HTTP requests, and is free for personal use. We don't use Postman to build this API, but it can be a useful tool for testing and exploration. You can generate a Postman collection based on the OpenAPI definition for the API via the `npm run gen-postman` task, and then [import that collection into Postman](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman) to use it.

Under the hood the `gen-postman` task uses [`portman`](https://github.com/apideck-libraries/portman), based on the configuration defined in `portman-cli.json`. There's a number of configuration options that affect how the collection is generated, you can experiment with these options either by changing your local copy of that config file and running the `gen-postman` task, or by executing `portman` from the command line with different options.

For example, the CLI command equivalent to the config file would be:

```bash
portman -l src/swagger/dist/openapi.yml -o collection.postman.json -t
```
