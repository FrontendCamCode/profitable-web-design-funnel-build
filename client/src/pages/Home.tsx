import { useRef, useState } from "react";

const pageMap: Record<string, string> = {
  "/": "/sales/index.html",
  "/sales": "/sales/index.html",
  "/checkout": "/checkout/index.html",
  "/oto": "/oto/index.html",
  "/oto2": "/oto2/index.html",
  "/thank-you": "/thank-you/index.html",
};

export default function Home() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1200);
  const src = pageMap[window.location.pathname] || "/sales/index.html";

  const resizeFrame = () => {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;
    setHeight(Math.max(900, doc.documentElement.scrollHeight, doc.body.scrollHeight));
  };

  return (
    <main className="reference-host">
      <iframe
        ref={frameRef}
        title={`${window.location.pathname.slice(1) || "sales"} page mirror`}
        src={src}
        className="reference-frame"
        style={{ height }}
        onLoad={resizeFrame}
      />
    </main>
  );
}
