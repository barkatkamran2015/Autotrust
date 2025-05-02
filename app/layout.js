import '../src/styles/globals.css';
import { AuthProvider } from '../src/components/AuthContext';
import { NavBar } from '../src/components/NavBar';

export const metadata = {
  title: 'Auto Company - New & Used Cars',
  description: 'Buy and sell new and used cars with Auto Company.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light"><body><AuthProvider><NavBar /><main>{children}</main></AuthProvider><script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
          })();
        `,
      }}
    /></body></html>
  );
}