import { useEffect, useRef } from "react";

import { LoginForm } from "./LoginForm.tsx";
// import { LoginEngine } from "../../engine/LoginEngine.ts";
import { Application } from "pixi.js";

export const LoginCanvas = () => {
  const containerRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const app = new Application();
    let isAlive = true;

    const init = async function () {
      await app.init({
        resizeTo: window,
        preference: "webgl",
      });

      if (!containerRef.current || !isAlive) return;

      containerRef.current.appendChild(app.canvas);
    };

    init();
    return () => {
      isAlive = false;
      app.destroy(true);
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />

      <LoginForm />
    </div>
  );
};
