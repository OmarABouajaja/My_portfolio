
import { useLanguage } from '@/hooks/useLanguage';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <span>{t('builtWith')}</span>
            <span className="text-red-500">❤️</span>
            <span>React + Vite</span>
          </div>
          
          <div className="text-center text-muted-foreground">
            <p>© {currentYear} Omar Abouajaja. {t('rightsReserved')}.</p>
          </div>
          
          <div className="flex items-center space-x-4 text-muted-foreground">
            <span>🇹🇳 Zarzis, Tunisia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
