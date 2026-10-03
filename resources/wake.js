// One owner per page; repeated initialization returns the same teardown handle.
let wakeLockOwner = null;
const initWakeLock = () => {
    if (wakeLockOwner) return wakeLockOwner;
    let sentinel = null;
    let pending = false;
    let disposed = false;
    let active = true;
    const release = async () => {
        const current = sentinel;
        sentinel = null;
        if (current && !current.released) {
            try { await current.release(); }
            catch (error) { debugConsole(`Wake lock release failed: ${error}`); }
        }
    };
    const acquire = async () => {
        if (disposed || !active || pending || sentinel || document.hidden) return;
        if (typeof navigator.wakeLock?.request !== 'function') {
            debugConsole('Wake lock is not supported by this browser.');
            return;
        }
        pending = true;
        try {
            const current = await navigator.wakeLock.request('screen');
            if (disposed || !active || document.hidden) {
                await current.release();
                return;
            }
            sentinel = current;
            current.addEventListener('release', () => {
                if (sentinel === current) sentinel = null;
            }, {once: true});
            debugConsole('Wake Lock is active!');
        } catch (error) {
            debugConsole(`Wake lock unavailable: ${error}`);
        } finally { pending = false; }
    };
    const visibility = () => document.hidden ? release() : acquire();
    const pageHide = () => { active = false; void release(); };
    const pageShow = () => { active = true; void acquire(); };
    const dispose = () => {
        if (disposed) return;
        disposed = true;
        document.removeEventListener('visibilitychange', visibility);
        window.removeEventListener('pagehide', pageHide);
        window.removeEventListener('pageshow', pageShow);
        wakeLockOwner = null;
        void release();
    };
    wakeLockOwner = dispose;
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', pageHide);
    window.addEventListener('pageshow', pageShow);
    void acquire();
    return dispose;
};
