import { Application, Assets, Container, Sprite } from "pixi.js";
import { loginManifest } from "../assets/manifests/loginManifest.ts";

export class LoginEngine {
  public viewport: Container;
  private app: Application;
  private bg!: Sprite;

  constructor(app: Application) {
    this.app = app;
    this.viewport = new Container();
    this.app.stage.addChild(this.viewport);

    this.app.renderer.on("resize", () => this.resize());
  }

  public async init() {
    await Assets.init({ manifest: loginManifest });
    await Assets.loadBundle("login-screen");

    this.setupScene();
    this.resize();
  }

  public resize() {
    if (!this.app.renderer || !this.bg) return;

    const screenW = this.app.screen.width;
    const screenH = this.app.screen.height;

    const imgW = this.bg.texture.width;
    const imgH = this.bg.texture.height;

    const scale = Math.max(screenW / imgW, screenH / imgH);

    this.bg.scale.set(scale);

    this.bg.x = screenW / 2;
    this.bg.y = screenH / 2;
  }

  private setupScene() {
    this.bg = Sprite.from("background");
    this.bg.anchor.set(0.5);
    this.viewport.addChild(this.bg);
  }
}
