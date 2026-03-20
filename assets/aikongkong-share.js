(() => {
  function getRaf() {
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      return window.requestAnimationFrame.bind(window);
    }
    return (cb) => window.setTimeout(cb, 0);
  }

  function normalizeUrl(rawUrl) {
    try {
      return new URL(String(rawUrl || '').trim(), window.location.origin).toString();
    } catch (_) {
      return '';
    }
  }

  function ensureToastRoot() {
    let root = document.getElementById('ikongkongToastRoot');
    if (root) return root;

    root = document.createElement('div');
    root.id = 'ikongkongToastRoot';
    Object.assign(root.style, {
      position: 'fixed',
      left: '50%',
      bottom: '24px',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      width: 'min(92vw, 420px)',
      zIndex: '9999',
      pointerEvents: 'none'
    });
    document.body.appendChild(root);
    return root;
  }

  function detectEnvironment() {
    const ua = String((typeof navigator !== 'undefined' && navigator.userAgent) || '').trim();
    const isKakao = /KAKAOTALK/i.test(ua);
    const isInstagram = /Instagram/i.test(ua);
    const isFacebook = /FBAN|FBAV/i.test(ua);
    const isLine = /Line\//i.test(ua);
    const isNaver = /NAVER/i.test(ua);
    const isWebView = /\bwv\b|; wv\)/i.test(ua);
    const isInApp = isKakao || isInstagram || isFacebook || isLine || isNaver || isWebView;
    return { ua, isKakao, isInApp, isInstagram, isFacebook, isLine, isNaver, isWebView };
  }

  function buildExternalBrowserUrl(targetUrl, env) {
    if (env?.isKakao) {
      return `kakaotalk://web/openExternal?url=${encodeURIComponent(targetUrl)}`;
    }
    return targetUrl;
  }

  function openInBrowser(targetUrl, env = detectEnvironment()) {
    const externalUrl = buildExternalBrowserUrl(targetUrl, env);
    try {
      window.location.href = externalUrl;
      return true;
    } catch (_) {
      try {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
        return true;
      } catch (__){
        return false;
      }
    }
  }

  function showToast(message, type = 'success', action = null) {
    const text = String(message || '').trim();
    if (!text) return;

    const root = ensureToastRoot();
    const toast = document.createElement('div');
    Object.assign(toast.style, {
      background: type === 'error' ? '#1f2937' : '#111827',
      color: '#ffffff',
      borderRadius: '16px',
      padding: '14px 16px',
      fontSize: '14px',
      lineHeight: '1.5',
      boxShadow: '0 16px 40px rgba(15, 23, 42, 0.24)',
      opacity: '0',
      transform: 'translateY(8px)',
      transition: 'opacity 0.18s ease, transform 0.18s ease',
      pointerEvents: 'auto'
    });

    const messageEl = document.createElement('div');
    messageEl.textContent = text;
    toast.appendChild(messageEl);

    if (action && action.label && typeof action.onClick === 'function') {
      const actionBtn = document.createElement('button');
      actionBtn.type = 'button';
      actionBtn.textContent = String(action.label).trim();
      Object.assign(actionBtn.style, {
        marginTop: '10px',
        minHeight: '42px',
        border: '0',
        borderRadius: '12px',
        padding: '0 14px',
        background: '#ffffff',
        color: '#111827',
        fontSize: '14px',
        fontWeight: '800',
        cursor: 'pointer'
      });
      actionBtn.addEventListener('click', () => {
        try {
          action.onClick();
        } finally {
          toast.remove();
        }
      });
      toast.appendChild(actionBtn);
    }

    root.appendChild(toast);

    getRaf()(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    window.setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      window.setTimeout(() => toast.remove(), 220);
    }, 2200);
  }

  function notify(message, type, onStatus, action = null) {
    if (typeof onStatus === 'function') {
      try {
        onStatus(message, type);
      } catch (_) {}
    }
    showToast(message, type, action);
  }

  async function copyTextFallback(text) {
    const value = String(text || '').trim();
    if (!value) return false;

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }

    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    return copied;
  }

  async function shareLink(options = {}) {
    const shareUrl = normalizeUrl(options.url);
    const shareData = {
      title: String(options.title || '공유하기').trim(),
      text: String(options.text || '').trim(),
      url: shareUrl
    };
    const onStatus = options.onStatus;
    const env = detectEnvironment();

    if (!shareUrl) {
      notify('공유할 링크를 만들지 못했습니다.', 'error', onStatus);
      return { ok: false, method: 'none', reason: 'invalid-url' };
    }

    const canUseNativeShare =
      window.isSecureContext &&
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function';

    console.info('[share] environment', env);
    console.info('[share] supported', canUseNativeShare);
    console.info('[share] payload', shareData);

    let shareError = null;
    if (canUseNativeShare) {
      try {
        await navigator.share(shareData);
        notify('기기 기본 공유 창을 열었습니다.', 'success', onStatus);
        return { ok: true, method: 'native-share' };
      } catch (err) {
        console.error('[share] failed', err?.name, err?.message);

        if (err?.name === 'AbortError') {
          notify('공유가 취소되었습니다.', 'success', onStatus);
          return { ok: false, cancelled: true, method: 'native-share' };
        }

        shareError = err;
      }
    }

    try {
      await copyTextFallback(shareUrl);
      const fallbackMethod = navigator.clipboard?.writeText ? 'clipboard-fallback' : 'execCommand-fallback';
      if (env.isInApp) {
        notify(
          '앱 내부에서는 공유가 제한될 수 있습니다. 링크를 복사했으니 브라우저에서 열어주세요.',
          'success',
          onStatus,
          {
            label: '브라우저로 열기',
            onClick: () => openInBrowser(shareUrl, env)
          }
        );
        return { ok: true, method: fallbackMethod, reason: shareError?.name || 'in-app-browser' };
      }

      if (shareError) {
        notify('공유를 열지 못해 링크를 대신 복사했습니다.', 'success', onStatus);
      } else {
        notify('공유 기능을 지원하지 않아 링크를 복사했습니다.', 'success', onStatus);
      }
      return { ok: true, method: fallbackMethod, reason: shareError?.name || '' };
    } catch (err) {
      console.error('[share] clipboard failed', err?.name, err?.message);
      notify('공유와 링크 복사에 모두 실패했습니다.', 'error', onStatus);
      return { ok: false, method: 'none', reason: 'clipboard-failed' };
    }
  }

  window.IkongkongShare = {
    detectEnvironment,
    normalizeUrl,
    openInBrowser,
    showToast,
    shareLink
  };
})();
