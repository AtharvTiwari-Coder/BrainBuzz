// Theme handling
const themeRange = document.getElementById("themeSelect");
const body = document.body;

// Apply theme mode
function applyThemeMode(mode) {
  body.classList.add("theme-fading");
  body.classList.remove("theme-dark", "theme-white");

  if (mode === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    body.classList.add(prefersDark ? "theme-dark" : "theme-white");
  } else {
    body.classList.add(mode === "dark" ? "theme-dark" : "theme-white");
  }

  setTimeout(() => body.classList.remove("theme-fading"), 2040);
}

// Slider value → mode
function sliderToMode(val) {
  const v = Math.round(Number(val));
  return v === 0 ? "system" : v === 1 ? "dark" : "white";
}

// Initialize theme
let saved = localStorage.getItem("brainbuzz-theme") || "system";
themeRange.value = saved === "system" ? "0" : saved === "dark" ? "1" : "2";
applyThemeMode(saved);

// Listen for system theme changes
const mq = window.matchMedia("(prefers-color-scheme: dark)");
const systemChange = () => {
  if (localStorage.getItem("brainbuzz-theme") === "system") applyThemeMode("system");
};
mq.addEventListener ? mq.addEventListener("change", systemChange) : mq.addListener(systemChange);

// Slider interaction
themeRange.addEventListener("input", e => {
  const mode = sliderToMode(e.target.value);
  localStorage.setItem("brainbuzz-theme", mode);
  applyThemeMode(mode);
});

// Grade button interactions
const gradeButtons = document.querySelectorAll(".grade-btn");
function pressAndNavigateGrade(e) {
  e.preventDefault();
  const el = e.currentTarget;
  el.classList.remove("pressed");
  el.offsetWidth; // force reflow
  el.classList.add("pressed");
  setTimeout(() => {
    el.classList.remove("pressed");
    const href = el.getAttribute("href");
    if (href) window.location.href = href;
  }, 160);
}
gradeButtons.forEach(btn => {
  btn.addEventListener("click", pressAndNavigateGrade);
  btn.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pressAndNavigateGrade(e);
    }
  });
  btn.addEventListener("mouseleave", () => btn.classList.remove("pressed"));
});
