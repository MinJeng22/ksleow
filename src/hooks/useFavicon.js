import { useEffect } from 'react';

export default function useFavicon(faviconUrl) {
  useEffect(() => {
    if (!faviconUrl) return;
    
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    const previousHref = link.href;
    link.href = faviconUrl;

    return () => {
      link.href = previousHref;
    };
  }, [faviconUrl]);
}
