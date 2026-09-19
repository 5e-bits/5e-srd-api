import clsx from "clsx";
import { JSX, useState } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import ApiExample from "@site/src/components/ApiExample";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const [isApiVisible, setIsApiVisible] = useState(false);

  return (
    <header className={clsx("hero", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className={clsx(styles.button, "button")}
            to="/docs/introduction"
          >
            Get Started
          </Link>
          <button
            className={clsx(styles.button, "button", "button--secondary")}
            onClick={() => setIsApiVisible(!isApiVisible)}
            aria-label={isApiVisible ? "Close API example" : "Try the API"}
          >
            {isApiVisible ? "Close" : "Try the API"}
          </button>
        </div>
        <div
          className={clsx(
            styles.apiExampleWrapper,
            isApiVisible && styles.visible
          )}
        >
          {isApiVisible && <ApiExample />}
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={"Home"} description={siteConfig.tagline}>
      <HomepageHeader />
      <main className={styles.gradientBackdrop}>
        <div className={styles.noise} />
      </main>
    </Layout>
  );
}
