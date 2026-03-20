(() => {
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

  function showToast(message, type = 'success') {
    const text = String(message || '').trim();
    if (!text) return;

    const root = ensureToastRoot();
    const toast = document.createElement('div');
    toast.textContent = text;
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
      transition: 'opacity 0.18s ease, transform 0.18s ease'
    });
    root.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    window.setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      window.setTimeout(() => toast.remove(), 220);
    }, 2200);
  }

  function notify(message, type, onStatus) {
    if (typeof onStatus === 'function') {
      try {
        onStatus(message, type);
      } catch (_) {}
    }
    showToast(message, type);
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

    if (!shareUrl) {
      notify('공유할 링크를 만들지 못했습니다.', 'error', onStatus);
      return { ok: false, method: 'none', reason: 'invalid-url' };
    }

    const canUseNativeShare =
      window.isSecureContext &&
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function';

    console.info('[share] supported', canUseNativeShare);
    console.info('[share] payload', shareData);

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
      }
    }

    try {
      await copyTextFallback(shareUrl);
      notify('공유 기능을 지원하지 않아 링크를 복사했습니다.', 'success', onStatus);
      return { ok: true, method: navigator.clipboard?.writeText ? 'clipboard-fallback' : 'execCommand-fallback' };
    } catch (err) {
      console.error('[share] clipboard failed', err?.name, err?.message);
      notify('공유와 링크 복사에 모두 실패했습니다.', 'error', onStatus);
      return { ok: false, method: 'none', reason: 'clipboard-failed' };
    }
  }

  window.IkongkongShare = {
    normalizeUrl,
    showToast,
    shareLink
  };
})();
