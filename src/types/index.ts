export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  results: {
    metric: string;
    value: string;
  }[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}