(() => {
  const INSTALL_DISMISSED_KEY = 'aikongkong_pwa_install_dismissed_v1';
  const INSTALL_INSTALLED_KEY = 'aikongkong_pwa_installed_v1';
  const CARD_ID = 'ikPwaInstallCard';
  const STYLE_ID = 'ikPwaInstallStyle';

  let deferredPrompt = null;
  let expandedIosGuide = false;

  function getUa() {
    return String(navigator.userAgent || navigator.vendor || '').toLowerCase();
  }

  function isIos() {
    return /iphone|ipad|ipod/.test(getUa());
  }

  function isSafari() {
    const ua = getUa();
    return /safari/.test(ua) && !/crios|fxios|edgios|kakaotalk|naver|line|instagram|fban|fbav/.test(ua);
  }

  function isInApp() {
    const ua = getUa();
    return /kakaotalk|naver|line|instagram|fban|fbav|fb_iab|wv/.test(ua);
  }

  function isMobile() {
    return /android|iphone|ipad|ipod|mobile/.test(getUa());
  }

  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function isSecureInstallContext() {
    return window.isSecureContext || /localhost|127\.0\.0\.1/.test(location.hostname);
  }

  function canShowCard() {
    if (!isMobile()) return false;
    if (isStandalone()) return false;
    if (localStorage.getItem(INSTALL_INSTALLED_KEY) === '1') return false;
    if (localStorage.getItem(INSTALL_DISMISSED_KEY) === '1') return false;
    return true;
  }

  function notify(message) {
    if (window.IkongkongShare?.showToast) {
      window.IkongkongShare.showToast(message, 'success');
      return;
    }
    console.info('[pwa]', message);
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .ik-pwa-install-card {
        position: fixed;
        left: 14px;
        right: 14px;
        bottom: calc(16px + env(safe-area-inset-bottom, 0px));
        z-index: 120;
        border-radius: 22px;
        background: rgba(255,255,255,0.98);
        border: 1px solid rgba(203, 213, 225, 0.95);
        box-shadow: 0 18px 38px rgba(15, 23, 42, 0.18);
        padding: 16px;
        backdrop-filter: blur(14px);
      }
      .ik-pwa-install-card[hidden] { display: none !important; }
      .ik-pwa-title {
        margin: 0 0 6px;
        font-size: 17px;
        line-height: 1.35;
        font-weight: 900;
        color: #172233;
      }
      .ik-pwa-copy {
        margin: 0;
        font-size: 13px;
        line-height: 1.6;
        color: #637287;
        font-weight: 700;
      }
      .ik-pwa-guide {
        margin-top: 10px;
        padding: 12px 13px;
        border-radius: 16px;
        background: #f8fbff;
        border: 1px solid #dbe4f0;
        font-size: 12px;
        line-height: 1.65;
        color: #475467;
        font-weight: 700;
      }
      .ik-pwa-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 12px;
      }
      .ik-pwa-btn {
        min-height: 48px;
        padding: 0 16px;
        border-radius: 15px;
        border: 1px solid #d8e1ec;
        background: #ffffff;
        color: #172233;
        font-size: 14px;
        font-weight: 800;
        cursor: pointer;
      }
      .ik-pwa-btn.primary {
        background: linear-gradient(180deg, #48b7b6 0%, #2f9191 100%);
        color: #ffffff;
        border-color: rgba(47,145,145,0.18);
        box-shadow: 0 10px 18px rgba(47,145,145,0.2);
      }
      .ik-pwa-btn.subtle {
        color: #637287;
        background: #f8fbff;
      }
      @media (min-width: 721px) {
        .ik-pwa-install-card {
          left: auto;
          width: min(380px, calc(100vw - 32px));
          right: 16px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function getCardCopy() {
    if (deferredPrompt && isSecureInstallContext()) {
      return {
        title: '앱처럼 설치해서 더 빠르게 사용하세요',
        copy: '홈 화면에 추가하면 로그인과 계약 확인, AS 접수를 더 빠르게 열 수 있습니다.',
        guide: '설치 후에는 브라우저 주소창 없이 앱처럼 실행되고, 최근 조회 캐시와 세션 복원도 더 자연스럽게 유지됩니다.',
        primaryLabel: '앱 설치'
      };
    }

    if (isIos() && isSafari()) {
      return {
        title: 'iPhone 홈 화면에 추가할 수 있어요',
        copy: 'Safari의 공유 메뉴에서 “홈 화면에 추가”를 누르면 아이콩콩 앱처럼 사용할 수 있습니다.',
        guide: expandedIosGuide
          ? '1. Safari 하단의 공유 버튼을 누르세요.\n2. “홈 화면에 추가”를 선택하세요.\n3. 이름을 확인하고 추가를 누르세요.'
          : '',
        primaryLabel: '추가 방법 보기'
      };
    }

    if (isInApp()) {
      return {
        title: '앱 내부 브라우저에서는 설치가 제한될 수 있습니다',
        copy: '카카오톡 같은 인앱브라우저에서는 설치 버튼이 보이지 않을 수 있습니다. 외부 브라우저에서 열면 홈 화면 아이콘 설치가 더 잘 됩니다.',
        guide: '공유하기나 링크 복사 후 Chrome, Safari, Samsung Internet에서 열어 설치를 진행해주세요.',
        primaryLabel: '브라우저에서 열기'
      };
    }

    return {
      title: '홈 화면에 추가해 두면 더 편합니다',
      copy: '모바일 브라우저의 메뉴에서 “홈 화면에 추가” 또는 “앱 설치”를 선택하면 빠르게 다시 열 수 있습니다.',
      guide: '',
      primaryLabel: '닫기'
    };
  }

  function getOpenInBrowserUrl() {
    return `${location.origin}${location.pathname}${location.search}${location.hash}`;
  }

  function renderCard() {
    ensureStyle();
    let card = document.getElementById(CARD_ID);
    if (!card) {
      card = document.createElement('section');
      card.id = CARD_ID;
      card.className = 'ik-pwa-install-card';
      document.body.appendChild(card);
    }

    if (!canShowCard()) {
      card.hidden = true;
      return;
    }

    const copy = getCardCopy();
    card.hidden = false;
    card.innerHTML = `
      <h2 class="ik-pwa-title">${copy.title}</h2>
      <p class="ik-pwa-copy">${copy.copy}</p>
      ${copy.guide ? `<div class="ik-pwa-guide">${copy.guide.replace(/\n/g, '<br />')}</div>` : ''}
      <div class="ik-pwa-actions">
        <button type="button" class="ik-pwa-btn primary" data-pwa-action="primary">${copy.primaryLabel}</button>
        <button type="button" class="ik-pwa-btn subtle" data-pwa-action="dismiss">나중에</button>
      </div>
    `;

    card.querySelector('[data-pwa-action="primary"]')?.addEventListener('click', handlePrimaryAction);
    card.querySelector('[data-pwa-action="dismiss"]')?.addEventListener('click', dismissCard);
  }

  function dismissCard() {
    localStorage.setItem(INSTALL_DISMISSED_KEY, '1');
    const card = document.getElementById(CARD_ID);
    if (card) card.hidden = true;
  }

  async function handlePrimaryAction() {
    if (deferredPrompt && isSecureInstallContext()) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        console.info('[pwa] beforeinstallprompt choice', choice?.outcome || 'unknown');
        if (choice?.outcome === 'accepted') {
          localStorage.setItem(INSTALL_INSTALLED_KEY, '1');
          notify('홈 화면 설치 요청을 보냈습니다.');
        }
      } catch (error) {
        console.warn('[pwa] install prompt failed', error?.message || error);
      } finally {
        deferredPrompt = null;
        renderCard();
      }
      return;
    }

    if (isIos() && isSafari()) {
      expandedIosGuide = true;
      renderCard();
      return;
    }

    if (isInApp()) {
      const targetUrl = getOpenInBrowserUrl();
      if (window.IkongkongShare?.openInBrowser) {
        window.IkongkongShare.openInBrowser(targetUrl);
      } else {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    dismissCard();
  }

  async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (!isSecureInstallContext()) return;
    try {
      const registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
      console.info('[pwa] service worker ready', registration.scope);
    } catch (error) {
      console.warn('[pwa] service worker registration failed', error?.message || error);
    }
  }

  function init() {
    registerServiceWorker();
    renderCard();
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    localStorage.removeItem(INSTALL_DISMISSED_KEY);
    renderCard();
  });

  window.addEventListener('appinstalled', () => {
    localStorage.setItem(INSTALL_INSTALLED_KEY, '1');
    deferredPrompt = null;
    notify('아이콩콩 앱이 홈 화면에 추가되었습니다.');
    renderCard();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  window.IkongkongPWA = {
    init,
    renderCard
  };
})();
