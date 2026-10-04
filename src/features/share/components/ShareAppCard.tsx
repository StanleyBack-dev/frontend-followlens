"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy, Mail, Share2 } from "lucide-react";
import {
  siFacebook,
  siTelegram,
  siThreads,
  siWhatsapp,
  siX,
  type SimpleIcon,
} from "simple-icons";
import { Button, Card, CardBody, CardHeader, cn } from "@/design-system";

const noopSubscribe = () => () => {};

function BrandIcon({ icon }: { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-current">
      <path d={icon.path} />
    </svg>
  );
}

const targetClasses = cn(
  "flex flex-col items-center gap-2 rounded-md border border-border px-3 py-3 text-xs font-medium text-muted transition-colors",
  "hover:bg-surface-muted hover:text-fg",
);

// Lets the user send the app's link to their own networks. Every option just
// opens the network's share page with the link filled in; nothing is posted
// without the user confirming there.
export function ShareAppCard({
  url,
  message,
}: {
  /** Public address of the app. */
  url: string;
  /** Suggested text that goes with the link. */
  message: string;
}) {
  const [copied, setCopied] = useState(false);
  // The device's own share sheet (mostly phones); unknown on the server.
  const canNativeShare = useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator.share === "function",
    () => false,
  );

  const text = encodeURIComponent(message);
  const link = encodeURIComponent(url);
  const both = encodeURIComponent(`${message} ${url}`);

  const targets = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${both}`,
      icon: <BrandIcon icon={siWhatsapp} />,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${link}`,
      icon: <BrandIcon icon={siFacebook} />,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${text}&url=${link}`,
      icon: <BrandIcon icon={siX} />,
    },
    {
      label: "Threads",
      href: `https://www.threads.net/intent/post?text=${both}`,
      icon: <BrandIcon icon={siThreads} />,
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${link}&text=${text}`,
      icon: <BrandIcon icon={siTelegram} />,
    },
    {
      label: "E-mail",
      href: `mailto:?subject=${encodeURIComponent("Conheça o FollowLens")}&body=${both}`,
      icon: <Mail className="size-5" aria-hidden />,
    },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the address stays visible to copy by hand.
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: "FollowLens", text: message, url });
    } catch {
      // The user closed the share sheet.
    }
  }

  return (
    <Card>
      <CardHeader
        title="Compartilhar o FollowLens"
        description="Indique o app para quem também quer saber quem deixou de seguir."
      />
      <CardBody className="space-y-4">
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {targets.map((target) => (
            <li key={target.label}>
              <a
                href={target.href}
                target="_blank"
                rel="noopener noreferrer"
                className={targetClasses}
              >
                {target.icon}
                {target.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 sm:flex-row">
          <code className="min-w-0 flex-1 truncate rounded-md border border-border bg-surface-muted px-3 py-2.5 text-sm text-fg">
            {url}
          </code>
          <Button
            variant="secondary"
            onClick={copy}
            icon={
              copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )
            }
          >
            {copied ? "Copiado" : "Copiar link"}
          </Button>
          {canNativeShare && (
            <Button
              variant="secondary"
              onClick={nativeShare}
              icon={<Share2 className="size-4" />}
            >
              Mais opções
            </Button>
          )}
        </div>
        <p className="text-xs text-soft">
          O Instagram não aceita links por botão: copie o link e cole no story,
          na bio ou em uma mensagem.
        </p>
      </CardBody>
    </Card>
  );
}
