import '../src/styles/globals.css';
import { AuthProvider } from '../src/components/AuthContext';
import { NavBar } from '../src/components/NavBar';

export const metadata = {
  title: 'Auto Company - New & Used Cars',
  description: 'Buy and sell new and used cars with Auto Company.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavBar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}