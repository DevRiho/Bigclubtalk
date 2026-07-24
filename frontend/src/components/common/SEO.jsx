import { useEffect } from "react";

export function SEO({ 
  title, 
  description, 
  image, 
  url, 
  type = "website", 
  articleData 
}) {
  useEffect(() => {
    // 1. Document Title
    const defaultTitle = "Big Club Talk | Uncompromising Football Journalism";
    document.title = title ? `${title} | Big Club Talk` : defaultTitle;
    
    // Helper to set/update meta tags in header
    const setMetaTag = (attributeName, attributeValue, contentValue) => {
      if (!contentValue) return;
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", contentValue);
    };
    
    // 2. Meta description
    const defaultDescription = "Uncompromising football journalism. Inside stories, tactical breakdowns, transfer insights, and fan-driven narratives.";
    setMetaTag("name", "description", description || defaultDescription);
    
    // 3. Open Graph Metadata
    setMetaTag("property", "og:title", title ? `${title} | Big Club Talk` : "Big Club Talk");
    setMetaTag("property", "og:description", description || defaultDescription);
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:url", url || window.location.href);
    if (image) {
      setMetaTag("property", "og:image", image);
    }
    
    // 4. Twitter Cards Metadata
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title ? `${title} | Big Club Talk` : "Big Club Talk");
    setMetaTag("name", "twitter:description", description || defaultDescription);
    if (image) {
      setMetaTag("name", "twitter:image", image);
    }
    
    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url || window.location.href);
    
    // 6. JSON-LD Structured Data
    let jsonLdScript = document.getElementById("structured-data-seo");
    if (jsonLdScript) {
      jsonLdScript.remove();
    }
    
    if (type === "article" && articleData) {
      jsonLdScript = document.createElement("script");
      jsonLdScript.id = "structured-data-seo";
      jsonLdScript.type = "application/ld+json";
      jsonLdScript.innerHTML = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": title,
        "image": [image],
        "datePublished": articleData.publishedAt || articleData.createdAt,
        "dateModified": articleData.updatedAt || articleData.publishedAt,
        "author": {
          "@type": "Person",
          "name": articleData.authorName || "Big Club Talk Writer"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Big Club Talk",
          "logo": {
            "@type": "ImageObject",
            "url": `${window.location.origin}/logo.jpeg`
          }
        },
        "description": description
      });
      document.head.appendChild(jsonLdScript);
    }
    
    return () => {
      // Clean up script on unmount
      const scriptToRemove = document.getElementById("structured-data-seo");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, image, url, type, articleData]);

  return null;
}
