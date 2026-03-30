import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import I18nProvider from "./components/I18nProvider";
import LanguageSwitcher from "./components/LanguageSwitcher";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen">
        <AuthProvider>
          <I18nProvider>
            <div className="fixed top-4 right-4 z-50">
              <LanguageSwitcher />
            </div>
            {children}
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}