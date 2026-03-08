// ═══════════════════════════════════════════════════
// BLAZETOOLS — Website Security Protection
// Anti-DevTools, Anti-Copy, Anti-Right-Click
// ═══════════════════════════════════════════════════

(function () {
    'use strict';

    // ▸ Block Right-Click Context Menu
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
    });

    // ▸ Block Keyboard Shortcuts
    document.addEventListener('keydown', function (e) {
        // F12 — DevTools
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+I — DevTools Inspector
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+J — DevTools Console
        if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+C — DevTools Element Picker
        if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+U — View Source
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+S — Save Page
        if (e.ctrlKey && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+A — Select All
        if (e.ctrlKey && (e.key === 'A' || e.key === 'a' || e.keyCode === 65)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+C — Copy
        if (e.ctrlKey && !e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+P — Print
        if (e.ctrlKey && (e.key === 'P' || e.key === 'p' || e.keyCode === 80)) {
            e.preventDefault();
            return false;
        }
    });

    // ▸ Block Drag & Select
    document.addEventListener('selectstart', function (e) {
        e.preventDefault();
    });

    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
    });

    // ▸ DevTools Detection (debugger trap)
    (function detectDevTools() {
        const threshold = 160;
        const check = function () {
            const widthDiff = window.outerWidth - window.innerWidth > threshold;
            const heightDiff = window.outerHeight - window.innerHeight > threshold;
            if (widthDiff || heightDiff) {
                document.body.innerHTML = '';
                document.title = '⚠️';
                window.location.href = 'about:blank';
            }
        };
        setInterval(check, 1500);
    })();

    // ▸ Block console methods
    const noop = function () { };
    try {
        Object.defineProperty(window, 'console', {
            get: function () {
                return {
                    log: noop, warn: noop, error: noop, info: noop,
                    debug: noop, dir: noop, table: noop, trace: noop,
                    assert: noop, clear: noop, count: noop, group: noop,
                    groupEnd: noop, time: noop, timeEnd: noop
                };
            },
            set: noop
        });
    } catch (e) { }

})();
