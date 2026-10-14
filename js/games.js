// Oyun kataloğu: ana sayfadaki kartlar ve detay penceresi bu listeden üretilir.
// Yeni oyun eklemek için buraya bir kayıt eklemek yeterlidir.
//   input:    "keyboard" ya da "mouse" (dokunmatik cihaz uyarısı için)
//   controls: detay penceresinde tuş rozetleri olarak gösterilir
//   origin:   orijinal oyunun çıkış yılı (isteğe bağlı)
const GAMES = [
  { slug: "fight", title: "Fight Game", dir: "Fight_Game", category: "dovus", players: 2, input: "keyboard",
    desc: "İki samuray, tek arena. Süre dolmadan rakibinin can barını sıfırla.",
    controls: [
      { keys: ["A", "D", "W"], action: "1. oyuncu: hareket ve zıplama" },
      { keys: ["Boşluk"], action: "1. oyuncu: saldırı" },
      { keys: ["←", "→", "↑"], action: "2. oyuncu: hareket ve zıplama" },
      { keys: ["↓"], action: "2. oyuncu: saldırı" },
    ] },
  { slug: "pacman", title: "Pac-Man", dir: "PacMan_Game", category: "arcade", players: 1, input: "keyboard", origin: 1980,
    desc: "Labirentteki noktaları topla, hayaletlerden kaç, güç haplarıyla rövanşı al.",
    controls: [{ keys: ["←", "↑", "→", "↓"], action: "Yön değiştir" }] },
  { slug: "race", title: "Race", dir: "Race_Game", category: "yaris", players: 1, input: "keyboard",
    desc: "Sahil yolunda sözde-3B bir yarış. Trafiği solla, tur süreni düşür.",
    controls: [
      { keys: ["C"], action: "Yarışı başlat" },
      { keys: ["↑", "↓"], action: "Gaz ve fren" },
      { keys: ["←", "→"], action: "Direksiyon" },
      { keys: ["M"], action: "Sesi aç / kapat" },
    ] },
  { slug: "space-invaders", title: "Space Invaders", dir: "SpaceInvaders_Game", category: "arcade", players: 1, input: "keyboard", origin: 1978,
    desc: "Dalga dalga gelen uzaylı filosunu yere inmeden temizle.",
    controls: [
      { keys: ["←", "→"], action: "Gemiyi hareket ettir" },
      { keys: ["Boşluk"], action: "Ateş et" },
    ] },
  { slug: "snake", title: "Snake", dir: "Snake_Game", category: "arcade", players: 1, input: "keyboard", origin: 1976,
    desc: "Yemi topla, uza ve kendi kuyruğuna çarpmadan hayatta kal.",
    controls: [{ keys: ["←", "↑", "→", "↓"], action: "Yön değiştir" }] },
  { slug: "tetris", title: "Tetris", dir: "Tetris_Game", category: "bulmaca", players: 1, input: "keyboard", origin: 1984,
    desc: "Düşen blokları boşluk bırakmadan diz, satırları temizle.",
    controls: [
      { keys: ["←", "→"], action: "Bloğu kaydır" },
      { keys: ["Boşluk"], action: "Döndür" },
      { keys: ["↓"], action: "Hızlı indir" },
    ] },
  { slug: "pong", title: "Pong", dir: "Pong_Game", category: "arcade", players: 1, input: "mouse", origin: 1972,
    desc: "Her şeyin başladığı oyun: raketini fareyle yönet, bilgisayarı yen.",
    controls: [{ keys: ["Fare"], action: "Raketi yukarı aşağı taşı" }] },
  { slug: "brick-breaker", title: "Brick Breaker", dir: "BrickBreaker_Game", category: "arcade", players: 1, input: "keyboard", origin: 1976,
    desc: "Topu rakette tut, tuğla duvarını sıra sıra indir.",
    controls: [
      { keys: ["←", "→"], action: "Raketi hareket ettir" },
      { keys: ["Boşluk"], action: "Oyun bitince yeniden başla" },
    ] },
  { slug: "xox", title: "XOX", dir: "XOX_Game", category: "cok-oyunculu", players: 2, input: "mouse",
    desc: "Klasik üçlü dizme oyunu; sırayla oyna, üçlüyü ilk kuran kazanır.",
    controls: [{ keys: ["Tıkla"], action: "Boş kareye işaret koy" }] },
  { slug: "mole", title: "Köstebeği Yakala", dir: "Mario_Game", category: "arcade", players: 1, input: "mouse", origin: 1975,
    desc: "Borulardan çıkan köstebeğe tıkla, piranha bitkisine dokunma.",
    controls: [{ keys: ["Tıkla"], action: "Köstebeğe vur" }] },
  { slug: "flappy-bird", title: "Flappy Bird", dir: "FlappyBird_Game", category: "arcade", players: 1, input: "keyboard", origin: 2013,
    desc: "Kuşu boruların arasından geçir; tek bir yanlış kanat çırpışı yeter.",
    controls: [
      { keys: ["Enter"], action: "Oyunu başlat" },
      { keys: ["Boşluk", "↑"], action: "Kanat çırp" },
    ] },
  { slug: "doodle-jump", title: "Doodle Jump", dir: "DoodleJump_Game", category: "arcade", players: 1, input: "keyboard", origin: 2009,
    desc: "Platformdan platforma zıpla, düşmeden olabildiğince yükseğe çık.",
    controls: [
      { keys: ["←", "→"], action: "Sağa sola hareket (A / D de çalışır)" },
      { keys: ["Boşluk"], action: "Oyun bitince yeniden başla" },
    ] },
];

const CATEGORIES = [
  { id: "all", label: "Tümü" },
  { id: "arcade", label: "Arcade" },
  { id: "cok-oyunculu", label: "Çok oyunculu" },
  { id: "dovus", label: "Dövüş" },
  { id: "yaris", label: "Yarış" },
  { id: "bulmaca", label: "Bulmaca" },
];
