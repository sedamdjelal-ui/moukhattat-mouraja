"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

// حالة تُحفظ في متصفح المستخدم (localStorage) وتبقى بعد إغلاق الصفحة.
// ترجع [القيمة, دالة التغيير, هل تم التحميل]

const EVENT = "mm-storage";

function subscribe(callback) {
  window.addEventListener("storage", callback); // تغيير من تبويب آخر
  window.addEventListener(EVENT, callback); // تغيير من نفس الصفحة
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

function read(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null; // المتصفح يمنع التخزين (وضع خاص مثلاً)
  }
}

export function useStoredState(key, initialValue) {
  // في الخادم ما كاين حتى تخزين: نرجع undefined لنعرف بلي مازال ما تحمّلش
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => undefined,
  );

  const loaded = raw !== undefined;

  const value = useMemo(() => {
    if (!raw) return initialValue;
    try {
      return JSON.parse(raw);
    } catch {
      return initialValue;
    }
    // initialValue ثابتة عند الاستعمال، نعتمد فقط على النص المحفوظ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);

  const setValue = useCallback(
    (next) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // مساحة التخزين ممتلئة أو ممنوعة
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );

  return [value, setValue, loaded];
}

// معرّف بسيط لكل عنصر
export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
