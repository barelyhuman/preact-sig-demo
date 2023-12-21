import { signal, effect } from "@preact/signals";

export function persistedSignal(initialValue, key, storage = localStorage) {
  const sig = signal(initialValue);
  let skipSave = true;

  // try to hydrate state from storage:
  function load() {
    skipSave = true;
    try {
      const stored = JSON.parse(storage.getItem(key));
      if (stored != null) sig.value = stored;
    } catch (err) {
      // ignore blocked storage access
    }
    skipSave = false;
  }

  effect(() => {
    const value = sig.value;
    if (skipSave) return;
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(err);
      // ignore blocked storage access
    }
  });

  // if another tab changes the launch tracking state, update our in-memory copy:
  if (typeof addEventListener === "function") {
    addEventListener("storage", (ev) => {
      if (ev.key === key) load();
    });
  }

  load();
  return sig;
}
