// BXYZ:..:eliot@bosmanxyz.xyz:..:.www.bosmanxyz.xyz

export function minskadRorelse() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function lasMs(namn) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(namn).trim();
  const n = parseFloat(v);
  if (!Number.isFinite(n)) {
    return 0;
  }
  if (v.endsWith("s") && !v.endsWith("ms")) {
    return n * 1000;
  }
  return n;
}

function lasEase(namn) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(namn).trim();
  return v || "ease";
}

export function vaxMellan(el, first, last, riktning, onKlar) {
  if (!el) {
    onKlar?.();
    return;
  }

  if (
    minskadRorelse() ||
    !first?.width ||
    !last?.width ||
    (first.left === last.left &&
      first.top === last.top &&
      first.width === last.width &&
      first.height === last.height)
  ) {
    delete el.dataset.rorelse;
    onKlar?.();
    return;
  }

  const dx = first.left - last.left;
  const dy = first.top - last.top;
  const sx = first.width / last.width;
  const sy = first.height / last.height;

  el.dataset.rorelse = riktning;

  const anim = el.animate(
    [
      { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, transformOrigin: "0 0" },
      { transform: "none", transformOrigin: "0 0" },
    ],
    {
      duration: lasMs("--dur-storlek"),
      easing: lasEase("--ease-storlek"),
      fill: "none",
    },
  );

  const klar = () => {
    delete el.dataset.rorelse;
    onKlar?.();
  };

  anim.finished.then(klar).catch(klar);
}

export function vaxGrupp(poster, riktningFor) {
  return Promise.all(
    poster.map(
      ({ el, first }) =>
        new Promise((resolve) => {
          const last = el.getBoundingClientRect();
          vaxMellan(el, first, last, riktningFor(el), resolve);
        }),
    ),
  );
}
