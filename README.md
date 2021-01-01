
<h1 align="center">Url Shortner</h1>



## ❯ Table of Contents

-   [Getting Started](#-getting-started)
-   [Scripts and Tasks](#-scripts-and-tasks)



## ❯ Getting Started

### Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

Install [Node.js and NPM](https://nodejs.org/en/download/)

-   on OSX use [homebrew](http://brew.sh) `brew install node`
-   on Windows use [chocolatey](https://chocolatey.org/) `choco install nodejs`

Install yarn globally

```bash
yarn global add yarn
```

Install MongoDB.


### Step 2: Create new Project

Configure your package.json for your new project.

Then copy the `.env.example` file and rename it to `.env`. In this file you have to add your database connection information.

Create a new database with the name you have in your `.env`-file.

Then setup your application environment.

```bash
yarn run setup
```

> This installs all dependencies with yarn. After that it migrates the database and seeds some test data into it. So after that your development environment is ready to use.

### Step 3: Serve your App

Go to the project dir and start your app with this yarn script.

```bash
yarn start serve
```

> This starts a local server using `nodemon`, which will watch for any file changes and will restart the server according to these changes.
> The server address will be displayed to you as `http://0.0.0.0:3000`.


## ❯ Scripts and Tasks

All script are defined in the `package-scripts.js` file, but the most important ones are listed here.

### Install

-   Install all dependencies with `yarn install`

### Running in dev mode

-   Run `yarn start serve` to start nodemon with ts-node, to serve the app.
-   The server address will be displayed to you as `http://0.0.0.0:3000`

### Building the project and run it

-   Run `yarn start build` to generated all JavaScript files from the TypeScript sources (There is also a vscode task for this called `build`).
-   To start the builded app located in `dist` use `yarn start`.


