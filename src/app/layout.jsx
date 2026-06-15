import "./globals.css";

export const metadata = {
  title: "VR Urban Cardboard Demo",
  description: "Demo de recorrido VR/Cardboard para maqueta urbana 3D.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
