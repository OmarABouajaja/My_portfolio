import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/providers/language';

const Meta = () => {
  const { language } = useLanguage();

  const title = language === 'fr'
    ? "Omar Abouajaja | Développeur IoT & Formateur en Robotique"
    : "Omar Abouajaja | IoT Developer & Robotics Trainer";

  const description = language === 'fr'
    ? "Portfolio d'Omar Abouajaja, développeur IoT et formateur en robotique. Découvrez mes projets innovants en IoT, robotique et développement web."
    : "Omar Abouajaja's portfolio - IoT developer and robotics trainer. Discover my innovative projects in IoT, robotics, and web development.";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/og-image.jpg" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="/og-image.jpg" />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#000000" />
      <meta name="keywords" content="IoT, Robotics, ESP32, Arduino, Web Development, Tunisia, Smart Home, Automation" />
      <meta name="author" content="Omar Abouajaja" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/logo192.png" />
      
      {/* Language */}
      <html lang={language} />
    </Helmet>
  );
};

export default Meta; 