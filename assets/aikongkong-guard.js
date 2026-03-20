(() => {
  function bindBeforeUnload(getDirty, getMessage) {
    const handler = (event) => {
      let dirty = false;
      try {
        dirty = typeof getDirty === 'function' ? !!getDirty() : !!getDirty;
      } catch (_) {
        dirty = false;
      }

      if (!dirty) return undefined;

      const message = typeof getMessage === 'function'
        ? String(getMessage() || '').trim()
        : String(getMessage || '작성 중인 내용이 저장되지 않을 수 있습니다.').trim();

      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }

  window.IkongkongLeaveGuard = {
    bindBeforeUnload
  };
})();
