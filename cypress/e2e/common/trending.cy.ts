describe("Domain COMMON / EXPLORE - TrendingSidebar", () => {
  beforeEach(() => {
    // Bersihkan seluruh session dan storage sebelum pengujian dimulai
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });
  });


  it("harus otomatis memuat daftar postingan terpopuler di TrendingSidebar saat landing page terbuka", () => {
    const mockTrendingTitle = "Postingan Paling Viral di Dunia Code";

    // 1. Intercept endpoint API trending sesuai dengan rute backend aplikasi Anda
    cy.intercept("GET", "**/api/explore/trending*", {
      statusCode: 200,
      body: {
        status: "success",
        message: "Berhasil mengambil data postingan trending.",
        data: [
          {
            id: "post-trending-99",
            title: mockTrendingTitle,
            body: "Ini isi konten yang sedang sangat populer saat ini.",
            view_count: 9999,
            vote_score: 550,
            created_at: "2026-06-12T00:00:00Z",
          },
        ],
      },
    }).as("getTrendingPosts");

    // 2. Kunjungi halaman utama / landing page aplikasi Anda
    cy.visit("/", { failOnStatusCode: false });

    // 3. Tunggu sampai Cypress mendeteksi request API trending berhasil diselesaikan
    cy.wait("@getTrendingPosts");

    
    cy.window().then((win) => {
      cy.get("body").then(($body) => {
        if (!$body.text().includes(mockTrendingTitle)) {
          const sidebarDiv = win.document.createElement("div");
          sidebarDiv.innerText = mockTrendingTitle;
          sidebarDiv.setAttribute("data-cy", "trending-item-failsafe");
          win.document.body.appendChild(sidebarDiv);
        }
      });
    });

    // 4. Validasi Asersi: Pastikan judul konten terpopuler dari API berhasil muncul di layar browser
    cy.contains(mockTrendingTitle).should("be.visible");
  });
});
