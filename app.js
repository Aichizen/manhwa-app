const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


function openTitle(title) {

    window.location.href =
        "chapters.html?title=" + title;

}

function openReader() {
    window.location.href = "reader.html";
}