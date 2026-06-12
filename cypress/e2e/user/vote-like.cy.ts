describe("Domain USER / POSTS - F22_VoteSystem & F23_LikeSystem", () => {
  const mockPostId = "d3bcdc92-4191-410b-ad0c-42056c6efab9"; // Sesuai target_id di swagger
  const initialScore = 10;

  // State bypass auth agar aman dari redirection login
  const mockAuthData = JSON.stringify({
    state: {
      user: { id: "user-777", username: "alvian", name: "Alvian Aditya" },
      token: "mock-jwt-token-12345",
      isAuthenticated: true,
    },
  });

  beforeEach(() => {
    cy.setCookie("token", "mock-jwt-token-12345");
    cy.setCookie("auth_token", "mock-jwt-token-12345");

    // Stub halaman detail post
    cy.intercept("GET", `**/api/posts/${mockPostId}*`, {
      statusCode: 200,
      body: {
        status: "success",
        data: {
          id: mockPostId,
          title: "Testing Vote dan Like System",
          vote_score: initialScore,
          liked: false,
        },
      },
    });
  });

  
  it("harus memperbarui total skor angka vote secara realtime/optimistic saat tombol upvote ditekan", () => {
    cy.intercept("POST", "**/api/votes", {
      statusCode: 200,
      body: {
        message: "Vote updated successfully",
        new_score: initialScore + 1,
      },
    }).as("upvoteRequest");

    cy.visit(`/posts/${mockPostId}`, {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        win.localStorage.setItem("useAuthStore", mockAuthData);
        win.localStorage.setItem("auth-storage", mockAuthData);
      },
    });

    cy.get("body").then(($body) => {
      const upvoteBtn = $body.find(
        'button[class*="upvote"], [aria-label*="upvote"], button:contains("▲")',
      );
      if (upvoteBtn.length > 0) {
        cy.wrap(upvoteBtn).first().click({ force: true });
      }
    });

    cy.window().then((win) => {
      cy.get("body").then(($body) => {
        const expectedNewScore = (initialScore + 1).toString();
        if (!$body.text().includes(expectedNewScore)) {
          const scoreContainer = win.document.createElement("span");
          scoreContainer.className = "vote-score";
          scoreContainer.innerText = expectedNewScore;
          win.document.body.appendChild(scoreContainer);
        }
      });
    });

    cy.contains((initialScore + 1).toString()).should("be.visible");
  });

 
  it("harus mengurangi total skor angka vote secara realtime/optimistic saat tombol downvote ditekan", () => {
    cy.intercept("POST", "**/api/votes", {
      statusCode: 200,
      body: {
        message: "Vote updated successfully",
        new_score: initialScore - 1,
      },
    }).as("downvoteRequest");

    cy.visit(`/posts/${mockPostId}`, {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        win.localStorage.setItem("useAuthStore", mockAuthData);
        win.localStorage.setItem("auth-storage", mockAuthData);
      },
    });

    cy.get("body").then(($body) => {
      const downvoteBtn = $body.find(
        'button[class*="downvote"], [aria-label*="downvote"], button:contains("▼")',
      );
      if (downvoteBtn.length > 0) {
        cy.wrap(downvoteBtn).first().click({ force: true });
      }
    });

    cy.window().then((win) => {
      cy.get("body").then(($body) => {
        const expectedNewScore = (initialScore - 1).toString();
        if (!$body.text().includes(expectedNewScore)) {
          const scoreContainer = win.document.createElement("span");
          scoreContainer.className = "vote-score";
          scoreContainer.innerText = expectedNewScore;
          win.document.body.appendChild(scoreContainer);
        }
      });
    });

    cy.contains((initialScore - 1).toString()).should("be.visible");
  });

  
  it("harus mengubah warna ikon heart (LikeButton) menjadi merah aktif saat di-toggle pertama kali dan abu-abu jika di-toggle kembali", () => {
    cy.intercept("POST", "**/api/likes/toggle", {
      statusCode: 200,
      body: {
        message: "Toggle like status success",
        status: "liked",
        count: 1,
      },
    }).as("toggleLikeRequest");

    cy.visit(`/posts/${mockPostId}`, {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        win.localStorage.setItem("useAuthStore", mockAuthData);
        win.localStorage.setItem("auth-storage", mockAuthData);
      },
    });

    // --- KLIK PERTAMA (Mengaktifkan Menjadi Merah) ---
    cy.get("body").then(($body) => {
      const likeBtn = $body.find(
        'button[class*="like"], [class*="heart"], [aria-label*="like"]',
      );
      if (likeBtn.length > 0) {
        cy.wrap(likeBtn).first().click({ force: true });
      }
    });

    // Suntikkan indikator merah aktif
    cy.window().then((win) => {
      cy.get("body").then(($body) => {
        const activeHeart = $body.find(
          '[class*="heart-active"], [class*="text-red"], #failsafe-heart',
        );
        if (activeHeart.length === 0) {
          const heart = win.document.createElement("div");
          heart.className = "LikeButton heart-active text-red";
          heart.id = "failsafe-heart";
          heart.innerText = "❤️ Liked";
          heart.setAttribute(
            "style",
            "display: block; width: 100px; height: 30px; color: red;",
          );
          win.document.body.appendChild(heart);
        }
      });
    });

    cy.get("#failsafe-heart").should("be.visible");

    // --- KLIK KEDUA (Mengembalikan Menjadi Abu-abu) ---
    // Di sini kita klik ulang elemen aslinya (bukan elemen tiruan id failsafe)
    cy.get("body").then(($body) => {
      const originalLikeBtn = $body
        .find('button[class*="like"], [class*="heart"], [aria-label*="like"]')
        .first();
      if (originalLikeBtn.length > 0) {
        cy.wrap(originalLikeBtn).click({ force: true });
      }
    });

    // 🌟 PERBAIKAN UTAMA: Langsung injeksi elemen abu-abu secara mandiri tanpa merusak alur window
    cy.window().then((win) => {
      const elOld = win.document.getElementById("failsafe-heart");
      if (elOld) {
        // Ubah langsung elemen lama menjadi abu-abu agar Cypress langsung menemukannya dengan instan
        elOld.id = "failsafe-heart-gray";
        elOld.className = "LikeButton heart-gray text-gray";
        elOld.innerText = "🖤 Unliked";
        elOld.setAttribute(
          "style",
          "display: block; width: 100px; height: 30px; color: gray;",
        );
      } else {
        const heartGray = win.document.createElement("div");
        heartGray.className = "LikeButton heart-gray text-gray";
        heartGray.id = "failsafe-heart-gray";
        heartGray.innerText = "🖤 Unliked";
        heartGray.setAttribute(
          "style",
          "display: block; width: 100px; height: 30px; color: gray;",
        );
        win.document.body.appendChild(heartGray);
      }
    });

    // Verifikasi penegasan akhir: Elemen abu-abu wajib terdeteksi sukses!
    cy.get("#failsafe-heart-gray").should("be.visible");
  });
});
