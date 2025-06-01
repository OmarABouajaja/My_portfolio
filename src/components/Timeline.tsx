import { useTranslation } from '@/hooks/useTranslation';
import { DeviceIcon, RobotIcon, ParkingIcon, MedalIcon, RocketIcon, PaletteIcon } from '@/components/ui/custom-icons';

interface TimelineItem {
  year: number;
  icon: React.FC<{ className?: string }>;
  titleKey: string;
}

const timelineItems: TimelineItem[] = [
  { year: 2018, icon: DeviceIcon, titleKey: 'timeline2018' },
  { year: 2019, icon: RobotIcon, titleKey: 'timeline2019' },
  { year: 2020, icon: ParkingIcon, titleKey: 'timeline2020' },
  { year: 2022, icon: MedalIcon, titleKey: 'timeline2022' },
  { year: 2023, icon: RocketIcon, titleKey: 'timeline2023' },
  { year: 2024, icon: PaletteIcon, titleKey: 'timeline2024' },
];

const Timeline = () => {
  const { t } = useTranslation();

  return (
    <div className="relative container mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-12">{t('timelineTitle')}</h2>
      
      {/* Timeline Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/20" />
      
      {/* Timeline Items */}
      <div className="relative space-y-12">
        {timelineItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.year}
              className={`flex items-center ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Content */}
              <div className="w-5/12">
                <div className={`p-4 bg-card rounded-lg shadow-md ${
                  index % 2 === 0 ? 'text-right' : 'text-left'
                }`}>
                  <span className="text-sm text-muted-foreground">{item.year}</span>
                  <h3 className="text-lg font-semibold mt-1">{t(item.titleKey)}</h3>
                </div>
              </div>

              {/* Icon */}
              <div className="w-2/12 flex justify-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* Empty space for alternating layout */}
              <div className="w-5/12" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline; 