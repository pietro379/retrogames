// Her oyun sayfasına ortak bir üst bar ekler: ana sayfaya dönüş ve tam ekran.
// Oyunun önüne geçmemek için birkaç saniye sonra soluklaşır, üzerine gelince belirginleşir.
(function () {
  const style = document.createElement("style");
  style.textContent = `
    .retrogames-bar {
      position: fixed; top: 12px; left: 12px; z-index: 9999;
      display: flex; gap: 6px; padding: 4px;
      border-radius: 999px; border: 1px solid rgba(0, 209, 205, .55);
      background: rgba(7, 5, 27, .82); backdrop-filter: blur(8px);
      font: 600 13px/1 system-ui, sans-serif; letter-spacing: .04em;
      transition: opacity .3s;
    }
    .retrogames-bar.is-idle { opacity: .35; }
    .retrogames-bar:hover, .retrogames-bar:focus-within { opacity: 1; }
    .retrogames-bar a, .retrogames-bar button {
      display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px;
      border: 0; border-radius: 999px; background: transparent; color: #fff;
      font: inherit; text-decoration: none; cursor: pointer;
    }
    .retrogames-bar a:hover, .retrogames-bar button:hover { background: #009f9d; }
    .retrogames-bar :focus-visible { outline: 2px solid #00d1cd; outline-offset: 1px; }
    .retrogames-bar svg { width: 16px; height: 16px; }
  `;

  const icon = (d) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const bar = document.createElement("div");
  bar.className = "retrogames-bar";
  bar.innerHTML = `
    <a href="../../index.html" aria-label="Ana sayfaya dön">${icon("M15 18l-6-6 6-6")}RetroGames</a>
    <button type="button" aria-label="Tam ekran" title="Tam ekran">${icon("M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5")}</button>
  `;

  const fullscreenBtn = bar.querySelector("button");
  if (!document.fullscreenEnabled) fullscreenBtn.remove();
  fullscreenBtn.addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
    // Odak düğmede kalırsa oyunlarda Boşluk tuşu düğmeyi tekrar tetikler.
    fullscreenBtn.blur();
  });

  let idleTimer;
  const wake = () => {
    bar.classList.remove("is-idle");
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => bar.classList.add("is-idle"), 2500);
  };

  const mount = () => {
    document.head.appendChild(style);
    document.body.appendChild(bar);
    bar.addEventListener("mouseleave", wake);
    wake();
  };
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
