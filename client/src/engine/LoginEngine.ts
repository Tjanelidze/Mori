import {
  Application,
  Assets,
  Container,
  Rectangle,
  Sprite,
  Texture,
} from "pixi.js";
import { loginManifest } from "../assets/manifests/loginManifest.ts";

export class LoginEngine {
  public viewport: Container;
  private app: Application;
  private bg!: Sprite;
  private readonly SPRITE_CONFIGS = {
    hero: {
      alias: "hero_idle",
      frameWidth: 384,
      frameHeight: 438,
      frameCount: 7,
      frameDuration: 0.4,
      anchorX: 0.5,
      anchorY: 0.5,
      scale: 0.4,
      xOffset: 0.001,
      yOffset: -0.115,
    },
    cat: {
      alias: "cat",
      frameWidth: 596,
      frameHeight: 380,
      frameCount: 16,
      frameDuration: 0.25,
      anchorX: 2.1,
      anchorY: -1.6,
      scale: 0.3,
      xOffset: 0.001,
      yOffset: -0.115,
    },
    candle: {
      alias: "candle",
      frameWidth: 288,
      frameHeight: 436,
      frameCount: 9,
      frameDuration: 0.25,
      anchorX: 2.1,
      anchorY: -0.15,
      scale: 0.2,
      xOffset: 0.001,
      yOffset: -0.115,
    },
  } as const;
  private sprites = new Map<string, Sprite>();

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

    for (const [key, config] of Object.entries(this.SPRITE_CONFIGS)) {
      const sprite = this.createAnimatedSprite(
        config.alias,
        config.frameWidth,
        config.frameHeight,
        config.frameCount,
        config.frameDuration,
        config.anchorX,
        config.anchorY,
      );
      this.sprites.set(key, sprite);
    }

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

    for (const [key, sprite] of this.sprites) {
      const config =
        this.SPRITE_CONFIGS[key as keyof typeof this.SPRITE_CONFIGS];
      this.positionSprite(
        sprite,
        config.scale,
        config.xOffset,
        config.yOffset,
        scale,
        screenW,
        screenH,
        imgW,
        imgH,
      );
    }
  }

  private setupScene() {
    this.bg = Sprite.from("background");
    this.bg.anchor.set(0.5);
    this.viewport.addChild(this.bg);
  }

  private positionSprite(
    sprite: Sprite,
    scaleMultiplier: number,
    xOffset: number,
    yOffset: number,
    scale: number,
    screenW: number,
    screenH: number,
    imgW: number,
    imgH: number,
  ) {
    sprite.scale.set(scale * scaleMultiplier);
    sprite.x = screenW / 2 + xOffset * imgW * scale;
    sprite.y = screenH / 2 + yOffset * imgH * scale;
  }

  private createAnimatedSprite(
    alias: string,
    frameWidth: number,
    frameHeight: number,
    frameCount: number,
    frameDuration: number,
    anchorX = 0.5,
    anchorY = 0.5,
  ): Sprite {
    const sheetTexture: Texture = Assets.get(alias);

    const frames = Array.from(
      { length: frameCount },
      (_, i) =>
        new Texture({
          source: sheetTexture.source,
          frame: new Rectangle(i * frameWidth, 0, frameWidth, frameHeight),
        }),
    );

    const sprite = new Sprite(frames[0]);
    sprite.anchor.set(anchorX, anchorY);
    this.viewport.addChild(sprite);

    let currentFrame = 0;
    let elapsedTime = 0;

    this.app.ticker.add((ticker) => {
      elapsedTime += ticker.deltaTime / 60;

      if (elapsedTime >= frameDuration) {
        elapsedTime = 0;
        currentFrame = (currentFrame + 1) % frameCount;
        sprite.texture = frames[currentFrame];
      }
    });

    return sprite;
  }
}
