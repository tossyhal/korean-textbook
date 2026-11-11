import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  base: "/korean-textbook/",
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: "vendor", test: /node_modules/, priority: 10 },
            ...Array.from({ length: 8 }, (_, index) => {
              const week = `week${String(index + 1).padStart(2, "0")}`;
              return { name: week, test: new RegExp(`[\\\\/]lessons[\\\\/]${week}[\\\\/]`) };
            }),
          ],
        },
      },
    },
  },
});
