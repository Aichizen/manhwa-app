const tg = window.Telegram.WebApp;

// Memperluas Web App
tg.expand();

// Memberitahu Telegram bahwa aplikasi sudah siap
tg.ready();

// Mengikuti tema Telegram
document.body.style.backgroundColor =
    tg.themeParams.bg_color || "#0f0f0f";