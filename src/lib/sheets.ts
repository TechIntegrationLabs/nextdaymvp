// Constants for environment variables - referenced for clarity
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID?.trim();
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY?.trim();

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
  phone?: string;
  appDetails?: string;
  transcript?: string;
  imageUrl?: string;
}

// Interface for projects
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

// Set up fallback projects for when the Google Sheet isn't available
export const fallbackProjects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered E-commerce Platform',
    description: 'A modern e-commerce solution with AI product recommendations and personalized shopping experiences.',
    technologies: 'React, Node.js, MongoDB, TensorFlow',
    client: 'RetailTech Inc.',
    type: 'Web Application',
    image: 'https://images.unsplash.com/photo-1661956602944-249bcd04b63f?q=80&w=2070&auto=format&fit=crop',
    link: 'https://example.com/ecommerce',
  },
  {
    id: '2',
    title: 'Healthcare Patient Portal',
    description: 'Secure patient portal allowing users to schedule appointments, view medical records, and communicate with healthcare providers.',
    technologies: 'Vue.js, Express, PostgreSQL, Socket.io',
    client: 'MedCare Solutions',
    type: 'Web Application',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop',
    link: 'https://example.com/healthcare',
  },
  {
    id: '3',
    title: 'Smart Home IoT Dashboard',
    description: 'Centralized dashboard for monitoring and controlling smart home devices with analytics and automation rules.',
    technologies: 'React, GraphQL, AWS IoT, MQTT',
    client: 'HomeSmart Technologies',
    type: 'IoT Application',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop',
    link: 'https://example.com/smarthome',
  },
  {
    id: '4',
    title: 'Financial Planning App',
    description: 'Personal finance application with budget tracking, investment portfolio management, and financial goal planning.',
    technologies: 'React Native, Firebase, Plaid API',
    client: 'FinWise',
    type: 'Mobile App',
    image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=2070&auto=format&fit=crop',
    link: 'https://example.com/finance',
  },
  {
    id: '5',
    title: 'Fitness Tracking Platform',
    description: 'Comprehensive fitness tracking solution with workout plans, nutrition tracking, and progress analytics.',
    technologies: 'Flutter, Django, PostgreSQL, TensorFlow',
    client: 'FitLife',
    type: 'Cross-platform App',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
    link: 'https://example.com/fitness',
  },
  {
    id: '6',
    title: 'Educational Learning Platform',
    description: 'Interactive learning management system with course creation, student progress tracking, and virtual classrooms.',
    technologies: 'Angular, Node.js, MongoDB, WebRTC',
    client: 'EduTech Solutions',
    type: 'Web Application',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2074&auto=format&fit=crop',
    link: 'https://example.com/education',
  }
];

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

/**
 * Helper function to retry a promise with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>, 
  maxRetries: number = 3, 
  baseDelay: number = 1000
): Promise<T> {
  let retries = 0;
  let lastError: Error | null = null;
  
  while (retries <= maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      retries++;
      
      if (retries <= maxRetries) {
        const delay = baseDelay * Math.pow(2, retries - 1) + Math.random() * 1000;
        console.log(`Retry ${retries}/${maxRetries} after ${delay.toFixed(0)}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Generic function to fetch data from a Google Sheet
 */
async function fetchFromSheet<T>(
  sheetName: string, 
  mapper: (row: string[]) => T | null, 
  fallback: T[]
): Promise<T[]> {
  try {
    // Get environment variables
    const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID?.trim();
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY?.trim();
    
    // Validate environment variables
    if (!sheetId || !apiKey) {
      console.warn('Missing Google Sheets credentials:', { 
        hasSheetId: !!sheetId, 
        hasApiKey: !!apiKey 
      });
      return fallback;
    }
    
    // Now fetch the actual data with the verified sheet name
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A2:Z?key=${apiKey}`;
    console.log(`Fetching data from sheet "${sheetName}"...`);

    // Use retry mechanism to handle temporary failures
    return await retryWithBackoff(async () => {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store', // Force network request, no caching
      });
  
      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Failed to fetch ${sheetName}:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          url: url.replace(apiKey, '***API_KEY***')
        });
        throw new Error(`Failed to fetch ${sheetName}: ${response.statusText}`);
      }
  
      // Parse response
      const data = await response.json();
      
      // Log response information
      console.log(`Google Sheets API response for ${sheetName}:`, {
        hasValues: !!data.values,
        valuesLength: data.values ? data.values.length : 0
      });
      
      const rows = data.values || [];
  
      // Check if response has data
      if (!rows.length) {
        console.warn(`No data found in ${sheetName} sheet`);
        return fallback;
      }
  
      // Process data
      console.log(`Successfully fetched ${rows.length} rows from ${sheetName}`);
      
      // Filter valid rows and map to data model
      const mappedData = rows
        .filter(row => Array.isArray(row) && row.length > 0)
        .map(row => {
          try {
            return mapper(row);
          } catch (err) {
            console.error(`Error mapping row:`, {
              row,
              error: err instanceof Error ? err.message : 'Unknown error'
            });
            return null;
          }
        })
        .filter(item => item !== null) as T[];
      
      // Log result
      console.log(`Processed ${mappedData.length} items from ${sheetName}`);
      
      // Return fallback if no valid data
      if (mappedData.length === 0) {
        console.warn(`No valid mapped items from ${sheetName}, using fallback`);
        return fallback;
      }
      
      return mappedData;
    }, 3, 1000);
    
  } catch (error) {
    console.error(`Error fetching ${sheetName}:`, {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return fallback; // Return fallback data on error
  }
}

/**
 * Test if Google Sheets API is accessible
 */
export async function testGoogleSheetsAccess(): Promise<boolean> {
  try {
    const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID?.trim();
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY?.trim();
    
    console.log('Testing Google Sheets access with credentials');

    // Validate environment variables
    if (!sheetId || !apiKey) {
      console.error('Missing Google Sheets credentials');
      return false;
    }

    // Test with a simpler API endpoint first - the spreadsheets.get method
    // This is less likely to have permission issues than the values endpoint
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}&fields=spreadsheetId,properties(title)`;
    
    console.log('Testing Google Sheets access...');

    // Send request to get spreadsheet metadata (less data than fetching values)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Force network request, no caching
    });

    // Check response
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: url.replace(apiKey, '***API_KEY***')
      });
      
      // Log more specific error information
      if (response.status === 400) {
        console.error('API Key Error: Your API key may not be configured correctly in Google Cloud Console');
        console.error('Please ensure:');
        console.error('1. The Google Sheets API is enabled for this API key');
        console.error('2. The API key has no domain restrictions or they include your domain');
        console.error('3. The API key is active and not expired');
      }
      
      return false;
    }

    const data = await response.json();
    console.log('Spreadsheet metadata retrieved successfully:', {
      title: data.properties?.title || 'Unknown'
    });
    
    return true;
  } catch (error) {
    console.error('Error testing Google Sheets access:', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return false;
  }
}

/**
 * Fetch projects from Google Sheets
 */
export async function fetchProjects(): Promise<Project[]> {
  try {
    console.log('Fetching projects from Google Sheets...');
    
    // Get environment variables with trimming
    const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID?.trim();
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY?.trim();
    
    // Log environment variables for debugging (without exposing full API key)
    console.log('Environment variables:', { 
      hasSheetId: !!sheetId, 
      hasApiKey: !!apiKey,
      sheetIdLength: sheetId ? sheetId.length : 0,
      apiKeyPrefix: apiKey ? `${apiKey.substring(0, 6)}...` : 'missing'
    });
    
    // Validate environment variables
    if (!sheetId || !apiKey) {
      console.warn('Missing Google Sheets credentials, using fallback data');
      return fallbackProjects;
    }
    
    // Test if API is accessible
    const isApiAccessible = await testGoogleSheetsAccess().catch(() => false);
    if (!isApiAccessible) {
      console.warn('Google Sheets API is not accessible, using fallback data');
      return fallbackProjects;
    }
    
    // Try to get available sheet names first
    try {
      const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}&fields=sheets.properties(title)`;
      
      const metadataResponse = await fetch(metadataUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });
      
      if (metadataResponse.ok) {
        const metadata = await metadataResponse.json();
        if (metadata && metadata.sheets) {
          const availableSheets = metadata.sheets.map((s: any) => s.properties?.title).filter(Boolean);
          console.log('Available sheets in spreadsheet:', availableSheets);
          
          // Try each available sheet first
          for (const sheetName of availableSheets) {
            try {
              console.log(`Trying to fetch projects from available sheet: "${sheetName}"`);
              
              const projects = await fetchFromSheet<Project>(
                sheetName,
                (row) => {
                  // Skip empty rows or rows missing required fields
                  if (!row || row.length < 3 || !row[0] || !row[1] || !row[2]) {
                    return null;
                  }
                  
                  // Format link with proper http/https prefix
                  const rawLink = row[7] || undefined;
                  let formattedLink = rawLink;
                  if (rawLink && !rawLink.startsWith('http://') && !rawLink.startsWith('https://')) {
                    formattedLink = `https://${rawLink}`;
                  }
                  
                  // Create project object
                  return {
                    id: row[0]?.toString() || '',
                    title: row[1]?.toString() || '',
                    description: row[2]?.toString() || '',
                    technologies: row[3]?.toString() || '',
                    client: row[4]?.toString() || undefined,
                    type: row[5]?.toString() || 'Other',
                    image: row[6]?.toString() || '',
                    link: formattedLink,
                  };
                },
                fallbackProjects
              );
              
              // If projects were found, return them
              if (projects.length > 0) {
                console.log(`Successfully fetched ${projects.length} projects from sheet "${sheetName}"`);
                return projects;
              }
              
              console.warn(`No valid projects found in sheet "${sheetName}", trying next option`);
            } catch (error) {
              console.warn(`Error fetching from sheet "${sheetName}":`, error);
              // Continue to try next sheet
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching spreadsheet metadata:', error);
      // Continue with predefined sheet names
    }
    
    // Try multiple sheet names for flexibility
    const sheetNames = ['Projects', 'projects', 'Project', 'project', 'Sheet1', 'Sheet 1', 'Portfolio', 'portfolio'];
    
    for (const sheetName of sheetNames) {
      try {
        console.log(`Trying to fetch projects from sheet named: "${sheetName}"`);
        
        const projects = await fetchFromSheet<Project>(
          sheetName,
          (row) => {
            // Skip empty rows or rows missing required fields
            if (!row || row.length < 3 || !row[0] || !row[1] || !row[2]) {
              return null;
            }
            
            // Format link with proper http/https prefix
            const rawLink = row[7] || undefined;
            let formattedLink = rawLink;
            if (rawLink && !rawLink.startsWith('http://') && !rawLink.startsWith('https://')) {
              formattedLink = `https://${rawLink}`;
            }
            
            // Create project object
            return {
              id: row[0]?.toString() || '',
              title: row[1]?.toString() || '',
              description: row[2]?.toString() || '',
              technologies: row[3]?.toString() || '',
              client: row[4]?.toString() || undefined,
              type: row[5]?.toString() || 'Other',
              image: row[6]?.toString() || '',
              link: formattedLink,
            };
          },
          fallbackProjects
        );
        
        // If projects were found, return them
        if (projects.length > 0) {
          console.log(`Successfully fetched ${projects.length} projects from sheet "${sheetName}"`);
          return projects;
        }
        
        // Otherwise try next sheet name
        console.warn(`No valid projects found in sheet "${sheetName}", trying next option`);
      } catch (error) {
        console.warn(`Error fetching from sheet "${sheetName}":`, error);
        // Continue to try next sheet name
      }
    }
    
    // If all sheet names failed, return fallback
    console.error('All sheet name variations failed, using fallback data');
    return fallbackProjects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return fallbackProjects;
  }
}

/**
 * Fetch blog posts from Google Sheets
 */
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

/**
 * Fetch AI tools from Google Sheets
 */
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

/**
 * Submit contact form data to Google Sheets
 */
export async function submitContactForm(data: ContactFormData): Promise<boolean> {
  try {
    // Validate environment variables
    if (!SHEET_ID || !API_KEY) {
      console.error('Missing required environment variables for Google Sheets');
      return false;
    }

    const timestamp = new Date().toISOString();
    const appendRange = 'Contact!A2:H'; // Extended range for additional fields
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${appendRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${API_KEY}`;
    
    console.log('Submitting contact form data...');

    // Include additional fields if available
    const formValues = [
      data.name, 
      data.email, 
      data.phone || '', 
      data.message,
      data.appDetails || '',
      data.transcript || '',
      data.imageUrl || '',
      timestamp
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: appendRange,
        majorDimension: 'ROWS',
        values: [formValues],
      }),
    });

    // Check response
    if (!response.ok) {
      console.error('Failed to submit form:', {
        status: response.status,
        statusText: response.statusText
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error submitting contact form:', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return false;
  }
}