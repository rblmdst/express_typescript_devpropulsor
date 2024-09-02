A small project to show how to create from scratch a Rest API based on **Express** (Node.Js) & **TypeScript**.

This project is related to a series of videos (in French) to learn **Express** from scratch.

You can check the complete playlist (videos are in French) on my YouTube channel (**Dev Propulsor**) for step-by-step tutorials to get there from scratch.

### Install dependencies

```bash
npm install
```

### Build and start the project

```bash
npm run build
npm run start
```

### Build and start the project in dev mode

In case you want to make some changes to the code, you can use the equivalent commands from the previous one but in dev mode (also known as watch mode) to automatically build and restart the project whenever there are changes in the code.

```bash
# Build the project in dev mode
npm run build:dev
# Start the project in dev mode
npm run start:dev
```

### Branches :

- `master` : project without any architecture
- `architecture_3tier` : project with **3-tier** architecture (Controller, Service, Repository)
- `crud__mongoose` : save data into **MongoDB** using **Mongoose** as ODM.
- `jwt_authentication` : JWT Authentication - Registration, Auhentication and Authorization.
- `deploy_ready_with_env_vars` : Make application production ready using environment variables.
