import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "VR Urban Cardboard Demo",
  description: "Demo de recorrido VR/Cardboard para maqueta urbana 3D.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-MX" suppressHydrationWarning>
      <body>
        <Script
          id="aframe-local"
          src="/vendor/aframe-v1.7.1.min.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
