import { useState, useEffect } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import { examples } from "./examples";

type ExampleType = "monster" | "item" | "spell";

type CachedResponses = {
  [K in ExampleType]?: any;
};

const ANIMATION_DELAY = 250; // ms delay to allow animation to complete

export default function ApiExample() {
  const [selectedType, setSelectedType] = useState<ExampleType>("monster");
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cachedResponses, setCachedResponses] = useState<CachedResponses>({});

  const currentExample = examples[selectedType];
  const apiBaseUrl = "https://www.dnd5eapi.co";

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    setIsCodeVisible(true);

    try {
      const response = await fetch(`${apiBaseUrl}${currentExample.endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Add a minimum delay to allow the animation to complete
      await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAY));

      setCachedResponses((prev) => ({
        ...prev,
        [selectedType]: data,
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (newType: ExampleType) => {
    setSelectedType(newType);
    setIsCodeVisible(false);
    setError(null);
  };

  return (
    <div className={styles.apiExample} role="region" aria-label="API Example">
      <div className={styles.apiHeader}>
        <div className={styles.apiUrl}>
          <div className={styles.urlContainer}>
            <code>{currentExample.endpoint}</code>
            <button
              className={clsx(styles.selectorButton, styles.tryItButton)}
              onClick={fetchData}
              disabled={isLoading}
            >
              Try it
            </button>
          </div>
          <div
            className={styles.apiSelector}
            role="tablist"
            aria-label="API content type selector"
          >
            <button
              role="tab"
              aria-selected={selectedType === "monster"}
              className={clsx(
                styles.selectorButton,
                selectedType === "monster" && styles.selected
              )}
              onClick={() => handleTypeChange("monster")}
            >
              monster
            </button>
            <button
              role="tab"
              aria-selected={selectedType === "item"}
              className={clsx(
                styles.selectorButton,
                selectedType === "item" && styles.selected
              )}
              onClick={() => handleTypeChange("item")}
            >
              item
            </button>
            <button
              role="tab"
              aria-selected={selectedType === "spell"}
              className={clsx(
                styles.selectorButton,
                selectedType === "spell" && styles.selected
              )}
              onClick={() => handleTypeChange("spell")}
            >
              spell
            </button>
          </div>
        </div>
      </div>
      <div
        className={clsx(styles.codeBlock, isCodeVisible && styles.visible)}
        role="tabpanel"
        aria-label={`${selectedType} API response`}
      >
        {isLoading ? (
          <div className={styles.loadingState}>Loading...</div>
        ) : (
          <pre className={styles.jsonPreview}>
            {error && `Error: ${error}`}
            {!error &&
              cachedResponses[selectedType] &&
              JSON.stringify(cachedResponses[selectedType], null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
