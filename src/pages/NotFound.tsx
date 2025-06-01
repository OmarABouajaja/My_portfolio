import { useLanguage } from '@/providers/language';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">{t('notFoundTitle')}</h1>
      <p className="mb-8">{t('notFoundMessage')}</p>
      <Link to="/" className="btn btn-primary">
        {t('goHome')}
      </Link>
    </div>
  );
};

export default NotFound;
