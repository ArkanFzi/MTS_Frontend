describe("Domain ADMIN - F9_UserManagement", () => {
  beforeEach(() => {
    // Perisai Auth agar Admin tetap login
    Cypress.on("window:before:load", (win) => {
      win.localStorage.setItem("userRole", "admin");
      win.localStorage.setItem("isAuthenticated", "true");
    });

    cy.intercept("GET", "**/api/me", {
      statusCode: 200,
      body: { data: { role: "admin" } },
    });
  });

  // Skenario 1: Menampilkan tabel user
  it("harus menampilkan tabel seluruh isi direktori pengguna aplikasi secara lengkap pada UserDirectoryPage", () => {
    cy.intercept("GET", "**/api/admin/users", {
      statusCode: 200,
      body: {
        data: [
          { id: "u-1", name: "User Satu", role: "user" },
          { id: "u-2", name: "User Dua", role: "moderator" },
        ],
      },
    }).as("getUsers");

    cy.visit("/admin/users"); // Sesuaikan path dengan AppRouter Anda
    cy.wait("@getUsers");

    cy.get("table").should("contain", "User Satu");
    cy.get("table").should("contain", "User Dua");
  });

  // Skenario 2: Mengubah role user via dropdown
  it("harus sukses mengubah role tingkatan akun user lain melalui komponen pilihan dropdown", () => {
    cy.intercept("PUT", "**/api/admin/users/u-1/role", {
      statusCode: 200,
      body: { message: "Role berhasil diubah." },
    }).as("updateRole");

    cy.visit("/admin/users");

    // Simulasi pilih dropdown dan ganti role
    cy.get('tr:contains("User Satu")').find("select").select("moderator");

    // Validasi API PUT terpanggil
    cy.wait("@updateRole").its("response.statusCode").should("eq", 200);
    cy.contains("Role berhasil diubah.").should("be.visible");
  });
});
