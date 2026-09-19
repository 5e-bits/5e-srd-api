import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import { Book, BookOpen, HelpCircle } from "react-feather";

type FeatureItem = {
  title: string;
  Icon: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Tutorials",
    Icon: BookOpen,
    description: (
      <>
        If you're a professional developer or a beginner just starting your
        journey, we've got a curated selection of tutorials and example projects
        to get you building with the API..
      </>
    ),
    link: "/docs/tutorials/beginner/getting-started",
  },
  {
    title: "API Reference",
    Icon: Book,
    description: (
      <>
        Jump straight into the API documentation. If you want to see what data
        the API has to offer along with some code examples in popular languages,
        this is the place for you.
      </>
    ),
    link: "/docs/api",
  },

  {
    title: "FAQ",
    Icon: HelpCircle,
    description: (
      <>
        Got questions about the the API? Check out our FAQ and see if we've
        already got an answer for ya.
      </>
    ),
    link: "/docs/faq",
  },
];

function Feature({ title, Icon, description, link }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <Link to={link} className={styles.featureLink}>
        <div className={styles.featureCard}>
          <Icon className={styles.featureIcon} />
          <h3 className={styles.featureTitle}>{title}</h3>
          <p className={styles.featureDescription}>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
