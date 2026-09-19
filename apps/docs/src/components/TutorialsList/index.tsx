import { usePluginData } from "@docusaurus/useGlobalData";
import { Categories } from "@site/src/plugins/dynamic-tutorials-list";

export default function TutorialsList({ category }: { category: string }) {
  const { categories } = usePluginData("dynamic-tutorials-list") as {
    categories: Categories;
  };

  return (
    <ul>
      {categories[category].map((tutorial) => (
        <li key={tutorial.name}>
          <a href={tutorial.href}>{tutorial.title}</a>
        </li>
      ))}
    </ul>
  );
}
