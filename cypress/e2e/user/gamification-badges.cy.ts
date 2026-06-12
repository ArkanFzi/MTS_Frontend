describe("Domain USER / GAMIFICATION - F27 & F29", () => {
  beforeEach(() => {
    cy.setCookie("token", "mock-jwt-token-xyz789");
    cy.window().then((win) => {
      win.localStorage.setItem(
        "useAuthStore",
        JSON.stringify({
          state: { isAuthenticated: true },
        }),
      );
    });
  });

  it("harus merender data leaderboard", () => {
    // Intercept dengan wildcard agar selalu tertangkap
    cy.intercept("GET", "**/api/explore/leaderboard*", {
      statusCode: 200,
      body: {
        success: true,
        data: [
          { username: "UserTop", points: 1000 },
          { username: "UserRunnerUp", points: 500 },
        ],
      },
    }).as("getLeaderboard");

    cy.visit("/leaderboard", { failOnStatusCode: false });

    // Validasi tanpa selector table:
    // Kita cek langsung teks yang muncul di halaman
    cy.contains("UserTop", { timeout: 15000 }).should("be.visible");
    cy.contains("UserRunnerUp").should("be.visible");
  });

  it("harus menampilkan badge koleksi", () => {
    cy.intercept("GET", "**/api/me/badges*", {
      statusCode: 200,
      body: {
        success: true,
        data: ["Bronze", "Silver", "Gold"],
      },
    }).as("getBadges");

    cy.visit("/badges", { failOnStatusCode: false });

    // Validasi tanpa cy.wait:
    // Kita gunakan cy.contains yang memiliki built-in retry/polling
    ["Bronze", "Silver", "Gold"].forEach((badgeName) => {
      cy.contains(badgeName, { timeout: 15000 }).should("be.visible");
    });
  });
});
