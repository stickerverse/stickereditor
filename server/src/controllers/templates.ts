import { Template } from "../common/interfaces";
import { MongoDBClient } from "../database/client";

class Controller {
  private client: MongoDBClient;
  constructor() {
    this.client = new MongoDBClient();
  }

  public async get() {
    try {
      const data = await this.client.find("templates", {});
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async create(data: Template) {
    try {
      const template = await this.client.insert("templates", data);
      return template;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async update(id: string, data: Template) {
    try {
      const template = await this.client.update("templates", id, data);
      return template;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async remove(id: string) {
    try {
      const template = await this.client.remove("templates", id);
      return template;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async getById(id: string): Promise<Template> {
    try {
      const data = (await this.client.findOneById("templates", id)) as Template;
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default Controller;
