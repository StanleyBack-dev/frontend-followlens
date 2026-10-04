"use client";

import { useSyncExternalStore } from "react";

// What the browser lets us do about installing the app on this device.
export type InstallState = {
  /** False on the server and until the first client read. */
  ready: boolean;
  /** Already running as an installed app (own window, no browser UI). */
  installed: boolean;
  /** The browser offered an install prompt we can trigger from a button. */
  canPrompt: boolean;
  /** iPhone/iPad: no prompt exists; the user adds it from the Share menu. */
  ios: boolean;
};

// Chrome/Edge only: fired when the page is installable.
type BeforeInstallPromptEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const SERVER_STATE: InstallState = {
  ready: false,
  installed: false,
  canPrompt: false,
  ios: false,
};

let state = SERVER_STATE;
let deferredPrompt: BeforeInstallPromptEvent | null = null;
let listening = false;
const listeners = new Set<() => void>();

function update(changes: Partial<InstallState>) {
  state = { ...state, ...changes };
  listeners.forEach((listener) => listener());
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // Safari's own flag for a home-screen web app.
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS reports itself as a Mac.
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function start() {
  if (listening) return;
  listening = true;
  state = {
    ready: true,
    installed: isStandalone(),
    canPrompt: false,
    ios: isIos(),
  };

  window.addEventListener("beforeinstallprompt", (event) => {
    // Keep the browser's own mini-infobar away; the app offers its button.
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    update({ canPrompt: true });
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    update({ installed: true, canPrompt: false });
  });
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): InstallState {
  start();
  return state;
}

export function useInstallState(): InstallState {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_STATE);
}

/** Opens the browser's install dialog. Resolves to whether it was accepted. */
export async function promptInstall(): Promise<boolean> {
  const prompt = deferredPrompt;
  if (!prompt) return false;
  await prompt.prompt();
  const { outcome } = await prompt.userChoice;
  // The event can only be used once.
  deferredPrompt = null;
  update({ canPrompt: false });
  return outcome === "accepted";
}

// The invitation is shown until the user answers it, then never again on
// this browser.
const DISMISSED_KEY = "fl:install-invite-dismissed";

export function wasInviteDismissed(): boolean {
  try {
    return window.localStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    // Storage blocked: better to stay quiet than to nag on every page.
    return true;
  }
}

export function dismissInvite() {
  try {
    window.localStorage.setItem(DISMISSED_KEY, "1");
  } catch {
    // Nothing to remember it with.
  }
}
