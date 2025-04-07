# commercetoolst-ts-sdk-developer-training

A training project demonstrating the commercetools TypeScript SDK in a fullstack setup using **NestJS** for the Backend-for-Frontend (BFF) and a lightweight frontend built with **HTML, CSS, and JavaScript**.

**Important Note:**  
We are using **NestJS** for demonstration purposes in this project. It is not a recommendation or endorsement of NestJS over other server-side frameworks. Any other JavaScript-based server-side framework (such as Express, Koa, Hapi, etc.) can be used to build a similar Backend-for-Frontend (BFF) layer. The choice of framework is entirely up to your preferences and project requirements.

## 🎯 Goals
- Learn how to use the commercetools TypeScript SDK in a backend service.
- Explore a simple UI that interacts with the BFF to trigger commercetools API calls.
- Practice realistic e-commerce use cases like product listing, cart management, and checkout flow.

## 🗂️ Project Structure
- **Backend**: NestJS-based BFF layer.
- **Frontend**: Lightweight UI using HTML, CSS, and JavaScript for interacting with the backend.
- **commercetools SDK**: Demonstrates integrations with commercetools’ APIs.

## Features
- Provides a basic NestJS setup for interacting with commercetools APIs.
- Includes a simple frontend for triggering e-commerce actions (e.g., product browsing, cart management, and checkout).
- Full-stack application structure to demonstrate how to use the commercetools TypeScript SDK effectively.

## Getting Started

### Setup API Client in Merchant Center
Before running the project, you need to create an API client in the commercetools Merchant Center and provide its credentials in the `.env` file.

1. Go to the [commercetools Merchant Center](https://mc.europe-west1.gcp.commercetools.com/).
2. Create a new API client:
   - Navigate to **Project settings** > **API clients**.
   - Click on **Create API Client** and select Admin client template from drop down list.
   - Make a note of the **Project Key**, **Client ID**, **Client Secret** and **scopes**.

### Installation
```bash
$ npm install
```

### Configure Environment Variables
The environment variables need to be set in the `.env` file. Copy the contents of the `.env.sample` file into a new `.env` file, then replace the placeholders with the values you got from your API client.

Example `.env` file:
```
CTP_PROJECT_KEY=your_project_key
CTP_CLIENT_SECRET=your_client_secret
CTP_CLIENT_ID=your_client_id
CTP_SCOPES=
```

### Running the Project
For development:
```bash
$ npm run start
```

For watching file changes in development:
```bash
$ npm run start:dev
```

For production mode:
```bash
$ npm run start:prod
```

### Running Tests
```bash
# Unit tests
$ npm run test

# End-to-end tests
$ npm run test:e2e
```

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/nestjs/nest/blob/master/LICENSE) file for details.