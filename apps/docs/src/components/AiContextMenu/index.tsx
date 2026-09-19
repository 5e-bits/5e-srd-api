import React, { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";

// --- Icons ---

const CopyIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CheckIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const MarkdownIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M6 8v8l2.5-3 2.5 3V8" />
    <path d="M17.5 8L15 11.5h5L17.5 15" />
  </svg>
);

const ExternalIcon = (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const ChevronIcon = ({ up }: { up: boolean }) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.15s ease", transform: up ? "rotate(180deg)" : "rotate(0deg)" }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ClaudeIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
  </svg>
);

const ChatGPTIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
  </svg>
);

const PerplexityIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z" />
  </svg>
);

// --- Markdown extraction ---

function getPageMarkdown(): string {
  const article = document.querySelector("article");
  if (!article) return "";

  const title = document.querySelector("h1")?.textContent || document.title;
  const clone = article.cloneNode(true) as HTMLElement;

  clone
    .querySelectorAll(
      "nav, .table-of-contents, .theme-doc-footer, .pagination-nav, .ai-context-menu, .ai-context-menu-wrapper"
    )
    .forEach((el) => el.remove());

  const lines: string[] = [`# ${title}`, ""];

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) lines.push(text);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === "h1") return;
    if (tag === "h2") { lines.push("", `## ${el.textContent?.trim()}`, ""); }
    else if (tag === "h3") { lines.push("", `### ${el.textContent?.trim()}`, ""); }
    else if (tag === "h4") { lines.push("", `#### ${el.textContent?.trim()}`, ""); }
    else if (tag === "pre") {
      const code = el.querySelector("code");
      const lang = code?.className?.split(" ").find((c) => c.startsWith("language-"))?.replace("language-", "") || "";
      lines.push("", `\`\`\`${lang}`, code?.textContent?.trim() || el.textContent?.trim() || "", "```", "");
    } else if (tag === "code" && el.parentElement?.tagName.toLowerCase() !== "pre") {
      lines.push(`\`${el.textContent}\``);
    } else if (tag === "ul" || tag === "ol") {
      el.querySelectorAll(":scope > li").forEach((li, i) => {
        const prefix = tag === "ol" ? `${i + 1}. ` : "- ";
        lines.push(`${prefix}${li.textContent?.trim()}`);
      });
      lines.push("");
    } else if (tag === "table") {
      const rows = el.querySelectorAll("tr");
      rows.forEach((row, i) => {
        const cells = Array.from(row.querySelectorAll("th, td")).map((c) => c.textContent?.trim() || "");
        lines.push(`| ${cells.join(" | ")} |`);
        if (i === 0) lines.push(`| ${cells.map(() => "---").join(" | ")} |`);
      });
      lines.push("");
    } else if (tag === "p") {
      const text = el.textContent?.trim();
      if (text) lines.push(text, "");
    } else if (tag === "blockquote") {
      const text = el.textContent?.trim();
      if (text) lines.push(`> ${text}`, "");
    } else {
      el.childNodes.forEach(walk);
    }
  }

  clone.childNodes.forEach(walk);
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

// --- Menu items ---

const MENU_ITEMS = [
  {
    id: "copy",
    icon: CopyIcon,
    label: "Copy page",
    description: "Copy page as Markdown for LLMs",
    external: false,
  },
  {
    id: "view",
    icon: MarkdownIcon,
    label: "View as Markdown",
    description: "View this page as plain text",
    external: true,
  },
  { id: "divider" } as const,
  {
    id: "claude",
    icon: ClaudeIcon,
    label: "Open in Claude",
    description: "Ask questions about this page",
    url: "https://claude.ai/new",
    external: true,
  },
  {
    id: "perplexity",
    icon: PerplexityIcon,
    label: "Open in Perplexity",
    description: "Ask questions about this page",
    url: "https://www.perplexity.ai",
    external: true,
  },
  {
    id: "chatgpt",
    icon: ChatGPTIcon,
    label: "Open in ChatGPT",
    description: "Ask questions about this page",
    url: "https://chatgpt.com",
    external: true,
  },
];

// --- Component ---

export default function AiContextMenu(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleCopy() {
    const md = getPageMarkdown();
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getMarkdownUrl(): string | null {
    const path = window.location.pathname;
    // Docs and tutorial pages have corresponding .md files
    // e.g. /docs/introduction -> https://5e-bits.github.io/docs/docs/introduction.md
    // API pages (/docs/api/...) do not have .md files
    const base = "https://5e-bits.github.io/docs";
    const match = path.match(/^\/docs\/(.+?)(?:\/?)$/);
    if (match && !match[1].startsWith("api/")) {
      return `${base}/docs/${match[1].replace(/\/$/, "")}.md`;
    }
    return null;
  }

  function buildAiUrl(baseUrl: string, queryParam: string): string {
    const mdUrl = getMarkdownUrl();
    const pageUrl = window.location.href;
    const prompt = mdUrl
      ? `Fetch ${mdUrl} and read the documentation so I can ask questions about it. The page is located at ${pageUrl}`
      : `Fetch ${pageUrl} and read the page content so I can ask questions about this D&D 5e SRD API documentation. You can also fetch https://5e-bits.github.io/docs/llms.txt for a site overview.`;
    return `${baseUrl}?${queryParam}=${encodeURIComponent(prompt)}`;
  }

  async function handleOpenInAi(item: { id: string; url: string }) {
    // Always copy markdown to clipboard as a fallback
    const md = getPageMarkdown();
    await navigator.clipboard.writeText(md);

    let finalUrl: string;
    if (item.id === "claude") {
      finalUrl = buildAiUrl(item.url, "q");
    } else if (item.id === "chatgpt") {
      finalUrl = buildAiUrl(item.url, "q");
    } else if (item.id === "perplexity") {
      finalUrl = buildAiUrl(item.url + "/search", "q");
    } else {
      finalUrl = item.url;
    }

    window.open(finalUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  }

  function handleViewMarkdown() {
    const md = getPageMarkdown();
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setIsOpen(false);
  }

  function handleItemClick(item: (typeof MENU_ITEMS)[number]) {
    if (!("label" in item)) return;
    if (item.id === "copy") { handleCopy(); return; }
    if (item.id === "view") { handleViewMarkdown(); return; }
    if ("url" in item && item.url) { handleOpenInAi(item as { id: string; url: string }); }
  }

  return (
    <div className={`ai-context-menu ${styles.container}`} ref={menuRef}>
      {/* Primary button — always visible */}
      <div className={styles.buttonGroup}>
        <button
          className={styles.primaryButton}
          onClick={handleCopy}
          title="Copy page as Markdown for LLMs"
        >
          <span className={styles.primaryIcon}>
            {copied ? CheckIcon : CopyIcon}
          </span>
          <span>{copied ? "Copied!" : "Copy page"}</span>
        </button>
        <button
          className={styles.chevronButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="More options"
          aria-expanded={isOpen}
        >
          <ChevronIcon up={isOpen} />
        </button>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className={styles.dropdown}>
          {MENU_ITEMS.map((item, i) => {
            if (item.id === "divider") {
              return <div key={i} className={styles.divider} />;
            }
            if (!("label" in item)) return null;
            return (
              <button
                key={item.id}
                className={styles.dropdownItem}
                onClick={() => handleItemClick(item)}
              >
                <span className={styles.itemIcon}>{item.icon}</span>
                <span className={styles.itemContent}>
                  <span className={styles.itemLabel}>
                    {item.label}
                    {item.external && (
                      <span className={styles.externalIcon}>{ExternalIcon}</span>
                    )}
                  </span>
                  <span className={styles.itemDescription}>{item.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
