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
    technologies: 'React, Python, TensorFlow, AWS',
    client: 'TechCorp Inc.',
    type: 'AI/ML',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    link: 'https://example.com',
  },
  {
    id: '2',
    title: 'E-Commerce Website Redesign',
    description: 'Completely redesigned the UX/UI of an online retail platform, increasing conversion rates by 40%.',
    technologies: 'React, TypeScript, Node.js, MongoDB',
    client: 'RetailGiant',
    type: 'Web Development',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    link: 'https://example.com',
  },
];

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
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

async function fetchFromSheet<T>(sheet: string, mapper: (row: string[]) => T, fallback: T[]): Promise<T[]> {
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
  try {
    console.log('Fetching projects from Google Sheets...');
    const projects = await fetchFromSheet<Project>(
      'Projects',
      (row) => {
        console.log('Processing row:', row);
        const rawLink = row[7] || undefined;
        let formattedLink = rawLink;
        if (rawLink && !rawLink.startsWith('http://') && !rawLink.startsWith('https://')) {
          formattedLink = `https://${rawLink}`;
        }
        const project = {
          id: row[0] || '',
          title: row[1] || '',
          description: row[2] || '',
          technologies: row[3] || '',
          client: row[4] || undefined,
          type: row[5] || '',
          image: row[6] || '',
          link: formattedLink,
        };
        console.log('Processed project:', project);
        return project;
      },
      fallbackProjects
    );
    console.log('Projects fetched:', projects);
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return fallbackProjects;
  }
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
      console.error('Missing required environment variables for Google Sheets:', {
        hasSheetId: !!SHEET_ID,
        hasApiKey: !!API_KEY
      });
      return false;
    }

    const timestamp = new Date().toISOString();
    
    // First, try to append directly without checking the range
    const appendRange = 'Contact!A2:D';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${appendRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${API_KEY}`;
    
    console.log('Attempting to submit contact form...', {
      sheetId: SHEET_ID.substring(0, 5) + '...',
      range: appendRange,
      hasData: !!data.name && !!data.email && !!data.message
    });

    const appendResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: appendRange,
        majorDimension: 'ROWS',
        values: [[data.name, data.email, data.message, timestamp]],
      }),
    });

    const responseText = await appendResponse.text();
    console.log('Google Sheets API Response:', {
      status: appendResponse.status,
      statusText: appendResponse.statusText,
      response: responseText.substring(0, 200) // Log first 200 chars of response
    });

    if (!appendResponse.ok) {
      throw new Error(`Failed to submit form: ${appendResponse.status} ${appendResponse.statusText}`);
    }

    // Try to parse the response to make sure it's valid
    try {
      JSON.parse(responseText);
    } catch (e) {
      console.error('Invalid JSON response from Google Sheets API:', e);
      throw new Error('Invalid response from server');
    }

    return true;
  } catch (error) {
    console.error('Error submitting contact form:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined
    });
    return false;
  }
}