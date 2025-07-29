import { Router } from "express";
import TemplateHandlers from "../handlers/templates";

class TemplatesRouter {
  router: Router;
  handlers: TemplateHandlers;
  constructor() {
    this.router = Router();
    this.handlers = new TemplateHandlers();
    this.init();
  }

  private init() {
    this.router.get("/templates", this.handlers.get);
    this.router.get("/templates/:id", this.handlers.getById);
    this.router.get("/templates/:id/download", this.handlers.downloadById);
    this.router.post("/templates/download", this.handlers.download);
    this.router.post("/templates", this.handlers.create);

    this.router.put("/templates/:id", this.handlers.update);
    this.router.delete("/templates/:id", this.handlers.remove);
  }
}

const templatesRouter = new TemplatesRouter().router;

export default templatesRouter;
