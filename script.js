// ============ LIGHTBOX FUNCTIONALITY ============
const images = document.querySelectorAll(".project-images img");
const lightbox = document.createElement("div");
lightbox.id = "lightbox-overlay";
document.body.appendChild(lightbox);

const lightboxImage = document.createElement("img");
lightbox.appendChild(lightboxImage);

images.forEach(img => {
  img.addEventListener("click", () => {
    lightbox.classList.add("active");
    lightboxImage.src = img.src;
  });
});

lightbox.addEventListener("click", () => {
  lightbox.classList.remove("active");
});

// ============ MOBILE NAVBAR TOGGLE ============
const navToggle = document.createElement("div");
navToggle.classList.add("hamburger");
navToggle.innerHTML = `
  <span></span>
  <span></span>
  <span></span>
`;
document.querySelector(".navbar").appendChild(navToggle);

const navLinks = document.querySelector(".nav-links");
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  navToggle.classList.toggle("open");
});

// Close nav when a link is clicked (mobile)
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    navToggle.classList.remove("open");
  });
});

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 50,
        behavior: "smooth"
      });
    }
  });
});
