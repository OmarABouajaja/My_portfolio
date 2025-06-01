import { useLanguage } from '@/providers/language';

const Bio = () => {
  const { t } = useLanguage();
  const bioTitle = t('bioTitle') as string;
  const bioSubtitle = t('bioSubtitle') as string;
  const bioSkills = t('bioSkills') as string;
  const technologies = t('technologies') as string;
  const iotDescription = t('iotDescription') as string;
  const roboticsDescription = t('roboticsDescription') as string;
  const embeddedDescription = t('embeddedDescription') as string;
  const uiuxDescription = t('uiuxDescription') as string;
  const webdevDescription = t('webdevDescription') as string;
  const teachingDescription = t('teachingDescription') as string;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">{bioTitle}</h2>
        <p className="text-xl mb-8">{bioSubtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4">{bioSkills}</h3>
            <ul className="space-y-4">
              <li>
                <h4 className="font-medium">IoT Development</h4>
                <p>{iotDescription}</p>
              </li>
              <li>
                <h4 className="font-medium">Robotics</h4>
                <p>{roboticsDescription}</p>
              </li>
              <li>
                <h4 className="font-medium">Embedded Systems</h4>
                <p>{embeddedDescription}</p>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">{technologies}</h3>
            <ul className="space-y-4">
              <li>
                <h4 className="font-medium">UI/UX Design</h4>
                <p>{uiuxDescription}</p>
              </li>
              <li>
                <h4 className="font-medium">Web Development</h4>
                <p>{webdevDescription}</p>
              </li>
              <li>
                <h4 className="font-medium">Teaching & Training</h4>
                <p>{teachingDescription}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bio; 