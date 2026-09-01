// BXYZ:..:eliot@bosmanxyz.xyz:..:.www.bosmanxyz.xyz

import { FONSTER, hamta, hamtaViaHash, SPAR_IDS, HOJDER, BILDER, KATEGORIER } from "./content.js";
import { skapaWm } from "./wm.js";
import { vaxGrupp } from "./animations.js";

function fonsterIdFranEl(el) {
  return el.closest("[data-fonster]")?.dataset.fonster || el.dataset.fonster;
}

function skrivKlocka(el) {
  const nu = new Date();
  const hh = String(nu.getHours()).padStart(2, "0");
  const mm = String(nu.getMinutes()).padStart(2, "0");
  const ss = String(nu.getSeconds()).padStart(2, "0");
  el.textContent = `${hh}:${mm}:${ss}`;
  el.dateTime = nu.toISOString();
}

function synkaHash(wm) {
  const id = wm.hamtaFokus();
  const meta = id ? hamta(id) : null;
  const hash = meta ? meta.route : "";
  if (hash !== location.hash) {
    history.replaceState(null, "", hash || `${location.pathname}${location.search}`);
  }
}

function oppnaFranHash(wm) {
  const post = hamtaViaHash(location.hash);
  if (post) {
    wm.tack(post.id);
  }
}

function stangStart() {
  const lista = document.getElementById("startlista");
  const knapp = document.getElementById("start-knapp");
  if (lista) {
    delete lista.dataset.tillstand;
    lista.setAttribute("aria-hidden", "true");
  }
  knapp?.setAttribute("aria-expanded", "false");
}

function vaxlaStart() {
  const lista = document.getElementById("startlista");
  const knapp = document.getElementById("start-knapp");
  const oppen = lista?.dataset.tillstand === "oppen";
  if (oppen) {
    stangStart();
    return;
  }
  const first = knapp?.getBoundingClientRect();
  if (lista) {
    lista.dataset.tillstand = "oppen";
    lista.setAttribute("aria-hidden", "false");
  }
  knapp?.setAttribute("aria-expanded", "true");
  if (!first || !lista) {
    return;
  }
  const poster = [...lista.querySelectorAll(".piller")].map((el) => ({ el, first }));
  vaxGrupp(poster, () => "vaxer");
}

const TEXTER = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
];

function byggSlot(mall, post) {
  const slot = mall.content.firstElementChild.cloneNode(true);
  const el = slot.querySelector(".fonster");
  const id = post.id;
  el.dataset.fonster = id;
  el.dataset.enheter = String(post.enheter);
  el.dataset.storlek = "liten";
  el.style.setProperty("--enheter", String(post.enheter));
  el.id = id;
  el.setAttribute("aria-labelledby", `rubrik-${id}`);
  const rubrik = el.querySelector(".fonster-rubrik");
  rubrik.id = `rubrik-${id}`;
  rubrik.textContent = post.titel;
  if (post.kategori) {
    el.dataset.kategori = post.kategori;
  }
  const kropp = el.querySelector(".fonster-kropp");
  const text = document.createElement("div");
  text.className = "fonster-text";
  text.innerHTML = post.kropp;
  kropp.replaceChildren(text);
  if (post.bild) {
    const ram = document.createElement("figure");
    ram.className = "fonster-bild";
    const img = document.createElement("img");
    img.src = post.bild;
    img.alt = "";
    ram.append(img);
    kropp.prepend(ram);
  }
  return slot;
}

function sattFro(mall, wm) {
  FONSTER.forEach((post) => {
    const spar = document.getElementById(`spar-${post.spar}`);
    if (spar) {
      wm.lagg(byggSlot(mall, post), spar);
    }
  });
}

function harKategori(el, namn) {
  if (!namn || namn === "alla") {
    return true;
  }
  return (el.dataset.kategori || "").split(/\s+/).includes(namn);
}

async function sattFilter(mosaik, wm, namn) {
  const nu = mosaik.dataset.filter || "alla";
  if (nu === namn) {
    return;
  }
  const exp = wm.hamtaExpanderad();
  if (exp && !harKategori(exp, namn)) {
    await wm.minska(exp.dataset.fonster);
  }
  const forst = [...mosaik.querySelectorAll(".fonster")]
    .filter((el) => el.dataset.tillstand !== "stangd")
    .filter((el) => harKategori(el, nu))
    .map((el) => ({ el, first: el.getBoundingClientRect() }));
  mosaik.dataset.filter = namn;
  document.querySelectorAll("#filter [data-filter]").forEach((lank) => {
    if (lank.dataset.filter === namn) {
      lank.dataset.vald = "ja";
      lank.setAttribute("aria-current", "true");
    } else {
      delete lank.dataset.vald;
      lank.removeAttribute("aria-current");
    }
  });
  const kvar = forst.filter(({ el }) => harKategori(el, namn));
  await vaxGrupp(kvar, () => "anpassar");
}

function kopplaPekare(mosaik) {
  mosaik.addEventListener("pointerover", (e) => {
    const yta = e.target.closest(".fonster");
    if (!yta || yta.dataset.tillstand === "stangd") {
      return;
    }
    yta.dataset.pekare = "inne";
  });
  mosaik.addEventListener("pointerout", (e) => {
    const yta = e.target.closest(".fonster");
    if (!yta) {
      return;
    }
    if (e.relatedTarget && yta.contains(e.relatedTarget)) {
      return;
    }
    delete yta.dataset.pekare;
  });
}

function bevakaSikt(mosaik) {
  if (
    CSS.supports("animation-timeline: view()") ||
    CSS.supports("animation-timeline", "view()")
  ) {
    return { bevaka() {} };
  }

  const io = new IntersectionObserver(
    (poster) => {
      poster.forEach((post) => {
        const el = post.target;
        if (el.dataset.storlek === "stor") {
          el.dataset.sikt = "hel";
          return;
        }
        const andel = post.intersectionRatio;
        const topp = post.boundingClientRect.top;
        if (andel <= 0.02) {
          el.dataset.sikt = "ute";
        } else if (topp < 0 && andel < 0.4) {
          el.dataset.sikt = "ut";
        } else if (topp >= 0 && andel < 0.4) {
          el.dataset.sikt = "in";
        } else {
          el.dataset.sikt = "hel";
        }
      });
    },
    { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
  );

  function bevaka(el) {
    io.observe(el);
  }

  mosaik.querySelectorAll(".fonster").forEach(bevaka);
  return { bevaka };
}

function bevakaYOverflow({ mosaik, mall, wm, onNy }) {
  const vakt = document.getElementById("mosaik-vakt");
  if (!vakt || !mall) {
    return;
  }

  const spars = SPAR_IDS.map((id) => document.getElementById(`spar-${id}`)).filter(Boolean);
  let lopenr = 0;
  let bygger = false;

  function nastaTitel() {
    lopenr += 1;
    return `Window ${String(lopenr).padStart(3, "0")}`;
  }

  function kortaste() {
    return spars.reduce((a, b) => (a.offsetHeight <= b.offsetHeight ? a : b));
  }

  function byggISpar(spar) {
    const n = lopenr;
    const enheter = HOJDER[n % HOJDER.length];
    const slot = byggSlot(mall, {
      id: `gen-${n + 1}`,
      titel: nastaTitel(),
      enheter,
      kropp: `<p>${TEXTER[n % TEXTER.length]}</p>`,
      bild: BILDER[n % BILDER.length],
      kategori:
        mosaik.dataset.filter && mosaik.dataset.filter !== "alla"
          ? mosaik.dataset.filter
          : KATEGORIER[n % KATEGORIER.length],
    });
    wm.lagg(slot, spar);
    const el = slot.querySelector(".fonster");
    if (el) {
      onNy?.(el);
    }
  }

  function fyllOmBehov() {
    if (bygger) {
      return;
    }
    bygger = true;
    let kedja = 0;
    const mal = window.innerHeight * 1.6;
    while (kedja < 24) {
      const kort = kortaste();
      if (kort.getBoundingClientRect().bottom > mal) {
        break;
      }
      byggISpar(kort);
      kedja += 1;
    }
    bygger = false;
  }

  const io = new IntersectionObserver(
    (poster) => {
      if (poster.some((p) => p.isIntersecting)) {
        fyllOmBehov();
      }
    },
    { root: null, rootMargin: "80% 0px", threshold: 0 },
  );
  io.observe(vakt);
  window.addEventListener("scroll", () => fyllOmBehov(), { passive: true });
  fyllOmBehov();
  return { fyll: fyllOmBehov };
}

function boot() {
  const mosaik = document.getElementById("mosaik");
  const klocka = document.getElementById("klocka");
  const mall = document.getElementById("mall-fonster");

  const wm = skapaWm({
    mosaik,
    onAndring() {
      synkaHash(wm);
    },
  });

  sattFro(mall, wm);
  kopplaPekare(mosaik);
  const sikt = bevakaSikt(mosaik);
  let fyllMosaik = () => {};

  const atgarder = {
    "skrivbord/oppna": (el) => {
      const id = el.dataset.fonster;
      if (id) {
        const first = el.getBoundingClientRect();
        stangStart();
        wm.tack(id, first);
      }
    },
    "skrivbord/hem": () => {
      stangStart();
      const exp = wm.hamtaExpanderad();
      if (exp) {
        wm.minska(exp.dataset.fonster).then(() => {
          history.replaceState(null, "", `${location.pathname}${location.search}`);
        });
        return;
      }
      history.replaceState(null, "", `${location.pathname}${location.search}`);
    },
    "fonster/stang": (el) => {
      const id = fonsterIdFranEl(el);
      if (id) {
        wm.stang(id);
      }
    },
    "fonster/minska": (el) => {
      const id = fonsterIdFranEl(el);
      if (id) {
        wm.minska(id);
      }
    },
    "fonster/oka": (el) => {
      const id = fonsterIdFranEl(el);
      if (id) {
        wm.oka(id);
      }
    },
    "start/vaxla": () => vaxlaStart(),
    "filter/satt": (el) => {
      const namn = el.dataset.filter || "alla";
      sattFilter(mosaik, wm, namn).then(() => fyllMosaik());
    },
  };

  document.addEventListener("click", (e) => {
    const lista = document.getElementById("startlista");
    const startKnapp = document.getElementById("start-knapp");
    if (
      lista?.dataset.tillstand === "oppen" &&
      !lista.contains(e.target) &&
      !startKnapp?.contains(e.target)
    ) {
      stangStart();
    }

    const knapp = e.target.closest("[data-atgard]");
    if (knapp) {
      const fn = atgarder[knapp.dataset.atgard];
      if (!fn) {
        return;
      }
      if (knapp.tagName === "A") {
        e.preventDefault();
      }
      fn(knapp, e);
      return;
    }

    const expanderad = wm.hamtaExpanderad();
    const iHorn = e.target.closest(".horn, .startlista, .filter");
    if (expanderad && !expanderad.contains(e.target) && !iHorn) {
      wm.minska(expanderad.dataset.fonster);
    }

    const yta = e.target.closest(".fonster[data-fonster]");
    if (yta && yta.dataset.tillstand !== "stangd") {
      wm.fokusera(yta.dataset.fonster);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") {
      return;
    }
    const lista = document.getElementById("startlista");
    if (lista?.dataset.tillstand === "oppen") {
      stangStart();
      return;
    }
    const expanderad = wm.hamtaExpanderad();
    if (expanderad) {
      wm.minska(expanderad.dataset.fonster);
      return;
    }
    const id = wm.hamtaFokus();
    if (id) {
      wm.stang(id);
    }
  });

  window.addEventListener("hashchange", () => oppnaFranHash(wm));

  if (klocka) {
    skrivKlocka(klocka);
    window.setInterval(() => skrivKlocka(klocka), 1000);
  }

  if (location.hash) {
    oppnaFranHash(wm);
  }

  const yfyll = bevakaYOverflow({
    mosaik,
    mall,
    wm,
    onNy: (el) => sikt.bevaka(el),
  });
  if (yfyll?.fyll) {
    fyllMosaik = yfyll.fyll;
  }
}

boot();
