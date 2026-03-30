import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import "./config/i18n";
import LanguageSwitcher from "./components/LanguageSwitcher";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen">
        <AuthProvider>
          
          <div className="fixed top-4 right-4 z-50">
            <LanguageSwitcher />
          </div>

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}