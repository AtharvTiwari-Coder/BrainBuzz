const startBtn = document.getElementById('startBtn');
const themeRange = document.getElementById('themeSelect');
const body = document.body;

/* helper: apply theme with smooth dissolve transition */
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

/* map slider values: 0=system,1=dark,2=white */
function sliderToMode(val){
  if(val === '0') return 'system';
  if(val === '1') return 'dark';
  return 'white';
}

/* initialize default = system */
let saved = localStorage.getItem('brainbuzz-theme') || 'system';
const initialVal = saved === 'system' ? '0' : (saved === 'dark' ? '1' : '2');
themeRange.value = initialVal;
applyThemeMode(saved);

/* listen for system changes when in system mode */
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

/* slider interaction */
themeRange.addEventListener('input', (e) => {
  const mode = sliderToMode(e.target.value);
  localStorage.setItem('brainbuzz-theme', mode);
  applyThemeMode(mode);
});

/* BUTTON INTERACTIONS
   Use classes instead of inline styles so hover works reliably every time.
   Hover: scale 1.10 (CSS :hover)
   Click/pressed: add .pressed (scale 1.25) then navigate after short delay
*/
function pressAndNavigate(e){
  e.preventDefault();
  // ensure any existing pressed state is cleared first
  startBtn.classList.remove('pressed');
  // force reflow so the class re-application always triggers transition
  // eslint-disable-next-line no-unused-expressions
  startBtn.offsetWidth;
  startBtn.classList.add('pressed');

  // short delay to show pressed state, then remove and navigate
  setTimeout(() => {
    startBtn.classList.remove('pressed');
    window.location.href = startBtn.getAttribute('href');
  }, 180);
}

/* click */
startBtn.addEventListener('click', pressAndNavigate);

/* ensure hover/leave returns to normal */
startBtn.addEventListener('mouseleave', () => {
  startBtn.classList.remove('pressed');
});

/* keyboard activation */
startBtn.addEventListener('keydown', (e) => {
  if(e.key === 'Enter' || e.key === ' '){
    e.preventDefault();
    pressAndNavigate(e);
  }
});
