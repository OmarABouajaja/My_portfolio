import { useLanguage } from '@/providers/language'
import { motion } from 'framer-motion'

export default function About() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-6">{t('bioTitle')}</h1>
        <p className="text-xl mb-8">{t('bioSubtitle')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">{t('bioSkills')}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">IoT Development</h3>
                <p>{t('iotDescription')}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Robotics</h3>
                <p>{t('roboticsDescription')}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Embedded Systems</h3>
                <p>{t('embeddedDescription')}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">{t('technologies')}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">UI/UX Design</h3>
                <p>{t('uiuxDescription')}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Web Development</h3>
                <p>{t('webdevDescription')}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Teaching</h3>
                <p>{t('teachingDescription')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">{t('educationTitle')}</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{t('bacInfo')}</h3>
              <p>{t('bacScores')}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">{t('licenseIot')}</h3>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 