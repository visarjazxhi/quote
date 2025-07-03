"use client";

import { useEffect, useState } from "react";

interface HydrationBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function HydrationBoundary({
  children,
  fallback,
}: HydrationBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Aggressive browser extension attribute removal
    const removeExtensionAttributes = () => {
      const attributesToRemove = [
        "bis_register",
        "bis_skin_checked",
        "spellcheck",
        "data-ms-editor",
        "__processed_*",
        "data-gramm",
        "data-gramm_editor",
        "data-enable-grammarly",
        "data-new-gr-c-s-check-loaded",
        "data-gr-ext-installed",
        "data-testid",
        "data-ms-editor-id",
        "data-ms-editor-loaded",
        "autocomplete",
        "autocorrect",
        "autocapitalize",
        "data-lpignore",
        "data-form-type",
      ];

      // Function to clean a single element
      const cleanElement = (element: Element) => {
        attributesToRemove.forEach((attr) => {
          if (attr.includes("*")) {
            // Handle wildcard attributes
            const prefix = attr.replace("*", "");
            Array.from(element.attributes).forEach((attribute) => {
              if (attribute.name.startsWith(prefix)) {
                element.removeAttribute(attribute.name);
              }
            });
          } else {
            if (element.hasAttribute(attr)) {
              element.removeAttribute(attr);
            }
          }
        });
      };

      // Clean all elements in the document
      const allElements = document.querySelectorAll("*");
      allElements.forEach(cleanElement);

      // Set up a MutationObserver to catch dynamically added attributes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "attributes") {
            const target = mutation.target as Element;
            const attributeName = mutation.attributeName;

            if (
              attributeName &&
              attributesToRemove.some((attr) => {
                if (attr.includes("*")) {
                  return attributeName.startsWith(attr.replace("*", ""));
                }
                return attributeName === attr;
              })
            ) {
              target.removeAttribute(attributeName);
            }
          } else if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                cleanElement(node as Element);
                // Also clean all descendants
                const descendants = (node as Element).querySelectorAll("*");
                descendants.forEach(cleanElement);
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
      });

      return () => observer.disconnect();
    };

    // Initial cleanup
    const cleanup = removeExtensionAttributes();

    // Mark as hydrated after cleanup
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);

    return () => {
      cleanup();
      clearTimeout(timer);
    };
  }, []);

  if (!isHydrated) {
    return (
      <div suppressHydrationWarning>
        {fallback || (
          <div
            className="animate-pulse min-h-screen bg-background"
            suppressHydrationWarning
          >
            <div className="h-16 bg-muted border-b" suppressHydrationWarning />
            <div
              className="container mx-auto p-6 space-y-6"
              suppressHydrationWarning
            >
              <div
                className="h-8 bg-muted rounded w-1/3"
                suppressHydrationWarning
              />
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                suppressHydrationWarning
              >
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-48 bg-muted rounded"
                    suppressHydrationWarning
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <div suppressHydrationWarning>{children}</div>;
}
