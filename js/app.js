(function () {
  "use strict";

  const CONFIG = window.CONFIG;
  if (!CONFIG) {
    console.error("No se encontró js/config.js. Cárgalo antes de app.js.");
    return;
  }

  /* ---------- Enlaces de WhatsApp ---------- */
  const linkWA = (clave) =>
    "https://wa.me/" + CONFIG.whatsapp.replace(/[^0-9]/g, "") +
    "?text=" + encodeURIComponent(CONFIG.mensajes[clave] || CONFIG.mensajes.general);

  document.querySelectorAll("[data-wa]").forEach((el) => {
    el.href = linkWA(el.dataset.wa);
    el.target = "_blank";
    el.rel = "noopener";
  });

  /* ---------- Redes sociales ---------- */
  const setLink = (id, url) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.href = url;
    el.target = "_blank";
    el.rel = "noopener";
  };
  setLink("link-fb", CONFIG.facebook);
  setLink("link-ig", CONFIG.instagram);
  setLink("link-tt", CONFIG.tiktok);
  document.querySelectorAll(".enlace-ig").forEach((el) => {
    el.href = CONFIG.instagram;
    el.target = "_blank";
    el.rel = "noopener";
  });

  const setText = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };
  setText("ig-handle", CONFIG.instagramUsuario);
  setText("footer-ig", CONFIG.instagramUsuario);
  setText(
    "footer-tel",
    CONFIG.whatsapp.replace(/^\+?52/, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")
  );

  /* ---------- Dirección y mapa (desde config) ---------- */
  const neg = CONFIG.negocio || {};
  const direccion = [neg.calle, neg.codigoPostal + " " + neg.ciudad + ", " + neg.estado]
    .filter(Boolean)
    .join(", ");
  setText("footer-direccion", direccion);
  document.querySelectorAll(".enlace-maps").forEach((el) => {
    if (neg.mapsUrl) {
      el.href = neg.mapsUrl;
      el.target = "_blank";
      el.rel = "noopener";
    }
  });

  /* ---------- Botón WhatsApp que "viaja" al header ---------- */
  const btnHero = document.getElementById("btn-hero-wa");
  const btnHeader = document.getElementById("btn-header-wa");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let enHeader = false,
    animando = false;

  function volar(desde, hacia, alTerminar) {
    const r1 = desde.getBoundingClientRect();
    const r2 = hacia.getBoundingClientRect();
    const clon = desde.cloneNode(true);
    clon.classList.add("wa-volador");
    clon.style.left = r1.left + "px";
    clon.style.top = r1.top + "px";
    clon.style.width = r1.width + "px";
    clon.style.height = r1.height + "px";
    clon.style.fontSize = getComputedStyle(desde).fontSize;
    document.body.appendChild(clon);
    requestAnimationFrame(() => {
      const dx = r2.left - r1.left + (r2.width - r1.width) / 2;
      const dy = r2.top - r1.top + (r2.height - r1.height) / 2;
      const escala = r2.width / r1.width;
      clon.style.transform = `translate(${dx}px, ${dy}px) scale(${escala})`;
      clon.style.opacity = ".95";
    });
    setTimeout(() => {
      clon.remove();
      alTerminar();
      animando = false;
    }, 660);
  }

  if (btnHero && btnHeader) {
    const centinela = new IntersectionObserver(
      (entries) => {
        const visible = entries[0].isIntersecting;
        if (animando) return;
        if (!visible && !enHeader) {
          enHeader = true;
          if (reduceMotion) {
            btnHero.classList.add("viajando");
            btnHeader.classList.add("activo");
            return;
          }
          animando = true;
          btnHero.classList.add("viajando");
          volar(btnHero, btnHeader.parentElement, () => btnHeader.classList.add("activo"));
        } else if (visible && enHeader) {
          enHeader = false;
          btnHeader.classList.remove("activo");
          btnHero.classList.remove("viajando");
        }
      },
      { rootMargin: "-70px 0px 0px 0px" }
    );
    centinela.observe(btnHero);
  }

  /* ---------- Menú del día desde servidor externo (opcional) ---------- */
  if (CONFIG.menuUrl) {
    const img = document.getElementById("menu-img");
    const prueba = new Image();
    prueba.onload = () => {
      img.src = CONFIG.menuUrl;
    };
    prueba.src = CONFIG.menuUrl;
  }

  /* ---------- Compartir menú ---------- */
  const btnCompartir = document.getElementById("compartir");
  if (btnCompartir) {
    btnCompartir.addEventListener("click", async () => {
      const texto =
        "🍲 ¡Mira el menú de hoy de Amaranto Morelia! Comida casera hasta tu oficina. " +
        CONFIG.sitioUrl +
        "#menu";
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Menú del día — Amaranto Morelia",
            text: texto,
            url: CONFIG.sitioUrl + "#menu",
          });
          return;
        } catch (e) {}
      }
      window.open("https://wa.me/?text=" + encodeURIComponent(texto), "_blank", "noopener");
    });
  }

  /* ---------- Frases rotativas del hero ---------- */
  const frases = [
    "Calor de hogar hasta tu escritorio.", "Sabor a hogar en tu oficina.", "El sazón que extrañas, en tu oficina.",
    "Amor de hogar en tu oficina.", "El sazón de casa en tu oficina.", "Calor de hogar hasta tu escritorio.",
    "El sabor de las cocineras tradicionales, en tu escritorio.", "Tradición casera en tu oficina.", "Amor de hogar en tu oficina.",
  ];
  let fi = 0;
  const fraseEl = document.getElementById("frase");
  if (fraseEl && !reduceMotion) {
    setInterval(() => {
      fi = (fi + 1) % frases.length;
      fraseEl.style.animation = "none";
      fraseEl.textContent = frases[fi];
      void fraseEl.offsetWidth;
      fraseEl.style.animation = "";
    }, 12000);
  }

  /* ---------- Animaciones de entrada ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- Feed de Instagram (opcional) ---------- */
  if (CONFIG.instagramFeedUrl) {
    fetch(CONFIG.instagramFeedUrl)
      .then((r) => r.json())
      .then((data) => {
        const posts = (data.posts || data).slice(0, 4);
        if (!posts.length) return;
        const grid = document.getElementById("ig-grid");
        grid.innerHTML = "";
        posts.forEach((p) => {
          const a = document.createElement("a");
          a.className = "ig-item visible reveal";
          a.href = p.permalink || CONFIG.instagram;
          a.target = "_blank";
          a.rel = "noopener";
          const img = document.createElement("img");
          img.src = p.mediaUrl || p.thumbnailUrl;
          img.alt = "Publicación de Instagram de Amaranto Morelia";
          img.loading = "lazy";
          a.appendChild(img);
          grid.appendChild(a);
        });
      })
      .catch(() => {});
  }
})();
