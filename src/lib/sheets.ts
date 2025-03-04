// Constants for environment variables - referenced for clarity
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

// Set up fallback projects for when the Google Sheet isn't available
export const fallbackProjects: Project[] = [
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
    const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    
    if (!sheetId || !apiKey) {
      console.warn('Missing Google Sheets credentials:', { 
        hasSheetId: !!sheetId, 
        hasApiKey: !!apiKey 
      });
      return fallback;
    }

    // Add a timestamp to prevent caching issues
    const timestamp = new Date().getTime();
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheet}!A2:Z?key=${apiKey}&_=${timestamp}`;
    
    console.log(`Fetching ${sheet} data from Google Sheets...`, {
      sheetId: sheetId ? `${sheetId.substring(0, 5)}...` : 'missing',
      hasApiKey: !!apiKey,
      url: url.replace(apiKey, '***')
    });

    // Use explicit no-cors mode to address potential CORS issues
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-cache', // Prevent caching
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Failed to fetch ${sheet}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        url: url.replace(apiKey, '***')
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
    
    // Make sure we only process valid rows
    const validRows = rows.filter(row => Array.isArray(row) && row.length > 0);
    console.log(`Valid rows to process: ${validRows.length}`);
    
    const mappedData = validRows.map(mapper);
    console.log(`Processed ${mappedData.length} items from ${sheet}`);
    console.log(`First item sample:`, mappedData.length > 0 ? mappedData[0] : 'No items');
    
    return mappedData;
  } catch (error) {
    console.error(`Error fetching ${sheet}:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return fallback; // Return fallback data instead of re-throwing
  }
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    console.log('Fetching projects from Google Sheets...');
    
    // Get the configured environment variables
    const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    
    console.log('Environment variables:', { 
      hasSheetId: !!sheetId, 
      hasApiKey: !!apiKey,
      sheetIdLength: sheetId ? sheetId.length : 0
    });
    
    // If no sheet ID or API key, use fallback
    if (!sheetId || !apiKey) {
      console.warn('Missing Google Sheets credentials, using fallback data');
      return fallbackProjects;
    }
    
    // Check if Google Sheets API is accessible first
    const isApiAccessible = await testGoogleSheetsAccess().catch(() => false);
    if (!isApiAccessible) {
      console.warn('Google Sheets API is not accessible, using fallback data');
      return fallbackProjects;
    }
    
    const projects = await fetchFromSheet<Project>(
      'Projects',
      (row) => {
        console.log('Processing row:', row);
        // Make sure we have at least the required fields before processing
        if (!row[0] || !row[1] || !row[2]) {
          console.warn('Row missing required fields, skipping:', row);
          return null;
        }
        
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
    ).then(results => results.filter(Boolean) as Project[]);  // Filter out any null results
    
    console.log('Projects fetched:', projects);
    
    // If no valid projects were found, use fallback
    if (!projects || projects.length === 0) {
      console.warn('No valid projects found, using fallback data');
      return fallbackProjects;
    }
    
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Always return fallback projects on error
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

export async function testGoogleSheetsAccess(): Promise<boolean> {
  try {
    const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    
    console.log('Testing Google Sheets access with credentials:', {
      sheetId: sheetId ? `${sheetId.substring(0, 5)}...` : 'missing',
      apiKey: apiKey ? 'provided' : 'missing'
    });

    if (!sheetId || !apiKey) {
      console.error('Missing Google Sheets credentials');
      return false;
    }

    // Add a timestamp parameter to prevent caching
    const timestamp = new Date().getTime();
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Projects!A2:Z?key=${apiKey}&_=${timestamp}`;
    console.log('Testing Google Sheets access URL:', url.replace(apiKey, '***'));

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Add cache busting parameter to prevent cached responses
      cache: 'no-cache',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return false;
    }

    const data = await response.json();
    const hasValues = data && data.values && Array.isArray(data.values) && data.values.length > 0;
    console.log('Google Sheets API response:', {
      hasData: !!data,
      hasValues,
      rowCount: hasValues ? data.values.length : 0,
      firstRowSample: hasValues ? data.values[0].slice(0, 3) : null
    });
    
    return hasValues;
  } catch (error) {
    console.error('Error testing Google Sheets access:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return false;
  }
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