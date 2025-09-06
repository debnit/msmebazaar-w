
"use client";

import { useState, useEffect } from 'react';

const useScript = (src: string): [boolean, boolean] => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (document.querySelector(`script[src="${src}"]`)) {
        setLoading(false);
        return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    const onScriptLoad = () => {
      setLoading(false);
    };

    const onScriptError = () => {
      setLoading(false);
      setError(true);
    };

    script.addEventListener('load', onScriptLoad);
    script.addEventListener('error', onScriptError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', onScriptLoad);
      script.removeEventListener('error', onScriptError);
      // It might be desirable to remove the script, but many scripts (like payment gateways)
      // are fine to leave in the DOM.
    };
  }, [src]);

  return [!loading, error];
};

export default useScript;
