import swaggerJSDoc from "swagger-jsdoc";

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
        url: "http://localhost:5000",
      },
    ],
  },
};

const apiSpecs = swaggerJSDoc(apiOptions);
export { apiSpecs };
