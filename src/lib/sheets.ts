const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  status: 'Live' | 'Beta' | 'Alpha' | 'Coming Soon';
  link: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

const fallbackProjects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Analytics Platform',
    description: 'Built a real-time analytics platform using machine learning to predict user behavior.',
    technologies: ['React', 'Python', 'TensorFlow', 'AWS'],
    client: 'TechCorp Inc.',
    type: 'AI/ML',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    link: 'https://example.com/project1'
  },
  {
    id: '2',
    title: 'E-commerce Mobile App',
    description: 'Developed a cross-platform mobile app with AR product visualization.',
    technologies: ['React Native', 'Node.js', 'AR Kit', 'Firebase'],
    client: 'Fashion Forward',
    type: 'Mobile',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Healthcare Management System',
    description: 'Created a HIPAA-compliant patient management system with real-time monitoring.',
    technologies: ['Next.js', 'PostgreSQL', 'WebSocket', 'Azure'],
    type: 'Web App',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    link: 'https://example.com/project3'
  }
];

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  client?: string;
  type: string;
  image: string;
  link?: string;
}

const fallbackPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of AI-Powered Development',
    excerpt: 'Explore how artificial intelligence is revolutionizing software development.',
    content: 'Full article content here...',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
    author: 'Alex Chen',
    date: '2024-03-15',
    readTime: '5 min',
    tags: ['AI', 'Development', 'Technology'],
  },
];

const fallbackTools: AITool[] = [
  {
    id: '1',
    name: 'CodeAssist AI',
    description: 'Intelligent code completion and refactoring suggestions.',
    icon: 'Code',
    features: [
      'Real-time code suggestions',
      'Automated refactoring',
      'Bug detection',
      'Performance optimization tips',
    ],
    status: 'Beta',
    link: '#',
  },
];

async function fetchFromSheet<T>(sheet: string, mapper: (row: any[]) => T, fallback: T[]): Promise<T[]> {
  try {
    if (!SHEET_ID || !API_KEY) {
      console.warn('Missing Google Sheets credentials:', { SHEET_ID: !!SHEET_ID, API_KEY: !!API_KEY });
      return fallback;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheet}!A2:Z?key=${API_KEY}`;
    console.log(`Fetching ${sheet} data from Google Sheets...`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Failed to fetch ${sheet}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        url: url.replace(API_KEY, '***')
      });
      throw new Error(`Failed to fetch ${sheet}: ${response.statusText}`);
    }

    const data = await response.json();
    const rows = data.values || [];

    if (!rows.length) {
      console.warn(`No data found in ${sheet} sheet`);
      return fallback;
    }

    console.log(`Successfully fetched ${rows.length} rows from ${sheet}`);
    return rows.map(mapper);
  } catch (error) {
    console.error(`Error fetching ${sheet}:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error; // Re-throw the error for SWR to handle
  }
}

export async function fetchProjects(): Promise<Project[]> {
  return fetchFromSheet<Project>(
    'Projects',
    (row) => {
      const rawLink = row[7] || undefined;
      let formattedLink = rawLink;
      if (rawLink && !rawLink.startsWith('http://') && !rawLink.startsWith('https://')) {
        formattedLink = `https://${rawLink}`;
      }
      return {
        id: row[0] || '',
        title: row[1] || '',
        description: row[2] || '',
        technologies: (row[3] || '').split(',').map((tech: string) => tech.trim()),
        client: row[4] || undefined,
        type: row[5] || '',
        image: row[6] || '',
        link: formattedLink,
      };
    },
    fallbackProjects
  );
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  return fetchFromSheet<BlogPost>(
    'Blog',
    (row) => ({
      id: row[0] || '',
      title: row[1] || '',
      excerpt: row[2] || '',
      content: row[3] || '',
      image: row[4] || '',
      author: row[5] || '',
      date: row[6] || new Date().toISOString().split('T')[0],
      readTime: row[7] || '5 min',
      tags: (row[8] || '').split(',').map((tag: string) => tag.trim()),
    }),
    fallbackPosts
  );
}

export async function fetchAITools(): Promise<AITool[]> {
  return fetchFromSheet<AITool>(
    'AI Tools',
    (row) => ({
      id: row[0] || '',
      name: row[1] || '',
      description: row[2] || '',
      icon: row[3] || 'Bot',
      features: (row[4] || '').split(',').map((feature: string) => feature.trim()),
      status: (row[5] || 'Coming Soon') as AITool['status'],
      link: row[6] || '#',
    }),
    fallbackTools
  );
}

export async function submitContactForm(data: ContactFormData): Promise<boolean> {
  try {
    if (!SHEET_ID || !API_KEY) {
      console.error('Missing required environment variables for Google Sheets');
      return false;
    }

    const timestamp = new Date().toISOString();
    const range = 'Contact!A2:D'; // Start from A2 to preserve header row
    
    // First, get the current range to find the next empty row
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch current range');
    }

    const rangeData = await response.json();
    const nextRow = (rangeData.values?.length || 0) + 2; // Add 2 to account for header row
    const appendRange = `Contact!A${nextRow}:D${nextRow}`;

    // Now append the new row
    const appendResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${appendRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: appendRange,
          majorDimension: 'ROWS',
          values: [[data.name, data.email, data.message, timestamp]],
        }),
      }
    );

    if (!appendResponse.ok) {
      const errorData = await appendResponse.text();
      console.error('Failed to submit form:', {
        status: appendResponse.status,
        statusText: appendResponse.statusText,
        error: errorData
      });
      throw new Error('Failed to submit form data to Google Sheets');
    }

    return true;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return false;
  }
}