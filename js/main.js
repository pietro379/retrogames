(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const grid = $("game-grid");
  const filters = $("filters");
  const search = $("search");
  const empty = $("empty");
  const count = $("result-count");
  const modal = $("game-modal");

  const RECENT_KEY = "retrogames:recent";
  const RECENT_LIMIT = 4;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  const state = { category: "all", query: "" };
  const gameUrl = (game) => `Games/${game.dir}/index.html`;
  const coverUrl = (game) => `assets/images/games/${game.slug}.jpg`;
  const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;
  const findGame = (slug) => GAMES.find((g) => g.slug === slug);
  const normalize = (text) => text.toLocaleLowerCase("tr");

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // Tarayıcı depolaması kapalı olabilir (gizli pencere, file:// kısıtları); her erişim korumalı.
  function readRecent() {
    try {
      const slugs = JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
      return slugs.map(findGame).filter(Boolean);
    } catch {
      return [];
    }
  }

  function rememberGame(game) {
    try {
      const slugs = readRecent().map((g) => g.slug).filter((s) => s !== game.slug);
      localStorage.setItem(RECENT_KEY, JSON.stringify([game.slug, ...slugs].slice(0, RECENT_LIMIT)));
    } catch {
      /* depolama yoksa sessizce geç */
    }
  }

  function playGame(game) {
    rememberGame(game);
    window.location.href = gameUrl(game);
  }

  /* ---------- Katalog ---------- */

  function renderFilters() {
    CATEGORIES.forEach((category) => {
      const total = category.id === "all"
        ? GAMES.length
        : GAMES.filter((g) => g.category === category.id).length;
      const button = el("button", "chip", category.label);
      button.type = "button";
      button.dataset.category = category.id;
      button.setAttribute("aria-pressed", String(category.id === state.category));
      button.append(el("span", "chip-count", String(total)));
      filters.appendChild(button);
    });
  }

  function uniqueKeys(game) {
    return [...new Set(game.controls.flatMap((c) => c.keys))].slice(0, 5);
  }

  function createCard(game, index) {
    const item = el("li", "card");
    item.style.setProperty("--i", index);

    const button = el("button", "card-button");
    button.type = "button";
    button.dataset.slug = game.slug;
    button.setAttribute("aria-haspopup", "dialog");

    const media = el("div", "card-media");
    const img = el("img");
    img.src = coverUrl(game);
    img.alt = "";
    img.loading = "lazy";
    img.width = 640;
    img.height = 400;
    const play = el("span", "card-play");
    play.setAttribute("aria-hidden", "true");
    media.append(img, el("span", `card-tag tag-${game.category}`, categoryLabel(game.category)), play);

    const body = el("div", "card-body");
    const head = el("div", "card-head");
    head.append(el("h3", null, game.title));
    if (game.origin) head.append(el("span", "card-year", String(game.origin)));

    const meta = el("div", "card-meta");
    const players = el("span", "card-players", `${game.players} oyuncu`);
    const keys = el("span", "card-keys");
    uniqueKeys(game).forEach((key) => keys.append(el("kbd", null, key)));
    meta.append(players, keys);

    body.append(head, el("p", "card-desc", game.desc), meta);
    button.append(media, body);
    item.appendChild(button);
    return item;
  }

  function visibleGames() {
    const query = normalize(state.query.trim());
    return GAMES.filter((game) => {
      const inCategory = state.category === "all" || game.category === state.category;
      const inSearch = !query || normalize(`${game.title} ${game.desc} ${categoryLabel(game.category)}`).includes(query);
      return inCategory && inSearch;
    });
  }

  function renderGrid() {
    const games = visibleGames();
    grid.replaceChildren(...games.map(createCard));
    empty.hidden = games.length > 0;
    count.textContent = `${games.length} / ${GAMES.length} oyun`;
  }

  function setCategory(id) {
    state.category = id;
    filters.querySelectorAll("button").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.category === id));
    });
    renderGrid();
  }

  function renderRecent() {
    const recent = readRecent();
    $("recent").hidden = recent.length === 0;
    $("recent-list").replaceChildren(...recent.map((game) => {
      const item = el("li");
      const link = el("a", "recent-item");
      link.href = gameUrl(game);
      link.dataset.slug = game.slug;
      const img = el("img");
      img.src = coverUrl(game);
      img.alt = "";
      img.width = 64;
      img.height = 40;
      link.append(img, el("span", null, game.title));
      item.append(link);
      return item;
    }));
  }

  /* ---------- Detay penceresi ---------- */

  let activeGame = null;

  function openModal(game) {
    activeGame = game;
    $("modal-img").src = coverUrl(game);
    $("modal-img").alt = `${game.title} oyun ekranı`;
    $("modal-title").textContent = game.title;
    $("modal-desc").textContent = game.desc;
    $("modal-play").href = gameUrl(game);

    const meta = [categoryLabel(game.category), `${game.players} oyuncu`];
    if (game.origin) meta.push(`Orijinali ${game.origin}`);
    $("modal-meta").textContent = meta.join(" · ");

    $("modal-controls").replaceChildren(...game.controls.flatMap((control) => {
      const dt = el("dt");
      control.keys.forEach((key) => dt.append(el("kbd", null, key)));
      return [dt, el("dd", null, control.action)];
    }));

    $("modal-notice").hidden = !(isTouch && game.input === "keyboard");

    if (location.hash !== `#${game.slug}`) history.replaceState(null, "", `#${game.slug}`);
    if (!modal.open) modal.showModal();
    $("modal-play").focus();
  }

  function closeModal() {
    if (modal.open) modal.close();
  }

  modal.addEventListener("close", () => {
    activeGame = null;
    if (findGame(location.hash.slice(1))) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  });

  // Pencerenin dışına (backdrop) tıklanınca kapat.
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  $("modal-close").addEventListener("click", closeModal);
  $("modal-cancel").addEventListener("click", closeModal);
  $("modal-play").addEventListener("click", (event) => {
    if (!activeGame) return;
    event.preventDefault();
    playGame(activeGame);
  });

  /* ---------- Olaylar ---------- */

  grid.addEventListener("click", (event) => {
    const button = event.target.closest(".card-button");
    if (button) openModal(findGame(button.dataset.slug));
  });

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (button) setCategory(button.dataset.category);
  });

  search.addEventListener("input", () => {
    state.query = search.value;
    renderGrid();
  });

  search.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && search.value) {
      event.preventDefault();
      search.value = "";
      state.query = "";
      renderGrid();
    }
  });

  $("reset-filters").addEventListener("click", () => {
    search.value = "";
    state.query = "";
    setCategory("all");
    search.focus();
  });

  $("recent-list").addEventListener("click", (event) => {
    const link = event.target.closest("a[data-slug]");
    if (!link) return;
    event.preventDefault();
    playGame(findGame(link.dataset.slug));
  });

  $("random-game").addEventListener("click", () => {
    openModal(GAMES[Math.floor(Math.random() * GAMES.length)]);
  });

  // "/" ile aramaya odaklan.
  document.addEventListener("keydown", (event) => {
    const typing = event.target.closest("input, textarea, [contenteditable]");
    if (event.key === "/" && !typing && !modal.open) {
      event.preventDefault();
      search.focus();
      search.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  });

  // Kaydırınca menüye arka plan ver.
  const nav = $("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // #slug ile doğrudan bir oyunun detayını aç (paylaşılabilir bağlantı).
  function openFromHash() {
    const game = findGame(location.hash.slice(1));
    if (game) openModal(game);
  }
  window.addEventListener("hashchange", openFromHash);

  // Oyundan geri dönüldüğünde (bfcache) son oynananlar listesini tazele.
  window.addEventListener("pageshow", renderRecent);

  document.querySelectorAll("[data-game-count]").forEach((node) => {
    node.textContent = String(GAMES.length);
  });

  renderFilters();
  renderGrid();
  renderRecent();
  openFromHash();
})();
