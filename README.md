# Folder Structures & Purpose

```
/migrations             // holds migration files
/src                    // application code
 -- /Applications       // application business process (use cases) [ONLY DEPEND TO DOMAINS]
 -- /Commons            // shared helpers & exceptions used by infrastructures/interfaces 
 -- /Domains            // enterprise business rules (entities, repository interfaces) [NO DEPENDENCY]
 -- /Infrastructures    // tools, frameworks, and concrete implementation of repositories
 -- /Interfaces         // interface between infrastructures and use cases (e.g. handlers, routes, controllers)
/tests                  // database test helpers
```

## Refs
(https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
