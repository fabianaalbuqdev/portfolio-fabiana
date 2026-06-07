const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");
const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const targetSection = targetId ? document.querySelector(targetId) : null;

      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");

      if (targetSection) {
        event.preventDefault();
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        targetSection.classList.remove("section-highlight");
        window.setTimeout(() => targetSection.classList.add("section-highlight"), 320);
        window.setTimeout(() => targetSection.classList.remove("section-highlight"), 1500);
      }
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll(".section");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    {
      threshold: 0.14,
    },
  );

  revealElements.forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${Math.min(index * 55, 330)}ms`);
    observer.observe(element);
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-in-view", entry.isIntersecting);
      });
    },
    {
      rootMargin: "-35% 0px -35% 0px",
      threshold: 0,
    },
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
  sections.forEach((section) => section.classList.add("is-in-view"));
}

const modalTriggers = document.querySelectorAll("[data-modal-target]");
const modalCloseButtons = document.querySelectorAll("[data-modal-close]");
let activeModal = null;

const closeModal = () => {
  if (!activeModal) {
    return;
  }

  activeModal.classList.remove("is-open");
  activeModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
  activeModal = null;
};

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const modalId = trigger.getAttribute("data-modal-target");
    const modal = modalId ? document.querySelector(`#${modalId}`) : null;

    if (!modal) {
      return;
    }

    activeModal = modal;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
  });
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

const imageLightbox = document.querySelector("#image-lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const previewExpandButtons = document.querySelectorAll("[data-preview-expand]");
const lightboxCloseButtons = document.querySelectorAll("[data-lightbox-close]");
let isLightboxOpen = false;

const closeLightbox = () => {
  if (!imageLightbox || !lightboxImage || !lightboxCaption) {
    return;
  }

  imageLightbox.classList.remove("is-open");
  imageLightbox.setAttribute("aria-hidden", "true");
  lightboxImage.removeAttribute("src");
  lightboxImage.alt = "";
  lightboxCaption.textContent = "";
  isLightboxOpen = false;

  if (!activeModal) {
    document.body.classList.remove("menu-open");
  }
};

const openLightbox = (imageSrc, imageAlt) => {
  if (!imageLightbox || !lightboxImage || !lightboxCaption) {
    return;
  }

  lightboxImage.src = imageSrc;
  lightboxImage.alt = imageAlt;
  lightboxCaption.textContent = imageAlt;
  imageLightbox.classList.add("is-open");
  imageLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
  isLightboxOpen = true;
};

previewExpandButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const previewImage = button.querySelector("img");

    if (!previewImage?.src) {
      return;
    }

    openLightbox(previewImage.src, previewImage.alt || "Print do projeto Salesforce");
  });
});

lightboxCloseButtons.forEach((button) => {
  button.addEventListener("click", closeLightbox);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (isLightboxOpen) {
      closeLightbox();
      return;
    }

    closeModal();
  }
});
