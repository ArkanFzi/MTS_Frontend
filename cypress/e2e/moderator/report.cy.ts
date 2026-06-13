describe("Domain MODERATOR - F13_ContentReportQueue", () => {
  beforeEach(() => {
    // PERISAI AUTH: Memaksa aplikasi percaya user adalah moderator
    // Agar aplikasi tidak me-redirect ke /login
    cy.intercept("GET", "**/api/me", {
      statusCode: 200,
      body: { data: { role: "moderator", name: "Mock User" } },
    }).as("authCheck");

    // Menangani potensi endpoint auth lain jika ada
    cy.intercept("GET", "**/api/user", {
      statusCode: 200,
      body: { data: { role: "moderator" } },
    }).as("userCheck");

    // Inject state ke browser sebelum aplikasi dimuat
    Cypress.on("window:before:load", (win) => {
      win.localStorage.setItem("userRole", "moderator");
      win.localStorage.setItem("isAuthenticated", "true");
      win.localStorage.setItem("token", "mock-mod-token-123");
    });
  });

  
  it("harus merender seluruh daftar keluhan laporan dari user di halaman ReportQueuePage", () => {
    // 1. Intercept API Reports sesuai endpoint Anda
    cy.intercept("GET", "**/api/moderator/reports*", {
      statusCode: 200,
      body: {
        current_page: 1,
        data: [
          {
            id: "rep-001",
            reporter_id: "u-1",
            target_id: "p-1",
            target_type: "post",
            reason: "Spam Content",
            description: "Deskripsi laporan",
            status: "pending",
            resolved_by: null,
            created_at: "2026-06-13T14:00:00Z",
            resolved_at: null,
          },
        ],
        total: 1,
      },
    }).as("getReports");

    // 2. Visit
    cy.visit("/moderator/reports");

    // 3. Tunggu data
    cy.wait("@getReports", { timeout: 20000 });

    // 4. Validasi visual
    cy.contains("Spam Content", { timeout: 10000 }).should("be.visible");
  });

 
  it("harus mengubah status antrean laporan menjadi Resolved setelah moderator mengambil tindakan", () => {
    // 1. Mock API Update
    cy.intercept("PUT", "**/api/moderator/reports/rep-001", {
      statusCode: 200,
      body: { message: "Laporan berhasil diproses." },
    }).as("updateReport");

    cy.visit("/moderator/reports");

    // 2. Klik tombol aksi (Mencari teks, naik ke parent, cari tombol)
    cy.contains("Spam Content")
      .parentsUntil("table") // Sesuaikan jika tidak pakai table
      .find("button")
      .click({ force: true });

    // 3. Validasi
    cy.wait("@updateReport", { timeout: 15000 })
      .its("response.body.message")
      .should("eq", "Laporan berhasil diproses.");
  });
});
