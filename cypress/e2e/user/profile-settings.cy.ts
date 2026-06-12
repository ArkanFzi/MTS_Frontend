describe("Domain USER / SETTINGS - F28_ProfileSettings (Edit Profil)", () => {
  const mockNewBio = "Software Engineer antusias yang benci bug asinkron.";

  // Data autentikasi
  const mockAuthData = JSON.stringify({
    state: {
      user: { id: "user-123", username: "alvianaditya" },
      isAuthenticated: true,
    },
  });

  it("harus memperbarui data profil komponen UI setelah user mengubah teks Bio dan menekan save", () => {
    // 1. Persiapan: Set storage sebelum visit di domain yang sama
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("useAuthStore", mockAuthData);
        win.localStorage.setItem("auth-storage", mockAuthData);
      },
    });

    // 2. Sekarang baru pindah ke halaman setting setelah login dianggap aktif
    cy.visit("/settings/profile");

    // 3. Verifikasi kita sudah di halaman yang benar
    cy.url().should("include", "/settings/profile");

    // 4. Input Bio
    cy.get("body").then(($body) => {
      const bioInput = $body.find('textarea, input[name*="bio"]');
      if (bioInput.length > 0) {
        cy.wrap(bioInput)
          .first()
          .clear({ force: true })
          .type(mockNewBio, { force: true });
      }
    });

    // 5. Klik Save
    cy.get("body").then(($body) => {
      const saveBtn = $body.find(
        'button[type="submit"], button:contains("Save"), button:contains("Simpan")',
      );
      if (saveBtn.length > 0) {
        cy.wrap(saveBtn).first().click({ force: true });
      }
    });

    // 6. Validasi UI
    cy.contains(mockNewBio, { timeout: 10000 }).should("be.visible");
  });
});
