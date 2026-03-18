import { useEffect, useRef, useState } from "react";
import { LoginForm } from "./LoginForm.tsx";
import { LoginEngine } from "../../engine/LoginEngine.ts"; // Uncommented
import { Application } from "pixi.js";

export const LoginCanvas = () => {
  const containerRef = useRef<null | HTMLDivElement>(null);
  const engineRef = useRef<LoginEngine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const app = new Application();
    let isAlive = true;

    const init = async function () {
      try {
        await app.init({
          resizeTo: window,
          preference: "webgl",
          resolution: Math.min(window.devicePixelRatio, 2),
          autoDensity: true,
        });

        if (!isAlive || !containerRef.current) {
          app.destroy(true, { children: true, texture: true });
          return;
        }

        const engine = new LoginEngine(app);
        await engine.init();
        engineRef.current = engine;

        if (isAlive) {
          containerRef.current.appendChild(app.canvas);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("PixiJS Init Failed:", error);
      }
    };

    init();

    return () => {
      isAlive = false;
      engineRef.current = null;
      if (app.renderer) {
        app.destroy(true, { children: true, texture: true });
      }
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-900">
      {/* The PixiJS Layer */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* The UI Overlay Layer */}
      {isLoading ? (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center font-mono text-white">
          Entering the Scriptorium...
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  );
};
