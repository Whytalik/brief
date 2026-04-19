type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l([...toasts]));
}

export const toast = {
  success(message: string) {
    add(message, "success");
  },
  error(message: string) {
    add(message, "error");
  },
  info(message: string) {
    add(message, "info");
  },
};

function add(message: string, type: ToastType) {
  const id = Math.random().toString(36).slice(2);
  toasts = [...toasts, { id, message, type }];
  notify();
  setTimeout(() => remove(id), 4000);
}

export function remove(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getToasts() {
  return toasts;
}
