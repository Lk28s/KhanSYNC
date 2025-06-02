javascript:(function(){
  const name = 'KhanSYNC';

  // Função delay
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Função para carregar script externo
  function loadScript(src, id) {
    return new Promise((resolve, reject) => {
      if(document.getElementById(id)) return resolve();
      const script = document.createElement('script');
      script.src = src;
      script.id = id;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Falha ao carregar script ${src}`));
      document.head.appendChild(script);
    });
  }

  // Função para carregar CSS externo
  function loadCss(href) {
    return new Promise((resolve, reject) => {
      if(document.querySelector(`link[href="${href}"]`)) return resolve();
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Falha ao carregar CSS ${href}`));
      document.head.appendChild(link);
    });
  }

  // Cria tela splash futurista
  async function showSplashScreen() {
    const splash = document.createElement('div');
    splash.id = 'khansync-splash';
    splash.style.position = 'fixed';
    splash.style.top = 0;
    splash.style.left = 0;
    splash.style.width = '100vw';
    splash.style.height = '100vh';
    splash.style.background = 'radial-gradient(circle at center, #0ff, #004d4d)';
    splash.style.color = '#00fff7';
    splash.style.display = 'flex';
    splash.style.flexDirection = 'column';
    splash.style.justifyContent = 'center';
    splash.style.alignItems = 'center';
    splash.style.fontFamily = "'Orbitron', sans-serif";
    splash.style.fontWeight = '900';
    splash.style.fontSize = '3em';
    splash.style.zIndex = 999999;
    splash.style.textShadow = '0 0 10px #00fff7, 0 0 20px #00fff7, 0 0 30px #00fff7';

    splash.innerHTML = `
      <div style="margin-bottom: 0.3em;">KHANSYNC | INICIADO COM SUCESSO</div>
      <div style="font-size: 1em; font-weight: 400; color: #00b3b3; text-shadow: none;">
        KHANSYNC foi desenvolvido para automatizar suas tarefas do KhanAcademy,<br>Feito por: Lks Modder
      </div>
    `;

    document.body.appendChild(splash);

    // Carregar fonte Orbitron para o tema futurista
    if(!document.getElementById('orbitron-font')) {
      const linkFont = document.createElement('link');
      linkFont.id = 'orbitron-font';
      linkFont.rel = 'stylesheet';
      linkFont.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap';
      document.head.appendChild(linkFont);
      // Espera um pouco para a fonte carregar
      await delay(500);
    }

    await delay(5000);
    splash.remove();
  }

  // Função para mostrar toast (usando Toastify)
  function sendToast(text, duration=3000) {
    if(window.Toastify) {
      Toastify({
        text,
        duration,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(90deg, #00fff7, #004d4d)",
        stopOnFocus: true,
        style: {
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: '700',
          fontSize: '1em',
          color: '#004d4d',
          textShadow: '0 0 5px #00fff7',
          borderRadius: '8px',
          boxShadow: '0 0 10px #00fff7'
        }
      }).showToast();
    }
  }

  // Função delay para uso interno
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Função para clicar em elementos por seletor
  function findAndClickBySelector(selector) {
    const el = document.querySelector(selector);
    if(el) {
      el.click();
      return true;
    }
    return false;
  }

  // Função principal que controla o fluxo do script
  async function setupMain() {
    const selectors = [
      `[data-testid="choice-icon__library-choice-icon"]`,
      `[data-testid="exercise-check-answer"]`,
      `[data-testid="exercise-next-question"]`,
      `._1udzurba`,
      `._awve9b`
    ];

    window.khanSYNCActive = true;

    while(window.khanSYNCActive) {
      for(const selector of selectors) {
        findAndClickBySelector(selector);

        const element = document.querySelector(`${selector} > div`);
        if(element?.innerText === "Mostrar resumo") {
          sendToast("🥶┃Exercício finalizado!", 4000);
        }
      }
      await delay(800);
    }
  }

  // Função para esconder splash (já removemos no showSplashScreen)
  async function hideSplashScreen() {
    // Nada a fazer aqui pois removemos direto
  }

  // Função para carregar tudo e iniciar
  (async function init() {
    if(!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
      window.location.href = "https://pt.khanacademy.org/";
      return;
    }

    await showSplashScreen();

    await Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js','darkReaderPlugin').then(() => {
        DarkReader.setFetchMethod(window.fetch);
        DarkReader.enable({
          brightness: 100,
          contrast: 110,
          sepia: 10,
          hue: 180,
          mode: 'dark'
        });
      }),
      loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'),
      loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin'),
    ]);

    await delay(2000);

    await hideSplashScreen();

    setupMain();

    sendToast("👺┃KhanSYNC Startado!");
    console.clear();
  })();

})();
