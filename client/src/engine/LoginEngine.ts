import { Application, Container } from "pixi.js";

export class LoginEngine {
  public viewport: Container;
  private app: Application;

  constructor(app: Application) {
    this.app = app;
    this.viewport = new Container();
    this.app.stage.addChild(this.viewport);
  }

  // async loadAssets() {}
}
