# Note on Swagger & RAML

KPMG has been an early adopter in the area of documenting API specs in standardized, machine-readable, and easily editable formats.  This has significantly enhanced our development process and drastically reduced integration issues.

After using Swagger on a few projects, we found that the process of writing an maintaining Swagger specs was cumbersome, tedious, and error prone because the Swagger syntax is not tailored towards the software engineering best practices of composability and reuse.

A few years ago, we switched to recommending [RAML](http://raml.org) instead of Swagger as the API definition syntax on our projects.  

# What we do with RAML

Leveraging RAML, our "accelerator" (code our teams can fork from when creating new projects for clients) provides several useful capabilities out of the box.

1.  Documentation generation.  Human-friendly API docs are generated as static HTML files based on RAML specs. 
1.  Client-side API wrapper.  As part of the UI build process, a JavaScript module is generated with function, parameter, and attribute names based on the documentation.  This makes it simpler for UI developers to code against the defined REST APIs.
1.  Static mocks.  One of our goals in project management is ensuring that nobody on the team is ever blocked from making forward progress.  A common issue we encounter is backend development and UI development not being 100% aligned on schedules.  Some things are simply harder to do on one side or the other.  To enable different sides of the stack to progress independently, our Express server identifies calls to APIs that have not yet been implemented and, instead of returning a 404, returns a response based on the *example* defined for that endpoint in the RAML spec.  UI development can move forward coding against services and the example data they return.  As individual services are implemented for real, the UI that's been built against these mocks often works perfect without any additional integration work being needed.
1.  Static schema validation.  As part of the build process, RAML files are validated for compliance with the RAML spec.  Additionally, examples for request/response bodies in the RAML files are validated against the corresponding JSON schemas in the RAML files.  This prevents the common problem of schemas and examples not being kept up to date with each other.
1.  Runtime validation proxy.  When running the Express server in non-production mode, all request & response bodies will be validated against the schemas defined for their endpoints in RAML.  This enables us to quickly find and identify issues where the client or server is not sending data in the expected structure.
1.  Server-side codegen.  While not demonstrated in this prototype, we also have acclerators for doing codegen of Java & C# service interfaces & DTO classes.  These help expedite service implementation and further help ensure that the implementation of the interface matches the spec.  Additionally, because these are strongly typed languages, many types of breaking changes to RAML specs will result in the Java/C# projects failing to build - a good thing because it forces the team to have a discussion & remediation rather than let the issue linger.

# For this prototype

Each of these capabilities could certainly be implemented with Swagger as well.  However, in the interest of time, we have decided to sitck with using RAML as the "source of truth" for this project and to leverage our existing RAML-based versions of these capabilities.  To meet the requirement of providing a Swagger spec, we have created a script that converts RAML to Swagger and validates the result against the Swagger schema.

The `api.v1.yaml` file in this folder is a Swagger spec generated from `./raml/api.v1.raml`
by running `npm run raml2swagger`.