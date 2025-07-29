import express, { Application } from "express";
import MongoDBConnection from "./database/connection";
import config from "./common/app-config";
import templateRoutes from "./routes/templates";
import errorHandler from "./middlewares/error-handler";
import notFound from "./middlewares/not-found-handler";
import cors from "cors";
import _ from "./uibox/designManager";
class App {
  public app: Application;
  constructor() {
    this.app = express();
  }
  public init() {
    this.app.use(cors());
    this.app.use(express.json());
    this.initDatabaseClient();
    this.initRoutes();
    this.app.listen(config.appPort, () => console.log("running", config.appPort));
  }
  public initDatabaseClient() {
    MongoDBConnection.connect((err, db) => {
      console.log(err);
    });
  }
  public initRoutes() {
    this.app.use(templateRoutes);
    this.app.use(notFound);
    this.app.use(errorHandler);
  }
}

const app = new App();

app.init();
