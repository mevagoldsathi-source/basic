import { defineConfig } from "vite";

/** Only needed once you run `npm run build`. Plain `npm run dev` works
 *  without Vite at all, because the app uses relative ES modules. */
export default defineConfig({
  root: ".",
  server: { port: 5173, open: true },
  build: { outDir: "dist", emptyOutDir: true }
});
