import { useEffect } from "react";
import useApiResource from "../hooks/useApiResource";

function SiteMetadata() {
  const { value: settings } = useApiResource("/api/settings/");

  useEffect(() => {
    if (settings?.websiteTitle) document.title = settings.websiteTitle;
    if (settings?.metaDescription) {
      let description = document.querySelector('meta[name="description"]');
      if (!description) {
        description = document.createElement("meta");
        description.name = "description";
        document.head.append(description);
      }
      description.content = settings.metaDescription;
    }
  }, [settings]);

  return null;
}

export default SiteMetadata;
