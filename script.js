"use strict";
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) { preloader.style.opacity = "0"; setTimeout(() => preloader.remove(), 500); }
});

document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) AOS.init({ duration: 850, once: true, offset: 80, easing: "ease-out-cubic" });
  if (window.GLightbox) GLightbox({ selector: ".glightbox", touchNavigation: true, loop: true, openEffect: "zoom", closeEffect: "fade" });

  const nav = document.getElementById("mainNav");
  const topBtn = document.getElementById("backToTop");
  const onScroll = () => {
    nav?.classList.toggle("scrolled", window.scrollY > 40);
    topBtn?.classList.toggle("show", window.scrollY > 550);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  topBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  document.querySelectorAll("#navbarMenu .nav-link").forEach(link => link.addEventListener("click", () => {
    const menu = document.getElementById("navbarMenu");
    if (window.innerWidth < 992 && menu?.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  }));

  const animateCounter = (el) => {
    if (el.dataset.done) return;
    el.dataset.done = "true";
    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || "";
    const duration = 1700;
    const start = performance.now();
    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased).toLocaleString("en-IN") + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { animateCounter(entry.target); observer.unobserve(entry.target); }
  }), { threshold: .45 });
  document.querySelectorAll(".counter").forEach(counter => observer.observe(counter));

  const filterButtons = document.querySelectorAll(".gallery-filter button");
  const galleryItems = document.querySelectorAll(".gallery-item");
  filterButtons.forEach(button => button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    galleryItems.forEach(item => item.classList.toggle("hide", filter !== "all" && !item.classList.contains(filter)));
  }));

  const form = document.getElementById("admissionForm");
  const status = document.getElementById("formStatus");
  form?.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.checkValidity()) { form.classList.add("was-validated"); status.textContent = "Please complete the required fields."; return; }
    const data = new FormData(form);
    const message = `Hello TIMES PU College, I am ${data.get("name")}. I am interested in ${data.get("program")}. Phone: ${data.get("phone")}. ${data.get("message") || "Please share admission details."}`;
    status.textContent = "Opening WhatsApp to send your enquiry…";
    window.open(`https://wa.me/917019535411?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    form.reset(); form.classList.remove("was-validated");
  });

  document.getElementById("year").textContent = new Date().getFullYear();
});
