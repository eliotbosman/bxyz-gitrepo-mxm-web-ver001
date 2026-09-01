// BXYZ:..:eliot@bosmanxyz.xyz:..:.www.bosmanxyz.xyz

export const BILDER = [
  "assets/test/mael-test-img-2.jpg",
  "assets/test/mael-test-img-3.jpg",
  "assets/test/mael-test-img-4.jpg",
  "assets/test/mael-test-img-5.jpg",
  "assets/test/mael-test-img-6.jpg",
  "assets/test/mael-test-img-7.jpg",
  "assets/test/mael-test-img-8.jpg",
  "assets/test/mael-test-img-9.jpg",
  "assets/test/mael-test-img-10.jpg",
  "assets/test/mael-test-img-11.jpg",
  "assets/test/mael-test-img-12.jpg",
  "assets/test/mael-test-img-13.jpg",
  "assets/test/mael-test-img-14.jpg",
  "assets/test/mael-test-img-15.jpg",
  "assets/test/mael-test-img-16.jpg",
  "assets/test/mael-test-img-17.jpg",
  "assets/test/mael-test-img-18.jpg",
  "assets/test/mael-test-img-19.jpg",
  "assets/test/mael-test-img-20.jpg",
  "assets/test/mael-test-img-21.jpg",
  "assets/test/mael-test-img-22.jpg",
  "assets/test/mael-test-img-23.jpg",
  "assets/test/mael-test-img-24.jpg",
  "assets/test/mael-test-img-25.jpg",
  "assets/test/mael-test-img-26.jpg",
  "assets/test/mael-test-img-27.jpg",
  "assets/test/mael-test-img-28.png",
];

export const KATEGORIER = ["art", "music", "design"];

export const FONSTER = [
  {
    id: "personal",
    titel: "Personal",
    route: "#personal",
    spar: "v",
    enheter: 10,
    bild: BILDER[0],
    kategori: "design",
    kropp: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>",
  },
  {
    id: "work-untitled-02",
    titel: "Untitled 02",
    route: "#work/untitled-02",
    spar: "v",
    enheter: 8,
    bild: BILDER[1],
    kategori: "art",
    kropp: "<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>",
  },
  {
    id: "about",
    titel: "About",
    route: "#about",
    spar: "m",
    enheter: 10,
    bild: BILDER[2],
    kategori: "art music",
    kropp: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>",
  },
  {
    id: "work",
    titel: "Work",
    route: "#work",
    spar: "m",
    enheter: 10,
    bild: BILDER[3],
    kategori: "art music design",
    kropp: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><ul><li><a href=\"#work/chambre-noire\" data-atgard=\"skrivbord/oppna\" data-fonster=\"work-chambre-noire\">Chambre Noire</a></li><li><a href=\"#work/untitled-02\" data-atgard=\"skrivbord/oppna\" data-fonster=\"work-untitled-02\">Untitled 02</a></li><li><a href=\"#work/untitled-03\" data-atgard=\"skrivbord/oppna\" data-fonster=\"work-untitled-03\">Untitled 03</a></li></ul>",
  },
  {
    id: "work-chambre-noire",
    titel: "Chambre Noire",
    route: "#work/chambre-noire",
    spar: "m",
    enheter: 12,
    bild: BILDER[0],
    kategori: "art",
    kropp: "<p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>",
  },
  {
    id: "contact",
    titel: "Contact",
    route: "#contact",
    spar: "h",
    enheter: 10,
    bild: BILDER[0],
    kropp: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.</p>",
  },
  {
    id: "work-untitled-03",
    titel: "Untitled 03",
    route: "#work/untitled-03",
    spar: "h",
    enheter: 8,
    bild: BILDER[1],
    kategori: "music",
    kropp: "<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>",
  },
];

const viaId = new Map(FONSTER.map((post) => [post.id, post]));

export function hamta(id) {
  return viaId.get(id);
}

export function hamtaViaHash(hash) {
  const nyckel = (hash || "").replace(/^#/, "");
  if (!nyckel) {
    return null;
  }
  return FONSTER.find((post) => post.route === `#${nyckel}`) || null;
}

export const SPAR_IDS = ["v", "m", "h"];
export const HOJDER = [6, 8, 10, 12];
