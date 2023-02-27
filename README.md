<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Welcome to You've got time Microservices

This application is built using [NestJS](https://github.com/nestjs/nest), a powerful Node.js framework for building efficient and scalable server-side applications.

## Technologies Used

- MongoDB as the primary database for storing data
- RabbitMQ for handling async messaging and background jobs

## Services

- Authentication Service: Handles user authentication and authorization
- Event Service: Allows users to create events and manage their availability
- Messages Service: Sends out email notifications to users

## Getting Started

To get started with the application just run:

```bash
$ docker compose up
```

or make sure that you have MongoDB and RabbitMQ installed and running on your machine.
Install the dependencies and start each microservice.

```bash
$ pnpm install
$ pnpm start:dev authentication
$ pnpm start:dev event-svc
$ pnpm start:dev messaging
```

## Configuration

You will also need to set up the necessary environment variables for the application to function properly.

Each service under the `apps` folder has a `.env.example` file. Rename to to `.env` and modify the variables there.

## Helm Charts

This project also contains Helm charts for easy deployment to a Kubernetes cluster.
