// components/Navbar.tsx
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Meu App</Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/" className={styles.navButton}>Home</Link>
        </li>
        <li>
          <Link href="/configuracoes" className={styles.navButton}>Configurações</Link>
        </li>
        <li>
          <Link href="/sair" className={styles.navButton}>Sair</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;