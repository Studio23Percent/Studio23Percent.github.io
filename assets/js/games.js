/* =====================================================================
   23% — ДАНІ ІГОР
   Тут усе, що треба редагувати: тексти, кольори, посилання.
   - Порожній рядок "" у посиланні = кнопку не показуємо
     (для магазинів буде напис "Coming soon", для соцмереж — кнопки просто не буде).
   - Шляхи до картинок — від кореня сайту (без "/" на початку).
   - Якщо картинки ще немає, сайт сам намалює плитку з літерами гри.
   ===================================================================== */
window.GAMES = [
  {
    id: "outscape",
    page: "outscape/",
    title: "Outscape",
    platforms: "iOS · Android",
    tagline: "Online traffic racer. Cockpit view, deep tuning, photo mode.",
    description: [
      "Weave through heavy traffic on endless highways, chase near-misses for cash and race friends in private rooms of up to 10 players — or go offline and just drive, no timers, no limits.",
      "Every car handles its own way, and the road keeps changing — day, night and rain. Daily tasks, personal records and global leaderboards give you a reason for one more run."
    ],
    colors: { accent: "#8b7bff", accent2: "#39f0ff", bg: "#0a0a18" },
    icon: "assets/games/outscape/icon.png",     // квадрат 512×512 або 1024×1024
    cover: "assets/games/outscape/shot-1.webp", // ледь видимий фон сторінки (необов'язково)
    // Скріншоти показуються стрічкою під усіма посиланнями. Порядок = порядок тут.
    screenshots: [
      "assets/games/outscape/shot-1.webp",
      "assets/games/outscape/shot-2.webp",
      "assets/games/outscape/shot-3.webp",
      "assets/games/outscape/shot-4.webp",
      "assets/games/outscape/shot-5.webp",
      "assets/games/outscape/shot-6.webp",
      "assets/games/outscape/shot-7.webp"
    ],
    links: {
      googlePlay: "https://play.google.com/store/apps/details?id=com.company23.outscape",   // https://play.google.com/store/apps/details?id=...
      appStore: "https://apps.apple.com/app/outscape-car-simulator/id6764816410",     // https://apps.apple.com/app/...
      telegram: "https://t.me/outscape",     // https://t.me/...
      tiktok: "https://www.tiktok.com/@outscape.23?_r=1&_t=ZS-96wCC42JVV1"        // https://www.tiktok.com/@...
    }
  },
  {
    id: "papa-pizza",
    page: "papa-pizza/",
    title: "Papa Pizza",
    platforms: "iOS · Android",
    tagline: "From an empty room to the coziest pizzeria in town.",
    description: [
      "Papa Pizza is a cozy pixel-art pizzeria sim. Start with one oven and your first customer, then grow the menu from a simple Margherita to house specials, hire cooks and waiters, and decorate every corner.",
      "No timers, no rush — once the place runs itself, sit back and watch the evening crowd roll in."
    ],
    colors: { accent: "#ff4f2e", accent2: "#ffc93c", bg: "#160b08" },
    icon: "assets/games/papa-pizza/icon.png",
    cover: "assets/games/papa-pizza/shot-2.webp",
    screenshots: [
      "assets/games/papa-pizza/shot-1.webp",
      "assets/games/papa-pizza/shot-2.webp",
      "assets/games/papa-pizza/shot-3.webp",
      "assets/games/papa-pizza/shot-4.webp"
    ],
    links: {
      googlePlay: "https://play.google.com/store/apps/details?id=com.company23.PapaPizza",
      appStore: "https://apps.apple.com/app/papa-pizza-cooking-simulator/id6834752826",
      telegram: "",
      tiktok: ""
    }
  }
];
