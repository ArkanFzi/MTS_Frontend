describe("Domain ADMIN - F10, F11, & F12 Master Data Management", () => {
  before(() => {
    Cypress.on("window:before:load", (win) => {
      win.localStorage.setItem("userRole", "moderator");
      win.localStorage.setItem("isAuthenticated", "true");
    });
  });

  // F10: Menambah Kategori
  it("harus berhasil menambahkan item master Kategori baru dan merendernya langsung ke dalam tabel list", () => {
    cy.intercept("POST", "**/api/moderator/categories", {
      statusCode: 201,
      body: {
        message: "Category created successfully",
        data: { name: "New Category" },
      },
    }).as("postCategory");

    cy.visit("/moderator/categories");
    cy.get('input[name="name"]').type("New Category");
    cy.get("button#submit-category").click();

    cy.wait("@postCategory");
    cy.get("table").should("contain", "New Category");
  });

  // F12: Menambah Tag
  it("harus berhasil menambahkan item master Tag baru dan merendernya langsung ke dalam tabel list", () => {
    cy.intercept("POST", "**/api/moderator/tags", {
      statusCode: 201,
      body: { message: "Tag berhasil dibuat.", data: { name: "New Tag" } },
    }).as("postTag");

    cy.visit("/moderator/tags");
    cy.get('input[name="name"]').type("New Tag");
    cy.get('input[name="color"]').type("#FFFFFF"); // Sesuai regex ^#[0-9A-Fa-f]{6}$
    cy.get("button#submit-tag").click();

    cy.wait("@postTag");
    cy.get("table").should("contain", "New Tag");
  });

  // F11: Menambah Badge
  it("harus berhasil menambahkan item master Badge baru beserta URL iconnya dan merendernya langsung ke dalam tabel list", () => {
    cy.intercept("POST", "**/api/moderator/badges", {
      statusCode: 201,
      body: { message: "Badge berhasil dibuat.", data: { name: "New Badge" } },
    }).as("postBadge");

    cy.visit("/moderator/badges");
    cy.get('input[name="name"]').type("New Badge");
    cy.get('input[name="icon_url"]').type("http://example.com/icon.png");
    cy.get('select[name="tier"]').select("bronze"); // Sesuai allowed values
    cy.get("button#submit-badge").click();

    cy.wait("@postBadge");
    cy.get("table").should("contain", "New Badge");
  });
});
