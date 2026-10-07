import { connectDB, disconnectDB } from '../../backend/src/config/db';
import { Career } from '../../backend/src/models/Career';

export const benchmarkCareers = [
  {
    slug: 'ai-engineer',
    name: 'Artificial Intelligence Engineer',
    category: 'Technology',
    description:
      'Designs, trains, and deploys machine learning models, neural networks, and generative AI systems to solve complex cognitive tasks.',
    riskLevel: 'medium',
    requiredSkills: [
      { skillName: 'Python', category: 'technical', importance: 95, requiredLevel: 85 },
      { skillName: 'Machine Learning', category: 'technical', importance: 90, requiredLevel: 80 },
      { skillName: 'TensorFlow / PyTorch', category: 'technical', importance: 90, requiredLevel: 75 },
      { skillName: 'Mathematics & Statistics', category: 'domain', importance: 85, requiredLevel: 80 },
      { skillName: 'Problem Solving', category: 'soft', importance: 85, requiredLevel: 80 }
    ],
    aptitudeProfile: {
      logical: 90,
      numerical: 85,
      analytical: 92,
      spatial: 75,
      verbal: 70
    },
    interestProfile: [
      { interest: 'Artificial Intelligence', importance: 95 },
      { interest: 'Technology', importance: 90 },
      { interest: 'Data', importance: 85 }
    ],
    educationPathway: {
      minimumDegree: 'B.Tech / B.E.',
      preferredDegrees: ['B.Tech Computer Science / AI', 'M.Tech / MS in AI / Data Science'],
      typicalDurationYears: 4,
      topColleges: ['IIT Bombay', 'IIT Madras', 'IIIT Hyderabad', 'BITS Pilani']
    },
    educationCost: {
      minCost: 400000,
      maxCost: 1800000,
      averageCost: 800000,
      currency: 'INR'
    },
    salaryRange: {
      entryLevel: 800000,
      midLevel: 2000000,
      seniorLevel: 4500000,
      currency: 'INR'
    },
    marketData: {
      demandScore: 94,
      growthScore: 95,
      hiringVelocity: 90,
      stabilityScore: 82,
      futureOutlook: 'Extremely high growth driven by enterprise adoption of LLMs and autonomous systems.'
    },
    locationDemand: [
      { location: 'Bangalore', demandScore: 98, opportunityScore: 96, costIndex: 75 },
      { location: 'Hyderabad', demandScore: 90, opportunityScore: 88, costIndex: 65 },
      { location: 'Pune', demandScore: 85, opportunityScore: 82, costIndex: 60 },
      { location: 'Chennai', demandScore: 82, opportunityScore: 80, costIndex: 60 }
    ],
    exams: [
      { name: 'JEE Advanced', type: 'Undergraduate', difficulty: 'High' },
      { name: 'GATE CSE', type: 'Postgraduate', difficulty: 'High' }
    ],
    scholarships: [
      { name: 'National Scholarship Portal (NSP)', provider: 'Govt of India', maxAmount: 200000, eligibility: 'Merit-cum-Means' },
      { name: 'AICTE Pragati Scholarship', provider: 'AICTE', maxAmount: 150000, eligibility: 'Female STEAM Candidates' }
    ],
    alternativeCareers: ['Data Scientist', 'Robotics Engineer', 'Machine Learning Researcher'],
    interdisciplinaryTags: ['Computational Biology', 'FinTech AI', 'Medical Diagnostics AI']
  },
  {
    slug: 'data-scientist',
    name: 'Data Scientist',
    category: 'Data & Analytics',
    description:
      'Extracts actionable insights from massive multi-modal datasets using statistical modeling, data visualization, and predictive algorithms.',
    riskLevel: 'low',
    requiredSkills: [
      { skillName: 'Python', category: 'technical', importance: 90, requiredLevel: 80 },
      { skillName: 'SQL', category: 'technical', importance: 90, requiredLevel: 85 },
      { skillName: 'Statistics', category: 'domain', importance: 90, requiredLevel: 85 },
      { skillName: 'Data Visualization', category: 'technical', importance: 80, requiredLevel: 75 },
      { skillName: 'Communication', category: 'soft', importance: 85, requiredLevel: 75 }
    ],
    aptitudeProfile: {
      logical: 85,
      numerical: 90,
      analytical: 92,
      spatial: 70,
      verbal: 75
    },
    interestProfile: [
      { interest: 'Data', importance: 95 },
      { interest: 'Analytics', importance: 90 },
      { interest: 'Business Strategy', importance: 80 }
    ],
    educationPathway: {
      minimumDegree: 'B.Sc / B.Tech',
      preferredDegrees: ['B.Tech Computer Science', 'B.Sc Statistics / Mathematics', 'M.Sc Data Science'],
      typicalDurationYears: 4,
      topColleges: ['ISI Kolkata', 'IIT Kharagpur', 'IIT Delhi', 'CMI Chennai']
    },
    educationCost: {
      minCost: 300000,
      maxCost: 1500000,
      averageCost: 700000,
      currency: 'INR'
    },
    salaryRange: {
      entryLevel: 700000,
      midLevel: 1800000,
      seniorLevel: 3800000,
      currency: 'INR'
    },
    marketData: {
      demandScore: 89,
      growthScore: 88,
      hiringVelocity: 85,
      stabilityScore: 88,
      futureOutlook: 'Sustained strong demand across banking, healthcare, retail, and tech.'
    },
    locationDemand: [
      { location: 'Bangalore', demandScore: 95, opportunityScore: 92, costIndex: 75 },
      { location: 'Mumbai', demandScore: 92, opportunityScore: 90, costIndex: 85 },
      { location: 'Delhi NCR', demandScore: 88, opportunityScore: 85, costIndex: 70 },
      { location: 'Hyderabad', demandScore: 86, opportunityScore: 84, costIndex: 65 }
    ],
    exams: [
      { name: 'JAM (Joint Admission Test for M.Sc)', type: 'National', difficulty: 'Medium' }
    ],
    scholarships: [
      { name: 'Reliance Foundation Scholarship', provider: 'Reliance', maxAmount: 400000, eligibility: 'Undergraduate STEAM' }
    ],
    alternativeCareers: ['AI Engineer', 'Quantitative Analyst', 'Business Intelligence Lead'],
    interdisciplinaryTags: ['Health Informatics', 'Algorithmic Trading']
  },
  {
    slug: 'cybersecurity-analyst',
    name: 'Cybersecurity Analyst',
    category: 'Technology',
    description:
      'Protects critical network infrastructure, cloud environments, and sensitive organizational data against adversarial threats and intrusion.',
    riskLevel: 'low',
    requiredSkills: [
      { skillName: 'Network Security', category: 'technical', importance: 92, requiredLevel: 85 },
      { skillName: 'Linux & Scripting', category: 'technical', importance: 85, requiredLevel: 75 },
      { skillName: 'Ethical Hacking', category: 'technical', importance: 88, requiredLevel: 80 },
      { skillName: 'Risk Assessment', category: 'domain', importance: 80, requiredLevel: 75 },
      { skillName: 'Attention to Detail', category: 'soft', importance: 90, requiredLevel: 85 }
    ],
    aptitudeProfile: {
      logical: 88,
      numerical: 75,
      analytical: 90,
      spatial: 80,
      verbal: 72
    },
    interestProfile: [
      { interest: 'Cybersecurity', importance: 95 },
      { interest: 'Computer Networks', importance: 88 },
      { interest: 'Investigation', importance: 85 }
    ],
    educationPathway: {
      minimumDegree: 'B.Tech / B.Sc IT',
      preferredDegrees: ['B.Tech Information Security / CSE', 'BCA / MCA Cybersecurity'],
      typicalDurationYears: 4,
      topColleges: ['NFSU Gandhinagar', 'IIT Kanpur', 'Amrita Vishwa Vidyapeetham']
    },
    educationCost: {
      minCost: 350000,
      maxCost: 1400000,
      averageCost: 650000,
      currency: 'INR'
    },
    salaryRange: {
      entryLevel: 650000,
      midLevel: 1600000,
      seniorLevel: 3500000,
      currency: 'INR'
    },
    marketData: {
      demandScore: 92,
      growthScore: 91,
      hiringVelocity: 88,
      stabilityScore: 94,
      futureOutlook: 'Extremely resilient demand due to rising cyber regulations and nation-state cyber threats.'
    },
    locationDemand: [
      { location: 'Bangalore', demandScore: 92, opportunityScore: 90, costIndex: 75 },
      { location: 'Delhi NCR', demandScore: 90, opportunityScore: 88, costIndex: 70 },
      { location: 'Hyderabad', demandScore: 88, opportunityScore: 85, costIndex: 65 },
      { location: 'Chennai', demandScore: 84, opportunityScore: 82, costIndex: 60 }
    ],
    exams: [
      { name: 'CEH (Certified Ethical Hacker)', type: 'Certification', difficulty: 'Medium' },
      { name: 'CompTIA Security+', type: 'Certification', difficulty: 'Medium' }
    ],
    scholarships: [
      { name: 'Cyber Defense Scholarship', provider: 'Industry Forum', maxAmount: 150000, eligibility: 'Cybersecurity Degree' }
    ],
    alternativeCareers: ['Cloud Security Architect', 'Information Security Officer', 'Forensic Investigator'],
    interdisciplinaryTags: ['FinTech Security', 'IoT Defense']
  },
  {
    slug: 'robotics-engineer',
    name: 'Robotics & Autonomous Systems Engineer',
    category: 'Engineering',
    description:
      'Integrates mechanical engineering, micro-electronics, embedded firmware, and computer vision to build automated robots and physical AI.',
    riskLevel: 'medium',
    requiredSkills: [
      { skillName: 'Embedded C / C++', category: 'technical', importance: 90, requiredLevel: 80 },
      { skillName: 'ROS (Robot Operating System)', category: 'technical', importance: 88, requiredLevel: 75 },
      { skillName: 'Computer Vision', category: 'technical', importance: 85, requiredLevel: 75 },
      { skillName: 'Kinematics & Dynamics', category: 'domain', importance: 85, requiredLevel: 80 },
      { skillName: 'Creative Design', category: 'soft', importance: 80, requiredLevel: 75 }
    ],
    aptitudeProfile: {
      logical: 88,
      numerical: 85,
      analytical: 86,
      spatial: 92,
      verbal: 68
    },
    interestProfile: [
      { interest: 'Robotics', importance: 95 },
      { interest: 'Hardware', importance: 88 },
      { interest: 'Automation', importance: 90 }
    ],
    educationPathway: {
      minimumDegree: 'B.Tech Mechanical / Mechatronics / ECE',
      preferredDegrees: ['B.Tech Mechatronics', 'B.Tech Electrical & Electronics', 'M.Tech Robotics'],
      typicalDurationYears: 4,
      topColleges: ['IIT Madras', 'IIT Delhi', 'PSG Tech Coimbatore', 'MIT Manipal']
    },
    educationCost: {
      minCost: 450000,
      maxCost: 1600000,
      averageCost: 750000,
      currency: 'INR'
    },
    salaryRange: {
      entryLevel: 600000,
      midLevel: 1700000,
      seniorLevel: 3600000,
      currency: 'INR'
    },
    marketData: {
      demandScore: 84,
      growthScore: 89,
      hiringVelocity: 78,
      stabilityScore: 80,
      futureOutlook: 'Rapid acceleration in warehouse automation, surgical robotics, and electric vehicles.'
    },
    locationDemand: [
      { location: 'Bangalore', demandScore: 90, opportunityScore: 88, costIndex: 75 },
      { location: 'Pune', demandScore: 88, opportunityScore: 86, costIndex: 60 },
      { location: 'Chennai', demandScore: 86, opportunityScore: 85, costIndex: 60 }
    ],
    exams: [
      { name: 'GATE Mechanical / ECE', type: 'Postgraduate', difficulty: 'High' }
    ],
    scholarships: [
      { name: 'KVPY / INSPIRE Fellowship', provider: 'DST', maxAmount: 300000, eligibility: 'STEAM Research' }
    ],
    alternativeCareers: ['AI Engineer', 'Automation Architect', 'Embedded Systems Developer'],
    interdisciplinaryTags: ['Surgical Robotics', 'Agricultural Drone Tech']
  },
  {
    slug: 'bioinformatics-specialist',
    name: 'Bioinformatics & Computational Biologist',
    category: 'Healthcare & Life Sciences',
    description:
      'Applies high-performance computing, genomics pipelines, and machine learning to analyze molecular biological sequences and discover therapies.',
    riskLevel: 'medium',
    requiredSkills: [
      { skillName: 'Python / R', category: 'technical', importance: 90, requiredLevel: 80 },
      { skillName: 'Molecular Biology', category: 'domain', importance: 85, requiredLevel: 80 },
      { skillName: 'Genomic Data Analysis', category: 'technical', importance: 88, requiredLevel: 75 },
      { skillName: 'Statistical Genomics', category: 'domain', importance: 82, requiredLevel: 75 },
      { skillName: 'Scientific Rigor', category: 'soft', importance: 85, requiredLevel: 85 }
    ],
    aptitudeProfile: {
      logical: 86,
      numerical: 84,
      analytical: 91,
      spatial: 78,
      verbal: 75
    },
    interestProfile: [
      { interest: 'Biology', importance: 90 },
      { interest: 'Technology', importance: 88 },
      { interest: 'Healthcare', importance: 92 }
    ],
    educationPathway: {
      minimumDegree: 'B.Tech / B.Sc Bioinformatics',
      preferredDegrees: ['B.Tech Bioinformatics', 'M.Sc Computational Biology', 'Ph.D. Genomics'],
      typicalDurationYears: 4,
      topColleges: ['IBAB Bangalore', 'IIT Kharagpur', 'JNU Delhi', 'Anna University']
    },
    educationCost: {
      minCost: 300000,
      maxCost: 1200000,
      averageCost: 550000,
      currency: 'INR'
    },
    salaryRange: {
      entryLevel: 550000,
      midLevel: 1500000,
      seniorLevel: 3200000,
      currency: 'INR'
    },
    marketData: {
      demandScore: 82,
      growthScore: 92,
      hiringVelocity: 76,
      stabilityScore: 86,
      futureOutlook: 'Surging demand in personalized oncology, synthetic biology, and pharmaceutical design.'
    },
    locationDemand: [
      { location: 'Bangalore', demandScore: 92, opportunityScore: 90, costIndex: 75 },
      { location: 'Hyderabad', demandScore: 90, opportunityScore: 88, costIndex: 65 },
      { location: 'Pune', demandScore: 80, opportunityScore: 78, costIndex: 60 }
    ],
    exams: [
      { name: 'CSIR UGC NET (JRF)', type: 'National', difficulty: 'High' }
    ],
    scholarships: [
      { name: 'DBT Junior Research Fellowship', provider: 'DBT India', maxAmount: 370000, eligibility: 'Biotechnology / Bioinformatics' }
    ],
    alternativeCareers: ['Medical AI Researcher', 'Data Scientist', 'Clinical Data Manager'],
    interdisciplinaryTags: ['Personalized Medicine', 'Genomics AI']
  },
  {
    slug: 'full-stack-developer',
    name: 'Full Stack Software Engineer',
    category: 'Technology',
    description:
      'Builds scalable end-to-end web architectures, combining modern client interfaces, cloud REST APIs, and database persistence layers.',
    riskLevel: 'low',
    requiredSkills: [
      { skillName: 'JavaScript / TypeScript', category: 'technical', importance: 95, requiredLevel: 85 },
      { skillName: 'React / Next.js', category: 'technical', importance: 90, requiredLevel: 80 },
      { skillName: 'Node.js / Express', category: 'technical', importance: 90, requiredLevel: 80 },
      { skillName: 'SQL / NoSQL Databases', category: 'technical', importance: 85, requiredLevel: 75 },
      { skillName: 'System Architecture', category: 'domain', importance: 80, requiredLevel: 75 }
    ],
    aptitudeProfile: {
      logical: 88,
      numerical: 78,
      analytical: 85,
      spatial: 80,
      verbal: 76
    },
    interestProfile: [
      { interest: 'Software', importance: 95 },
      { interest: 'Web Development', importance: 92 },
      { interest: 'Building Products', importance: 90 }
    ],
    educationPathway: {
      minimumDegree: 'B.Tech / BCA / B.Sc',
      preferredDegrees: ['B.Tech Computer Science / IT', 'MCA', 'BCA'],
      typicalDurationYears: 3,
      topColleges: ['IITs / NITs', 'Vellore Institute of Technology', 'SRM University']
    },
    educationCost: {
      minCost: 250000,
      maxCost: 1400000,
      averageCost: 600000,
      currency: 'INR'
    },
    salaryRange: {
      entryLevel: 600000,
      midLevel: 1600000,
      seniorLevel: 3600000,
      currency: 'INR'
    },
    marketData: {
      demandScore: 95,
      growthScore: 89,
      hiringVelocity: 94,
      stabilityScore: 90,
      futureOutlook: 'Consistently high volume demand across startups, scale-ups, and multinational corporations.'
    },
    locationDemand: [
      { location: 'Bangalore', demandScore: 98, opportunityScore: 96, costIndex: 75 },
      { location: 'Pune', demandScore: 92, opportunityScore: 90, costIndex: 60 },
      { location: 'Hyderabad', demandScore: 91, opportunityScore: 89, costIndex: 65 },
      { location: 'Chennai', demandScore: 88, opportunityScore: 86, costIndex: 60 }
    ],
    exams: [
      { name: 'JEE Main', type: 'National', difficulty: 'Medium' }
    ],
    scholarships: [
      { name: 'State Post-Matric Scholarship', provider: 'State Govt', maxAmount: 100000, eligibility: 'Engineering Students' }
    ],
    alternativeCareers: ['Cloud Architect', 'DevOps Engineer', 'Technical Product Manager'],
    interdisciplinaryTags: ['SaaS Engineering', 'FinTech Applications']
  },
  {
    slug: 'ui-ux-designer',
    name: 'Product & UI/UX Designer',
    category: 'Design & Product',
    description:
      'Creates intuitive, empathetic, and visually stunning digital product experiences through user research, wireframing, and interaction design.',
    riskLevel: 'low',
    requiredSkills: [
      { skillName: 'Figma & Prototyping', category: 'technical', importance: 95, requiredLevel: 85 },
      { skillName: 'User Research', category: 'domain', importance: 88, requiredLevel: 80 },
      { skillName: 'Visual Design & Typography', category: 'technical', importance: 90, requiredLevel: 85 },
      { skillName: 'Empathy & Communication', category: 'soft', importance: 92, requiredLevel: 90 }
    ],
    aptitudeProfile: {
      logical: 76,
      numerical: 65,
      analytical: 84,
      spatial: 94,
      verbal: 86
    },
    interestProfile: [
      { interest: 'Design', importance: 95 },
      { interest: 'Creativity', importance: 95 },
      { interest: 'Human Psychology', importance: 88 }
    ],
    educationPathway: {
      minimumDegree: 'B.Des / B.Sc / Any Degree',
      preferredDegrees: ['B.Des Product Design', 'B.Sc Visual Communication'],
      typicalDurationYears: 4,
      topColleges: ['NID Ahmedabad', 'IDC IIT Bombay', 'Srishti Bangalore']
    },
    educationCost: {
      minCost: 300000,
      maxCost: 1500000,
      averageCost: 650000,
      currency: 'INR'
    },
    salaryRange: {
      entryLevel: 550000,
      midLevel: 1500000,
      seniorLevel: 3200000,
      currency: 'INR'
    },
    marketData: {
      demandScore: 88,
      growthScore: 87,
      hiringVelocity: 84,
      stabilityScore: 85,
      futureOutlook: 'Strong demand as consumer and enterprise applications differentiate heavily on user experience.'
    },
    locationDemand: [
      { location: 'Bangalore', demandScore: 95, opportunityScore: 92, costIndex: 75 },
      { location: 'Mumbai', demandScore: 90, opportunityScore: 88, costIndex: 85 },
      { location: 'Delhi NCR', demandScore: 86, opportunityScore: 84, costIndex: 70 }
    ],
    exams: [
      { name: 'UCEED', type: 'National Design', difficulty: 'Medium' },
      { name: 'NID DAT', type: 'Design Aptitude', difficulty: 'High' }
    ],
    scholarships: [
      { name: 'Design Innovation Fellowship', provider: 'Design Council', maxAmount: 200000, eligibility: 'Creative Portfolios' }
    ],
    alternativeCareers: ['Design Systems Architect', 'Creative Director', 'Product Manager'],
    interdisciplinaryTags: ['Human-AI Interaction', 'Spatial UX (AR/VR)']
  },
  {
    slug: 'renewable-energy-engineer',
    name: 'Renewable Energy & Sustainability Engineer',
    category: 'Engineering & Environment',
    description:
      'Designs clean energy systems, solar microgrids, battery energy storage systems (BESS), and decarbonization infrastructure.',
    riskLevel: 'low',
    requiredSkills: [
      { skillName: 'Electrical Power Systems', category: 'technical', importance: 90, requiredLevel: 80 },
      { skillName: 'Energy Modeling', category: 'technical', importance: 85, requiredLevel: 75 },
      { skillName: 'Environmental Regulation', category: 'domain', importance: 80, requiredLevel: 75 },
      { skillName: 'Project Management', category: 'soft', importance: 85, requiredLevel: 80 }
    ],
    aptitudeProfile: {
      logical: 85,
      numerical: 84,
      analytical: 86,
      spatial: 82,
      verbal: 72
    },
    interestProfile: [
      { interest: 'Renewable Energy', importance: 95 },
      { interest: 'Environment', importance: 90 },
      { interest: 'Engineering', importance: 88 }
    ],
    educationPathway: {
      minimumDegree: 'B.Tech Electrical / Energy Engineering',
      preferredDegrees: ['B.Tech Electrical Engineering', 'M.Tech Renewable Energy'],
      typicalDurationYears: 4,
      topColleges: ['IIT Roorkee', 'TERI School of Advanced Studies', 'NIT Trichy']
    },
    educationCost: {
      minCost: 350000,
      maxCost: 1200000,
      averageCost: 600000,
      currency: 'INR'
    },
    salaryRange: {
      entryLevel: 550000,
      midLevel: 1400000,
      seniorLevel: 2800000,
      currency: 'INR'
    },
    marketData: {
      demandScore: 86,
      growthScore: 94,
      hiringVelocity: 82,
      stabilityScore: 92,
      futureOutlook: 'Massive government green hydrogen missions and EV infrastructure investments.'
    },
    locationDemand: [
      { location: 'Gujarat', demandScore: 92, opportunityScore: 90, costIndex: 55 },
      { location: 'Rajasthan', demandScore: 90, opportunityScore: 88, costIndex: 50 },
      { location: 'Bangalore', demandScore: 85, opportunityScore: 82, costIndex: 75 },
      { location: 'Tamil Nadu', demandScore: 88, opportunityScore: 86, costIndex: 58 }
    ],
    exams: [
      { name: 'GATE Electrical', type: 'National', difficulty: 'High' }
    ],
    scholarships: [
      { name: 'Ministry of New & Renewable Energy (MNRE) Fellowship', provider: 'Govt of India', maxAmount: 350000, eligibility: 'Renewable Energy R&D' }
    ],
    alternativeCareers: ['Power Grid Analyst', 'ESG Strategy Consultant', 'EV Powertrain Engineer'],
    interdisciplinaryTags: ['CleanTech Systems', 'Smart Grid AI']
  }
];

export async function seedCareers() {
  console.log('[Seed] Connecting to MongoDB Atlas...');
  await connectDB();

  console.log(`[Seed] Seeding ${benchmarkCareers.length} benchmark careers...`);

  for (const careerData of benchmarkCareers) {
    await Career.findOneAndUpdate({ slug: careerData.slug }, careerData, {
      upsert: true,
      new: true
    });
    console.log(`  ✓ Seeded career: ${careerData.name} (${careerData.slug})`);
  }

  console.log('[Seed] All careers seeded successfully!');
  await disconnectDB();
}

if (require.main === module) {
  seedCareers().catch((err) => {
    console.error('[Seed] Error seeding careers:', err);
    process.exit(1);
  });
}
