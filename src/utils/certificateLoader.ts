import { readdirSync, statSync } from 'fs';
import { join } from 'path';

interface Certificate {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  organization: string;
}

const cleanTitle = (filename: string): string => {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/_/g, ' ')       // Replace underscores with spaces
    .replace(/-/g, ' ')       // Replace hyphens with spaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const extractYear = (filename: string): string => {
  const yearMatch = filename.match(/20\d{2}/);
  return yearMatch ? yearMatch[0] : '';
};

const organizationMap: { [key: string]: string } = {
  'ajsz': 'Association des Jeunes Scientifiques de Zarzis',
  'ajiz': 'Association des Jeunes Innovateurs de Zarzis',
  'clubscolaire': 'Club Scolaire',
  'diplome académique': 'Diplôme Académique',
  'fcrobots': 'FC Robots',
  'googleclub': 'Google Developer Student Club',
  'injaz': 'INJAZ Tunisia',
  'jci': 'JCI Zarzis',
  'olympiade': 'Olympiade Tunisienne'
};

const categoryMap: { [key: string]: string } = {
  'ajsz': 'Robotics',
  'ajiz': 'Innovation',
  'clubscolaire': 'Education',
  'diplome académique': 'Academic',
  'fcrobots': 'Robotics',
  'googleclub': 'Development',
  'injaz': 'Entrepreneurship',
  'jci': 'Leadership',
  'olympiade': 'Competition'
};

export const loadCertificates = async (): Promise<Certificate[]> => {
  try {
    const response = await fetch('/certificates.json');
    const data = await response.json();
    return data.certificates;
  } catch (error) {
    console.error('Error loading certificates:', error);
    return [];
  }
};

export const getCertificateStats = (certificates: Certificate[]) => {
  return {
    total: certificates.length,
    byCategory: certificates.reduce((acc, cert) => {
      acc[cert.category] = (acc[cert.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number }),
    byYear: certificates.reduce((acc, cert) => {
      acc[cert.year] = (acc[cert.year] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number }),
    byOrganization: certificates.reduce((acc, cert) => {
      acc[cert.organization] = (acc[cert.organization] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
  };
}; 