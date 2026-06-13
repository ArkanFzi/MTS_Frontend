describe("Domain MODERATOR - F15_UserBanSanction", () => {
  // Menggunakan perisai global agar aplikasi tidak pernah redirect
  before(() => {
    Cypress.on("window:before:load", (win) => {
      win.localStorage.setItem("userRole", "moderator");
      win.localStorage.setItem("isAuthenticated", "true");
      win.localStorage.setItem("token", "mock-mod-token-123");
    });
  });

  beforeEach(() => {
    // Membypass endpoint pengecekan auth
    cy.intercept("GET", "**/api/me", {
      statusCode: 200,
      body: { data: { role: "moderator" } },
    }).as("authCheck");
  });

  it("harus berhasil memproses pencekalan user dengan mengirimkan alasan hukuman", () => {
    // 1. Intercept POST ke endpoint yang sesuai dengan image_fac6a1.png
    cy.intercept("POST", "**/api/moderator/bans/user-123/ban", {
      statusCode: 200,
      body: { message: "User berhasil dicekal." },
    }).as("banUserRequest");

    // 2. Navigasi
    cy.visit("/moderator/bans");

    // 3. Pastikan kita tidak di /login
    cy.url().should("not.include", "/login");

    // 4. Simulasi input
    // Catatan: Jika selektor masih gagal, ganti ke cy.get('input').first().type(...)
    cy.get('input[name="reason"], textarea[name="reason"]').type(
      "Melanggar aturan komunitas",
    );
    cy.get("button")
      .contains(/ban|blokir/i)
      .click({ force: true });

    // 5. Validasi
    cy.wait("@banUserRequest", { timeout: 10000 });
    cy.contains("User berhasil dicekal.").should("be.visible");
  });
});
