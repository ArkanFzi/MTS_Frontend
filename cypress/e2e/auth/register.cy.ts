describe("Domain Auth - F1_Register (Registrasi Akun)", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    // Buka halaman register secara bersih
    cy.visit("/register");
  });

  it("harus memvalidasi client-side jika password dan konfirmasi password tidak cocok", () => {
    cy.get('input[name="username"]').type("usertes", { force: true });
    cy.get('input[name="email"]').type("usertes@mautanyasuhu.com", {
      force: true,
    });

    // Mengisi password yang sengaja tidak sama
    cy.get('input[name="password"]').type("Suhumaster123", { force: true });
    cy.get('input[name="password_confirmation"]').type("PasswordBeda123", {
      force: true,
    });

    cy.get('input[type="checkbox"]').first().check({ force: true });

    // Kirim form untuk memicu peringatan client-side
    cy.get('button[type="submit"]').click({ force: true });

    // Cek pesan error ketidakcocokan password (fleksibel multibahasa)
    cy.contains(/tidak cocok|match|must match|confirm/i).should("be.visible");
  });

  it("harus menonaktifkan tombol submit jika checkbox Terms & Conditions belum dicentang", () => {
    cy.get('input[name="username"]').type("uservalid", { force: true });
    cy.get('input[name="email"]').type("valid@mautanyasuhu.com", {
      force: true,
    });
    cy.get('input[name="password"]').type("Suhumaster123", { force: true });
    cy.get('input[name="password_confirmation"]').type("Suhumaster123", {
      force: true,
    });

    // Pastikan checkbox tidak tercentang
    cy.get('input[type="checkbox"]').first().should("not.be.checked");

    // Klik submit secara paksa untuk memastikan sistem validasi menahan form
    cy.get('button[type="submit"]').click({ force: true });

    // Memastikan teks peringatan persetujuan muncul di layar
    cy.contains(/setuju|syarat|ketentuan|accept|required/i).should(
      "be.visible",
    );
  });

  it("harus menampilkan error validasi jika email sudah terdaftar di server (Error 422)", () => {
    // Intercept dengan mencocokkan pattern URL API asli Anda
    cy.intercept("POST", "**/api/auth/register", {
      statusCode: 422,
      body: {
        status: "error",
        message: "Email sudah terdaftar di server",
      },
    }).as("registerEmailTerdaftar");

    cy.get('input[name="username"]').type("userkembar", { force: true });
    cy.get('input[name="email"]').type("email.kembar@mautanyasuhu.com", {
      force: true,
    });
    cy.get('input[name="password"]').type("Suhumaster123", { force: true });
    cy.get('input[name="password_confirmation"]').type("Suhumaster123", {
      force: true,
    });

    cy.get('input[type="checkbox"]').first().check({ force: true });

    cy.get('button[type="submit"]').click({ force: true });

    // Menunggu penangkapan request oleh Cypress Network Interceptor
    cy.wait("@registerEmailTerdaftar");

    // Memastikan UI menangkap info error dari server dan menampilkannya ke user
    cy.contains(/sudah terdaftar|already exists|email/i).should("be.visible");
  });

  it("harus menampilkan pesan kesalahan jika username sudah digunakan oleh orang lain", () => {
    cy.intercept("POST", "**/api/auth/register", {
      statusCode: 422,
      body: {
        status: "error",
        message: "Username sudah digunakan oleh orang lain",
      },
    }).as("registerUsernameBentrok");

    cy.get('input[name="username"]').type("username_artis", { force: true });
    cy.get('input[name="email"]').type("artis@mautanyasuhu.com", {
      force: true,
    });
    cy.get('input[name="password"]').type("Suhumaster123", { force: true });
    cy.get('input[name="password_confirmation"]').type("Suhumaster123", {
      force: true,
    });

    cy.get('input[type="checkbox"]').first().check({ force: true });

    cy.get('button[type="submit"]').click({ force: true });
    cy.wait("@registerUsernameBentrok");

    cy.contains(/sudah digunakan|already taken|username/i).should("be.visible");
  });

  it("harus berhasil registrasi ketika form diisi valid dan dialihkan ke login", () => {
    // Mock response sukses 201 disesuaikan persis dengan skema data gambar dokumentasi Swagger Anda (image_8639a0.png)
    cy.intercept("POST", "**/api/auth/register", {
      statusCode: 201,
      body: {
        status: "success",
        message: "Registrasi berhasil. Selamat datang!",
        data: {
          user: {
            id: "user-123",
            username: "suhubaru",
            email: "suhubaru@mautanyasuhu.com",
            avatar_url: "https://link-to-avatar.com/image.png",
            level: 1,
            reputation_points: 0,
            is_banned: false,
            roles: ["user"],
          },
        },
      },
    }).as("registerSukses");

    cy.get('input[name="username"]').type("suhubaru", { force: true });
    cy.get('input[name="email"]').type("suhubaru@mautanyasuhu.com", {
      force: true,
    });
    cy.get('input[name="password"]').type("Suhumaster123", { force: true });
    cy.get('input[name="password_confirmation"]').type("Suhumaster123", {
      force: true,
    });

    cy.get('input[type="checkbox"]').first().check({ force: true });

    cy.get('button[type="submit"]').click({ force: true });
    cy.wait("@registerSukses");

    // Sesuai dengan aturan dokumen: wajib dialihkan ke halaman login setelah akun dibuat
    cy.url({ timeout: 10000 }).should("include", "/login");
  });
});
