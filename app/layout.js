import "./globals.css";
export const metadata = {
  title: "Mevagold — Pure Kashmiri Kesar",
  description: "Hand-picked Pampore saffron — deep-crimson Mongra and Lacha kesar from Kashmir, sealed fresh and delivered to your door.",
};
export const viewport = { themeColor: "#0B3C26" };
export default function Root({ children }) {
  return (<html lang="en"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
  </head><body>{children}</body></html>);
}
