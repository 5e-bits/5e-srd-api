# OpenAPI for the DND API

## Summary

The `/swagger` directory contains a work in progress OpenAPI 3.0 definition for the DND API.

### Goals

- Improve documentation readability and usability.
- Reduce learning curve when it comes to using the API.
- Make keeping documentation up-to-date easier.

### Current State

- Query parameters have not been defined. 
- Examples have not been defined. 
- Links have not been defined.
- The naming convention used in the `/schemas` directory doesn't match the convention used elsewhere.
    - A result of reading two different tutorials, planning to fix this.
- Remaining endpoints that still need a first pass:
    - `/races/*`
    - `/spells/{index}`
    - `/subclasses/*`
    - `/subraces/*`
    - `/traits/{index}`

## Demo

A valid OpenAPI definition gives us a bunch of options when it comes to surfacing docs to end users. Here's one example of what that might look like:

![example!](./assets/oapi2.gif "example")

To explore the existing definition you can load one of the files in the `/swagger/comb` directory into any OpenAPI 3.0 compatible viewer. A list some of these tools can be found on the [openapi.tools](https://openapi.tools/#documentation) site.

## Developing Locally

There's many possible ways to make changes and view them locally, I'll describe my personal setup and workflow here.

- local copy of the [database](https://github.com/5e-bits/5e-database) running in a custom built docker container on a machine on my local network
- [`redis`](https://redis.io/) running on my laptop
- local copy of the [api](https://github.com/5e-bits/5e-srd-api) running against my local database
    - I start this by running `MONGODB_URI=mongodb://<LOCAL_IP>/5e-database npm start` where `LOCAL_IP` is the ip address of the machine running the database docker container
- [Swagger Viewer](https://marketplace.visualstudio.com/items?itemName=Arjun.swagger-viewer) extension for VSCode
    - be sure to trigger the "Preview Swagger" command from the `swagger.yml` file


## Background

### What is the OpenAPI Specification?

>The OpenAPI Specification (OAS) defines a standard, programming language-agnostic interface description for HTTP APIs, which allows both humans and computers to discover and understand the capabilities of a service without requiring access to source code, additional documentation, or inspection of network traffic. When properly defined via OpenAPI, a consumer can understand and interact with the remote service with a minimal amount of implementation logic. Similar to what interface descriptions have done for lower-level programming, the OpenAPI Specification removes guesswork in calling a service.[^openapi]

[^openapi]: https://github.com/OAI/OpenAPI-Specification/

### What is Swagger?

>Swagger is a set of open-source tools built around the OpenAPI Specification that can help you design, build, document and consume REST APIs.[^swagger]

[^swagger]: https://swagger.io/docs/specification/about/

## Summary

We need 3 pieces to document an endpoint under the OpenAPI spec: 
- [PathItemObject][pathobj]: Describes the operations available on a single path. Defines the shape of parameters, requests, and responses for a particular endpoint.
- [Parameter Object][paramobj]: Describes a single operation parameter. The expected format, acceptable values, and whether the parameter is required or optional.
- [Schema Object][schemaobj]: Describes the definition of an input or output data types. These types can be objects, but also primitives and arrays.

[schemaobj]: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#schemaObject

[pathobj]: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#pathItemObject

[paramobj]: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#parameterObject

## Organization

>An OpenAPI document MAY be made up of a single document or be divided into multiple, connected parts at the discretion of the user.[^oas_org]

[^oas_org]: An OpenAPI document is a document (or set of documents) that defines or describes an API. An OpenAPI definition uses and conforms to the OpenAPI Specification. An OpenAPI document that conforms to the OpenAPI Specification is itself a JSON object, which may be represented either in JSON or YAML format. https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#document-structure

The root of our OpenAPI definition lives in `swagger.yml`. This file contains general information about the API, endpoint definitions, and definitions of reusable components. Reference Objects[^oas_ref] are used to allow components to reference each other.

[^oas_ref]: A simple object to allow referencing other components in the specification, internally and externally. https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#referenceObject

For reusability and readability definitions are split into 3 directories.
- `/schemas`
    - Each `.yml` file contains definitions of one or more `SchemaObject`. Each schema more or less corresponds to one of the models in the [`src/models` directory](https://github.com/5e-bits/5e-srd-api/tree/main/src/models).
- `/paths`
    - Each `.yml` file contains definitions of one or more `PathItemObject`, where each of those objects defines an operation on an endpoint. Each file more or less corresponds to a controller in the [`src/controllers/api` directory](https://github.com/5e-bits/5e-srd-api/tree/main/src/controllers/api).
- `/parameters`
    - Contains definitions of reusable path and query parameters.

Each of those directories contains a file named `combined.yml` consisting of named references to each of the objects defined in the other `.yml` files in that directory. The `combined.yml` file provides a single source we can reference from other components.

## Working with our OpenAPI Document

While the `swagger.yml` file along with the contents of all files it references constitute a valid OpenAPI definition, sometimes it's useful to have that definition in a single file. We can validate our OpenAPI definition, and generate a single combined file using the [swagger-cli](https://github.com/APIDevTools/swagger-cli) tool. 

The `/comb` directory contains the results of using this tool to combine our referenced files into a single document. The `JSON` and `YAML` files in that directory are equivalent valid OpenAPI documents.

They were generated with the following commands (after installing `swagger-cli`).
```{bash}
❯ swagger-cli bundle --outfile comb/openapi.yml --type yaml swagger.yml
Created openapi.yml from swagger.yml                                                      
❯ swagger-cli bundle --outfile comb/openapi.json --type json swagger.yml                    
Created openapi.json from swagger.yml
```

## Planned Future Improvements

- Generate pieces of documentation based on source code e.g., generate OpenAPI `SchemaObject` from a TypeScript `type` definition.
- Provide examples for each `Request` and `Response`.



