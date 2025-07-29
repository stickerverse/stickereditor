import { NextFunction, Response, Request } from "express";
import TemplatesController from "../controllers/templates";
import { uploadImageToS3 } from "../services/aws";
import designManager from "../uibox/designManager";

class TemplatesHandler {
  private controller: TemplatesController;
  constructor() {
    this.controller = new TemplatesController();
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.downloadById = this.downloadById.bind(this);
  }

  public async get(req: Request, res: Response, next: NextFunction) {
    try {
      const templates = await this.controller.get();
      return res.send(templates);
    } catch (err) {
      next(err);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const template = await this.controller.getById(id);
      return res.send(template);
    } catch (err) {
      next(err);
    }
  }

  public async downloadById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const template = await this.controller.getById(id);
      await designManager.loadTemplate(template);
      const data = await designManager.downloadTemplate();
      return res.send(data);
    } catch (err) {
      console.log("err", err);
      next(err);
    }
  }

  public async download(req: Request, res: Response, next: NextFunction) {
    try {
      const template = req.body;
      await designManager.loadTemplate(template);
      const base64Image = await designManager.downloadTemplate();
      const imageURL = await uploadImageToS3(base64Image);
      return res.send({ source: imageURL });
    } catch (err) {
      console.log("err", err);
      next(err);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      await designManager.loadTemplate(data);
      const base64Image = await designManager.downloadTemplate();
      const imageURL = await uploadImageToS3(base64Image);

      const template = await this.controller.create({ ...data, preview: imageURL });

      return res.send(template);
    } catch (err) {
      next(err);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const data = req.body;
      const template = await this.controller.update(id, data);
      return res.send(template);
    } catch (err) {
      next(err);
    }
  }

  public async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const template = await this.controller.remove(id);
      return res.send(template);
    } catch (err) {
      next(err);
    }
  }
}

export default TemplatesHandler;
