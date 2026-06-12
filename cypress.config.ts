import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // 👈 Tulis alamat localhost proyek React Anda disini
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
