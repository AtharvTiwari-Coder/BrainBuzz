// Elements
const themeRange = document.getElementById('themeSelect');
const body = document.body;
const gradeButtons = Array.from(document.querySelectorAll('.grade-btn'));

/* helper: apply theme with smooth dissolve transition (exact logic from index script) */
function applyThemeMode(mode){
  // add a short fade class to avoid abrupt flash
  body.classList.add('theme-fading');
  // remove previous explicit theme classes
  body.classList.remove('theme-dark','theme-white');

  if(mode === 'system'){
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if(prefersDark){
      body.classList.add('theme-dark');
    } else {
      body.classList.add('theme-white');
    }
  } else if(mode === 'dark'){
    body.classList.add('theme-dark');
  } else if(mode === 'white'){
    body.classList.add('theme-white');
  }

  // keep the fade class for the duration of CSS fade, then remove
  setTimeout(() => body.classList.remove('theme-fading'), 2040);
}

/* map slider values: 0=system,1=dark,2=white (exact from index script) */
function sliderToMode(val){
  if(val === '0') return 'system';
  if(val === '1') return 'dark';
  return 'white';
}

/* initialize default = system (exact from index script) */
let saved = localStorage.getItem('brainbuzz-theme') || 'system';
const initialVal = saved === 'system' ? '0' : (saved === 'dark' ? '1' : '2');
themeRange.value = initialVal;
applyThemeMode(saved);

/* listen for system changes when in system mode (exact from index script) */
const mq = window.matchMedia('(prefers-color-scheme: dark)');
if (mq.addEventListener) {
  mq.addEventListener('change', () => {
    if(localStorage.getItem('brainbuzz-theme') === 'system' || !localStorage.getItem('brainbuzz-theme')){
      applyThemeMode('system');
    }
  });
} else if (mq.addListener) {
  mq.addListener(() => {
    if(localStorage.getItem('brainbuzz-theme') === 'system' || !localStorage.getItem('brainbuzz-theme')){
      applyThemeMode('system');
    }
  });
}

/* slider interaction (exact from index script) */
themeRange.addEventListener('input', (e) => {
  const mode = sliderToMode(e.target.value);
  localStorage.setItem('brainbuzz-theme', mode);
  applyThemeMode(mode);
});

/* Grade button interactions: pressed animation then navigate */
function pressAndNavigateGrade(e){
  e.preventDefault();
  const el = e.currentTarget;
  el.classList.remove('pressed');
  // force reflow so transition always triggers
  // eslint-disable-next-line no-unused-expressions
  el.offsetWidth;
  el.classList.add('pressed');

  setTimeout(() => {
    el.classList.remove('pressed');
    const href = el.getAttribute('href');
    if(href) window.location.href = href;
  }, 160);
}

/* attach handlers to grade buttons */
gradeButtons.forEach(btn => {
  btn.addEventListener('click', pressAndNavigateGrade);
  btn.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      pressAndNavigateGrade(e);
    }
  });
  btn.addEventListener('mouseleave', () => btn.classList.remove('pressed'));
});
