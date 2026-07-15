# Templates

## Contribution

The repo consists primarily of templates and files in their respective directories. The files are the boilerplate that is used to set up a new project. The templates are used by the `universe` cli to configure the project (e.g. pin dependencies, create docker config).

The most basic contribution is a new framework. Frameworks are quite general - anything from a single package.json file to an entire application. The only requirement is that they're a good place to start a project.

### Before creating a PR

The templates in this repo are designed to be used in conjunction with the [universe cli](https://github.com/freeCodeCamp-Universe/universe-cli). When adding a new template, make sure that is compatible with the cli by first running `pnpm build` then using `UNIVERSE_TEMPLATES_DIR=/path/to/dist/in/this/repo universe create`. If the new project starts without errors, you're good to go.
