import Dexie from 'dexie';

export const db = new Dexie('CareerVault_DB');

db.version(1).stores({
    users: '++id, email, role', // role: APPLIER, HR, ADMIN
    profiles: '++id, userId, email',
    jobs: '++id, title, hrId, company',
    applications: '++id, jobId, applierId, status',
    recommendations: '++id, applierId, jobId',
    courses: '++id, title, category',
    learningPaths: '++id, targetRole',
    assessments: '++id, title, role',
    assessmentResults: '++id, userId, testId, date',
    tickets: '++id, userId, status, category, priority',
    notifications: '++id, userId, read',
    vaultAssets: '++id, userId, name, url, type, date' // Added for the new Vault feature
});

// Initial data seed
export const seedDatabase = async () => {
    const userCount = await db.users.count();
    if (userCount === 0) {
        await db.users.bulkAdd([
            { email: 'admin@careervault.com', password: 'admin', role: 'ADMIN', name: 'System Admin' },
            { email: 'hr@google.com', password: 'hr', role: 'HR', name: 'Jane Recruiter', company: 'Google' },
            { email: 'hr@meta.com', password: 'hr', role: 'HR', name: 'Mark Hiring', company: 'Meta' },
            { email: 'applier@user.com', password: 'user', role: 'APPLIER', name: 'John Doe' },
            { email: 'sarah@user.com', password: 'user', role: 'APPLIER', name: 'Sarah Chen' },
        ]);

        await db.jobs.bulkAdd([
            { title: 'Frontend Developer', company: 'Google', hrId: 2, location: 'Remote', salary: '$120k', type: 'Full-Time', skills: ['React', 'CSS', 'JavaScript', 'TypeScript'], description: 'Build modern user interfaces using React, TypeScript, and design systems.' },
            { title: 'Backend Engineer', company: 'Google', hrId: 2, location: 'London', salary: '$140k', type: 'Full-Time', skills: ['Node.js', 'PostgreSQL', 'AWS', 'Docker'], description: 'Design and build scalable backend services and APIs.' },
            { title: 'Full Stack Developer', company: 'Meta', hrId: 3, location: 'Remote', salary: '$130k', type: 'Full-Time', skills: ['React', 'Node.js', 'GraphQL', 'MongoDB'], description: 'Develop end-to-end features for social products.' },
            { title: 'Data Scientist', company: 'Meta', hrId: 3, location: 'Menlo Park, CA', salary: '$160k', type: 'Full-Time', skills: ['Python', 'SQL', 'Machine Learning', 'TensorFlow'], description: 'Analyze large datasets and build ML models for recommendations.' },
            { title: 'DevOps Engineer', company: 'Google', hrId: 2, location: 'Bangalore', salary: '$110k', type: 'Full-Time', skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'], description: 'Automate infrastructure and deployment pipelines.' },
            { title: 'Mobile Developer', company: 'Meta', hrId: 3, location: 'New York', salary: '$125k', type: 'Full-Time', skills: ['React Native', 'JavaScript', 'iOS', 'Android'], description: 'Build cross-platform mobile applications for billions of users.' },
            { title: 'UI/UX Designer', company: 'Google', hrId: 2, location: 'Remote', salary: '$115k', type: 'Contract', skills: ['Figma', 'CSS', 'Design Systems', 'Prototyping'], description: 'Create intuitive and beautiful user experiences.' },
            { title: 'Cloud Architect', company: 'Meta', hrId: 3, location: 'Seattle', salary: '$180k', type: 'Full-Time', skills: ['AWS', 'Azure', 'Terraform', 'Microservices'], description: 'Design and implement cloud infrastructure for enterprise-scale systems.' },
        ]);

        await db.courses.bulkAdd([
            { title: 'Mastering React 18', category: 'Frontend', duration: '12 weeks', provider: 'Career Vault Academy', level: 'Intermediate', skills: ['React', 'JavaScript'], description: 'Deep dive into React 18 with hooks, suspense, and concurrent features.' },
            { title: 'Advanced Node.js Patterns', category: 'Backend', duration: '8 weeks', provider: 'Career Vault Academy', level: 'Advanced', skills: ['Node.js', 'Express'], description: 'Master event loops, streams, clustering, and microservice patterns.' },
            { title: 'Python for Data Science', category: 'Data', duration: '10 weeks', provider: 'Career Vault Academy', level: 'Beginner', skills: ['Python', 'Pandas', 'NumPy'], description: 'Learn Python fundamentals for data analysis and visualization.' },
            { title: 'AWS Cloud Practitioner', category: 'Cloud', duration: '6 weeks', provider: 'Career Vault Academy', level: 'Beginner', skills: ['AWS', 'Cloud Computing'], description: 'Get started with AWS services, billing, and security fundamentals.' },
            { title: 'Docker & Kubernetes Bootcamp', category: 'DevOps', duration: '8 weeks', provider: 'Career Vault Academy', level: 'Intermediate', skills: ['Docker', 'Kubernetes', 'CI/CD'], description: 'Containerize apps and orchestrate deployments with K8s.' },
            { title: 'TypeScript Masterclass', category: 'Frontend', duration: '6 weeks', provider: 'Career Vault Academy', level: 'Intermediate', skills: ['TypeScript', 'JavaScript'], description: 'Type-safe development with generics, decorators, and patterns.' },
            { title: 'Machine Learning A-Z', category: 'Data', duration: '14 weeks', provider: 'Career Vault Academy', level: 'Advanced', skills: ['Python', 'TensorFlow', 'Machine Learning'], description: 'Build ML models from regression to deep learning.' },
            { title: 'GraphQL API Design', category: 'Backend', duration: '5 weeks', provider: 'Career Vault Academy', level: 'Intermediate', skills: ['GraphQL', 'Node.js', 'Apollo'], description: 'Design type-safe APIs with GraphQL schemas and resolvers.' },
            { title: 'React Native Mobile Dev', category: 'Mobile', duration: '10 weeks', provider: 'Career Vault Academy', level: 'Intermediate', skills: ['React Native', 'JavaScript', 'iOS', 'Android'], description: 'Build production mobile apps for iOS and Android.' },
            { title: 'System Design Interview Prep', category: 'Career', duration: '4 weeks', provider: 'Career Vault Academy', level: 'Advanced', skills: ['System Design', 'Architecture', 'Scalability'], description: 'Prepare for FAANG-level system design interviews.' },
        ]);

        await db.assessments.bulkAdd([
            { title: 'JavaScript Fundamentals', role: 'Frontend Developer', difficulty: 'Intermediate', questions: 25, duration: '45 min' },
            { title: 'React Component Patterns', role: 'Frontend Developer', difficulty: 'Advanced', questions: 20, duration: '60 min' },
            { title: 'SQL Query Mastery', role: 'Data Engineer', difficulty: 'Advanced', questions: 30, duration: '90 min' },
            { title: 'System Design Basics', role: 'Software Architect', difficulty: 'Advanced', questions: 10, duration: '120 min' },
        ]);
    }
};
