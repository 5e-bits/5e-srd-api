import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "D&D 5e SRD API",
  tagline: "REST + GraphQL API for the 5e SRD database",
  url: "https://5e-bits.github.io",
  trailingSlash: false,
  baseUrl: "/docs/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "5e-bits", // Usually your GitHub org/user name.
  projectName: "docs", // Usually your repo name.
  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "docusaurus-preset-openapi",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],

  plugins: [
    require.resolve("./src/plugins/dynamic-tutorials-list"),
    [
      "docusaurus-plugin-llms",
      {
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        generateMarkdownFiles: true,
        docsDir: "docs",
        title: "D&D 5e SRD API Documentation",
        description:
          "REST + GraphQL API for the 5e SRD database. Includes guides, tutorials, API reference, and schema documentation.",
      },
    ],
  ],

  themeConfig: {
    languageTabs: [
      {
        tabName: "cURL",
        highlight: "bash",
        language: "curl",
        variant: "curl",
        options: {
          longFormat: false,
          followRedirect: true,
          trimRequestBody: true,
        },
      },
      {
        tabName: "PowerShell",
        highlight: "powershell",
        language: "powershell",
        variant: "RestMethod",
        options: {
          followRedirect: true,
          trimRequestBody: true,
        },
      },
      {
        tabName: "Javascript",
        highlight: "javascript",
        language: "javascript",
        variant: "fetch",
        options: {
          ES6_enabled: true,
          trimRequestBody: true,
        },
      },
      {
        tabName: "Python",
        highlight: "python",
        language: "python",
        variant: "requests",
        options: {
          followRedirect: true,
          trimRequestBody: true,
        },
      },
      {
        tabName: "Go",
        highlight: "go",
        language: "go",
        variant: "native",
        options: {
          followRedirect: true,
          trimRequestBody: true,
        },
      },
      {
        tabName: "Swift",
        highlight: "swift",
        language: "swift",
        variant: "URLSession",
        options: {
          followRedirect: true,
          trimRequestBody: true,
        },
      },
      {
        tabName: "C#",
        highlight: "csharp",
        language: "csharp",
        variant: "httpclient",
        options: {
          followRedirect: true,
          trimRequestBody: true,
        },
      },
      {
        tabName: "Java",
        highlight: "java",
        language: "java",
        variant: "okhttp",
        options: {
          followRedirect: true,
          trimRequestBody: true,
        },
      },
    ],
    image: "https://www.dnd5eapi.co/public/DnD-5e-meta-4k.png",
    // announcementBar: {
    //   content: "Join us on our community <a target='_blank' rel='noopener noreferrer' href='https://discord.gg/TQuYTv7'>Discord</a>!",
    // },
    metadata: [
      {
        name: "keywords",
        content: "Dungeons, Dragons, 5th, Edition, API, SRD",
      },
      { name: "theme-color", content: "#D81921" },
      { property: "og:title", content: "D&D 5e SRD API" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://5e-bits.github.io/docs/" },
    ],
    navbar: {
      title: "D&D 5e SRD API",
      logo: {
        alt: "A Red D20 Die depicting the number 20",
        src: "img/favicon.ico",
      },
      items: [
        {
          type: "doc",
          docId: "introduction",
          position: "left",
          label: "Docs",
        },
        {
          type: "doc",
          docId: "tutorials/index",
          position: "left",
          label: "Tutorials",
        },
        {
          to: "/api",
          position: "left",
          label: "API",
        },
        {
          type: "docsVersionDropdown",
          position: "left",
          dropdownActiveClassDisabled: true,
        },
        {
          to: "https://5e-bits.github.io/dnd-uptime",
          label: "Status",
          position: "left",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              href: "https://discord.gg/TQuYTv7",
            },
          ],
        },
        {
          title: "Contribute",
          items: [
            {
              label: "API Source",
              href: "https://github.com/5e-bits/5e-srd-api",
            },
            {
              label: "Docs Source",
              href: "https://github.com/5e-bits/docs",
            },
            {
              label: "Database Source",
              href: "https://github.com/5e-bits/5e-database",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} 5e-bits. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: [
        "powershell",
        "csharp",
        "java",
        "kotlin",
        "swift",
        "rust",
        "ruby",
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
