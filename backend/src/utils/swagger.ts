import swaggerJSDoc from "swagger-jsdoc";

const apiOptions: swaggerJSDoc.Options = {
  apis: ["./dist/controllers/*.js", "./src/controllers/*.yaml", "./dist/entities/*.js", "./src/entities/*.yaml"],
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
