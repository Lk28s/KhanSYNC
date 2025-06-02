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
      <div style="font-size: 1em; font-weight: 400; color: #00b3b3; text-shadow: none; text-align:center; max-width: 80vw;">
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

  // Função para substituir nomes e mensagens no console e toast
  function patchGlobals() {
    // Substituir console.log para prefixar com KhanSYNC
    const originalLog = console.log;
    console.log = function(...args) {
      if(args.length > 0 && typeof args[0] === 'string') {
        args[0] = args[0].replace(/KhanResolver/gi, name).replace(/Khanware/gi, name);
      }
      originalLog.apply(console, args);
    };

    // Substituir alert para prefixar com KhanSYNC (se usado)
    const originalAlert = window.alert;
    window.alert = function(msg) {
      if(typeof msg === 'string') {
        msg = msg.replace(/KhanResolver/gi, name).replace(/Khanware/gi, name);
      }
      originalAlert(msg);
    };

    // Substituir Toastify showToast para prefixar texto
    if(window.Toastify) {
      const originalToast = Toastify.prototype.showToast;
      Toastify.prototype.showToast = function() {
        if(this.options && this.options.text) {
          this.options.text = this.options.text.replace(/KhanResolver/gi, name).replace(/Khanware/gi, name);
        }
        originalToast.apply(this);
      };
    }
  }

  // Função principal para iniciar tudo
  (async function init() {
    if(!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
      window.location.href = "https://pt.khanacademy.org/";
      return;
    }

    await showSplashScreen();

    // Carregar dependências do script original
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

    patchGlobals();

    // Agora carrega e executa o script original KhanResolver
    const response = await fetch('https://raw.githubusercontent.com/DarkModde/Dark-Scripts/refs/heads/main/KhanResolver.js');
    const code = await response.text();
    eval(code);

    console.clear();
    console.log(`${name} iniciado com sucesso!`);
  })();

})();
