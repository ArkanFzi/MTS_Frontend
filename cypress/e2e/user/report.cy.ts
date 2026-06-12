describe("Debug Halaman Report", () => {
  it("Menganalisa isi halaman", () => {
    cy.setCookie("token", "mock-jwt-token-xyz789");
    cy.visit("/content-page");

    // 1. Log URL saat ini untuk memastikan kita tidak ter-redirect
    cy.url().then((url) => {
      cy.log("URL saat ini adalah: " + url);
    });

    // 2. Ambil seluruh HTML body untuk melihat struktur halaman
    cy.get("body").then(($body) => {
      const html = $body.html();
      // Print ke console browser (buka inspect element -> console)
      console.log("Struktur HTML Halaman:", html);

      // Jika teks "Report" atau "Laporkan" ada di mana pun dalam body
      if (
        html.toLowerCase().includes("report") ||
        html.toLowerCase().includes("laporkan")
      ) {
        cy.log("DITEMUKAN: Kata 'report' atau 'laporkan' ada di halaman.");
      } else {
        cy.log(
          "TIDAK DITEMUKAN: Kata 'report' atau 'laporkan' tidak ada di halaman.",
        );
      }
    });

    // 3. Cari elemen yang mungkin menjadi tombol (bukan hanya <button>)
    // Kadang developer menggunakan <a>, <div>, atau <span> sebagai tombol
    cy.get("body")
      .find("*")
      .then(($elements) => {
        const clickable = $elements.filter((i, el) => {
          const role = el.getAttribute("role");
          const onclick = el.getAttribute("onclick");
          return role === "button" || onclick !== null;
        });
        cy.log("Jumlah elemen yang bisa diklik: " + clickable.length);
      });
  });
});
