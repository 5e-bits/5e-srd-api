import path from "path";
import fs from "fs";
import { LoadContext, PluginOptions, Plugin } from "@docusaurus/types";

function makeTitle(name: string) {
  return name
    .split(/\W+/)
    .map((word) =>
      word.length > 3 ? word.charAt(0).toUpperCase() + word.substring(1) : word
    )
    .join(" ");
}

function readCategories(dir: string, baseUrl: string) {
  return Object.fromEntries(
    fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map(({ name }) => [name, readCategory(name, dir, baseUrl)])
  );
}

function readCategory(category: string, dir: string, baseUrl: string) {
  const categoryDir = path.join(dir, category);

  return fs
    .readdirSync(categoryDir)
    .filter((file) => /\.mdx?/.test(file))
    .map((file) => {
      const name = file.substring(0, file.lastIndexOf("."));

      const filePath = path.join(categoryDir, file);
      const contents = fs.readFileSync(filePath).toString();

      const mdTitle = contents.match(/\#[^\r\n]+/);
      const title =
        mdTitle !== null ? mdTitle[0].substring(1).trim() : makeTitle(name);

      const href = baseUrl + `tutorials/${category}/${name}`;

      return { name, title, href };
    });
}

export type Categories = Record<
  string,
  { name: string; title: string; href: string }[]
>;

export default async function dynamicTutorialsListPlugin(
  context: LoadContext,
  options: PluginOptions
): Promise<Plugin> {
  return {
    name: "dynamic-tutorials-list",
    async contentLoaded({ actions }) {
      const tutorialsDir = path.join(context.siteDir, "/docs/tutorials");
      const categories = readCategories(tutorialsDir, context.baseUrl);
      actions.setGlobalData({ categories });
    },
  };
}
