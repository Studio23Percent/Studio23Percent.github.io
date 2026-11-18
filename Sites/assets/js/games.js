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
    // TODO: замінити на справжні тексти гри
    tagline: "Find a way out of places that don't want you to leave.",
    description: [
      "Outscape is our take on escape — not from a room, but from the rules of the world itself. Every level hides a way out that only appears when you stop playing the way you're expected to.",
      "Built around an unusual visual style and mechanics that bend the space around you."
    ],
    colors: { accent: "#8b7bff", accent2: "#39f0ff", bg: "#0a0a18" },
    icon: "assets/games/outscape/icon.png",     // квадрат 512×512 або 1024×1024
    cover: "assets/games/outscape/cover.jpg",   // необов'язково, 1920×1080
    screenshots: [
      // "assets/games/outscape/shot-1.jpg",
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
    // TODO: замінити на справжні тексти гри
    tagline: "Dough, sauce, cheese — and a little bit of chaos.",
    description: [
      "Papa Pizza puts you behind the counter of a pizzeria that runs on your rules. Stretch the dough, pile on the toppings and keep the orders flowing before the oven gets ahead of you.",
      "Bright, tasty and slightly unhinged — a cooking game that doesn't play it safe."
    ],
    colors: { accent: "#ff4f2e", accent2: "#ffc93c", bg: "#160b08" },
    icon: "assets/games/papa-pizza/icon.png",
    cover: "assets/games/papa-pizza/cover.jpg",
    screenshots: [],
    links: {
      googlePlay: "https://play.google.com/store/apps/details?id=com.company23.PapaPizza",
      appStore: "https://apps.apple.com/app/papa-pizza-cooking-simulator/id6834752826",
      telegram: "",
      tiktok: ""
    }
  }
];
