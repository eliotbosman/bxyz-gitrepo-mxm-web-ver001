// BXYZ:..:eliot@bosmanxyz.xyz:..:.www.bosmanxyz.xyz

import { vaxGrupp } from "./animations.js";

const STORLEK = {
  liten: "liten",
  stor: "stor",
};

const RORELSE = {
  vaxer: "vaxer",
  krymper: "krymper",
  anpassar: "anpassar",
};

const VIKT = {
  jamn: "jamn",
};

const LAGE = {
  rut: "rut",
};

function slotFor(el) {
  return el.closest(".fonster-slot");
}

function sparFor(el) {
  return el.closest("[data-spar]")?.dataset.spar;
}

function synligaRekt(mosaik) {
  const vy = window.innerHeight;
  return [...mosaik.querySelectorAll(".fonster[data-fonster]")]
    .filter((el) => el.dataset.tillstand !== "stangd")
    .map((el) => ({ el, first: el.getBoundingClientRect() }))
    .filter(({ first }) => first.bottom > 0 && first.top < vy && first.width > 0);
}

export function skapaWm({ mosaik, onAndring }) {
  let fokusId = null;
  let vaxer = false;

  function fonstren() {
    return [...mosaik.querySelectorAll(".fonster[data-fonster]")];
  }

  function elFor(id) {
    return mosaik.querySelector(`.fonster[data-fonster="${id}"]`);
  }

  function expanderad() {
    return (
      mosaik.querySelector(`.fonster[data-lage="${LAGE.rut}"]`) ||
      mosaik.querySelector(`.fonster[data-storlek="${STORLEK.stor}"]`)
    );
  }

  function rensaRut(utom) {
    fonstren().forEach((post) => {
      if (post !== utom && post.dataset.lage === LAGE.rut) {
        delete post.dataset.lage;
      }
    });
  }

  function sattVikt(sparId) {
    mosaik.dataset.vikt = sparId || VIKT.jamn;
  }

  function fokusera(id) {
    const el = elFor(id);
    if (!el || el.dataset.tillstand === "stangd") {
      return;
    }
    fokusId = id;
    fonstren().forEach((post) => {
      post.dataset.fokus = post.dataset.fonster === id ? "aktiv" : "inaktiv";
    });
    onAndring?.({ fokusId });
  }

  function oppna(id) {
    const el = elFor(id);
    if (!el) {
      return;
    }
    delete el.dataset.tillstand;
    const slot = slotFor(el);
    if (slot) {
      delete slot.dataset.tillstand;
    }
    fokusera(id);
    el.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function lagg(slot, spar) {
    const el = slot.querySelector(".fonster");
    if (el) {
      if (el.dataset.enheter) {
        el.style.setProperty("--enheter", el.dataset.enheter);
      }
      if (!el.dataset.storlek) {
        el.dataset.storlek = STORLEK.liten;
      }
      el.dataset.ursprung = spar.dataset.spar;
    }
    spar.append(slot);
  }

  function stang(id) {
    const el = elFor(id);
    if (!el) {
      return;
    }
    if (el.dataset.lage === LAGE.rut || el.dataset.storlek === STORLEK.stor) {
      return minska(id);
    }
    el.dataset.tillstand = "stangd";
    const slot = slotFor(el);
    if (slot) {
      slot.dataset.tillstand = "stangd";
    }
    if (fokusId === id) {
      const kvar = fonstren().find((post) => post.dataset.tillstand !== "stangd");
      fokusId = kvar ? kvar.dataset.fonster : null;
    }
    onAndring?.({ fokusId });
  }

  async function oka(id) {
    const el = elFor(id);
    if (!el || el.dataset.tillstand === "stangd" || vaxer) {
      return;
    }
    if (el.dataset.lage === LAGE.rut || el.dataset.storlek === STORLEK.stor) {
      return;
    }

    fonstren().forEach((post) => {
      if (post !== el && post.dataset.storlek === STORLEK.stor) {
        post.dataset.storlek = STORLEK.liten;
      }
    });
    sattVikt(VIKT.jamn);

    const poster = synligaRekt(mosaik);
    el.dataset.storlek = STORLEK.stor;
    sattVikt(sparFor(el) || el.dataset.ursprung);
    fokusera(id);

    vaxer = true;
    await vaxGrupp(poster, (post) =>
      post === el ? RORELSE.vaxer : RORELSE.anpassar,
    );
    vaxer = false;
    el.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  async function minska(id) {
    const el = elFor(id);
    if (!el || el.dataset.tillstand === "stangd" || vaxer) {
      return;
    }
    const rut = el.dataset.lage === LAGE.rut;
    const stor = el.dataset.storlek === STORLEK.stor;
    if (!rut && !stor) {
      return;
    }

    const poster = rut ? [{ el, first: el.getBoundingClientRect() }] : synligaRekt(mosaik);
    if (rut) {
      delete el.dataset.lage;
      delete mosaik.dataset.lage;
    }
    if (stor) {
      el.dataset.storlek = STORLEK.liten;
      sattVikt(VIKT.jamn);
    }
    fokusera(id);

    vaxer = true;
    await vaxGrupp(poster, (post) =>
      post === el ? RORELSE.krymper : RORELSE.anpassar,
    );
    vaxer = false;
  }

  async function tack(id, firstRect) {
    const el = elFor(id);
    if (!el || vaxer) {
      return;
    }
    oppna(id);
    if (el.dataset.lage === LAGE.rut) {
      return;
    }

    rensaRut(el);
    fonstren().forEach((post) => {
      if (post.dataset.storlek === STORLEK.stor) {
        post.dataset.storlek = STORLEK.liten;
      }
    });
    sattVikt(VIKT.jamn);

    const first = firstRect || el.getBoundingClientRect();
    mosaik.dataset.lage = LAGE.rut;
    el.dataset.lage = LAGE.rut;
    fokusera(id);

    vaxer = true;
    await vaxGrupp([{ el, first }], () => RORELSE.vaxer);
    vaxer = false;
  }

  function hamtaFokus() {
    return fokusId;
  }

  function hamtaExpanderad() {
    return expanderad();
  }

  return { oppna, stang, minska, oka, tack, fokusera, lagg, hamtaFokus, hamtaExpanderad };
}
