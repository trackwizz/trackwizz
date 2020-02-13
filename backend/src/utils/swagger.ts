/**
 * Swagger is an open-source documentation specification for rest-api.
 * This is to built this documentation. The 'swagger-jsdoc' library takes .yaml files in the project
 * and creates a json documentation available at: /api-docs
 */
import swaggerJSDoc from "swagger-jsdoc";

let url: string = "http://localhost:5000";
// prod
if (process.env.BACKEND_NAME_FULL) {
  url = process.env.BACKEND_NAME_FULL;
}

const apiOptions: swaggerJSDoc.Options = {
  apis: ["./src/utils/*.yaml", "./src/providers/*.yaml", "./src/providers/*/**.yaml", "./src/controllers/*.yaml", "./src/entities/*.yaml"],
  swaggerDefinition: {
    info: {
      description: "This is the TrackWizz backend project:\nYou will find here all the docs for TrackWizz backend API.",
      title: "TrackWizz Backend API",
      version: "1.0.0",
    },
    openapi: "3.0.0",
    servers: [
      {
        description: "",
        url: url,
      },
    ],
  },
};

const apiSpecs = swaggerJSDoc(apiOptions);
export { apiSpecs };
