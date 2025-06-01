import { useLanguage } from '@/providers/language'
import { Link } from 'react-router-dom'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageToggle from '@/components/LanguageToggle'

export function Navigation() {
  const { t } = useLanguage()

  return (
    <nav className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-lg font-bold">
          {t('home') as string}
        </Link>
        <Link to="/about" className="text-lg">
          {t('about') as string}
        </Link>
        <Link to="/projects" className="text-lg">
          {t('projects') as string}
        </Link>
        <Link to="/contact" className="text-lg">
          {t('contact') as string}
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </nav>
  )
} 