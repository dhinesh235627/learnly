export type Lecture = {
  id: string
  title: string
  minutes: number
  videoUrl?: string
}

export type Section = {
  title: string
  lectures: Lecture[]
}

export type Course = {
  id: string
  title: string
  instructor: string
  price: number
  originalPrice: number
  level: "Beginner" | "Intermediate" | "All Levels"
  category: string
  bestseller?: boolean
  color: string
  description: string
  whatYouLearn: string[]
  curriculum: Section[]
}

export const categories = ["Microsoft Azure", "AWS", "Google Cloud", "SAP"]

export const courses: Course[] = [
  {
    id: "microsoft-azure-fundamentals",
    title: "Microsoft Learn: Azure Fundamentals (AZ-900) Complete Guide",
    instructor: "Rehan Chowdhury",
    price: 549,
    originalPrice: 3299,
    level: "Beginner",
    category: "Microsoft Azure",
    bestseller: true,
    color: "#0078D4",
    description:
      "A practitioner-taught walkthrough of core Azure services, pricing, and governance — mapped directly to the AZ-900 exam guide.",
    whatYouLearn: [
      "Explain core Azure architectural components",
      "Describe Azure compute, networking, and storage services",
      "Understand Azure pricing, SLAs, and lifecycles",
      "Apply governance, privacy, and compliance features",
    ],
    curriculum: [
      {
        title: "Cloud Concepts",
        lectures: [
          { id: "az-cloud-models", title: "Public, Private & Hybrid Cloud Models", minutes: 11 },
          { id: "az-capex-opex", title: "CapEx vs. OpEx and the Azure Pricing Model", minutes: 9 },
          { id: "az-scalability", title: "High Availability, Scalability & Elasticity", minutes: 10 },
        ],
      },
      {
        title: "Azure Architecture & Services",
        lectures: [
          { id: "az-regions", title: "Regions, Region Pairs & Availability Zones", minutes: 12 },
          { id: "az-resource-manager", title: "Azure Resource Manager & Resource Groups", minutes: 14 },
          { id: "az-compute", title: "Compute Options: VMs, Containers & Functions", minutes: 16 },
          { id: "az-storage", title: "Storage Accounts & Data Redundancy", minutes: 13 },
        ],
      },
      {
        title: "Azure Management & Governance",
        lectures: [
          { id: "az-cost-mgmt", title: "Azure Cost Management & Budgets", minutes: 10 },
          { id: "az-policy", title: "Azure Policy & Resource Locks", minutes: 9 },
          { id: "az-rbac", title: "Role-Based Access Control (RBAC)", minutes: 11 },
        ],
      },
      {
        title: "AZ-900 Practice Exam",
        lectures: [
          { id: "az-practice-exam", title: "Practice Exam Walkthrough", minutes: 24 },
        ],
      },
    ],
  },
  {
    id: "aws-solutions-architect",
    title: "AWS Certified Solutions Architect — Associate 2026",
    instructor: "Marcus Webb",
    price: 599,
    originalPrice: 3499,
    level: "Intermediate",
    category: "AWS",
    bestseller: true,
    color: "#FF9900",
    description:
      "Hands-on labs across EC2, VPC, S3, and IAM to prepare you for the SAA-C03 exam and real-world architecture reviews.",
    whatYouLearn: [
      "Design highly available, cost-optimized AWS architectures",
      "Configure VPCs, subnets, and security groups",
      "Choose the right storage and database service for a workload",
      "Apply the AWS Well-Architected Framework",
    ],
    curriculum: [
      {
        title: "IAM & Account Security",
        lectures: [
          { id: "aws-shared-responsibility", title: "Understanding the Shared Responsibility Model", minutes: 9 },
          { id: "aws-iam-policies", title: "IAM Users, Groups & Policies", minutes: 14 },
          { id: "aws-mfa", title: "Multi-Factor Authentication & Root Account Security", minutes: 11 },
        ],
      },
      {
        title: "Compute & Networking (EC2, VPC)",
        lectures: [
          { id: "aws-ec2-types", title: "EC2 Instance Types & Pricing Models", minutes: 12 },
          {
            id: "aws-vpc-architecture",
            title: "Designing Resilient VPC Architectures",
            minutes: 22,
            videoUrl: "/videos/aws.mp4",
          },
          { id: "aws-sg-vs-nacl", title: "Security Groups vs. Network ACLs", minutes: 10 },
          { id: "aws-elb-asg", title: "Elastic Load Balancing & Auto Scaling", minutes: 15 },
        ],
      },
      {
        title: "Storage & Databases",
        lectures: [
          { id: "aws-s3-classes", title: "S3 Storage Classes & Lifecycle Rules", minutes: 13 },
          { id: "aws-rds", title: "RDS Multi-AZ vs. Read Replicas", minutes: 14 },
          { id: "aws-storage-choice", title: "Choosing Between EBS, EFS & Instance Store", minutes: 11 },
        ],
      },
      {
        title: "SAA-C03 Practice Exam",
        lectures: [
          { id: "aws-practice-exam", title: "Practice Exam Walkthrough: Scenario Questions", minutes: 25 },
        ],
      },
    ],
  },
  {
    id: "gcp-associate-cloud-engineer",
    title: "Google Cloud Platform: Associate Cloud Engineer Certification",
    instructor: "Mei Lin Tan",
    price: 579,
    originalPrice: 3199,
    level: "Intermediate",
    category: "Google Cloud",
    color: "#4285F4",
    description:
      "Deploy and manage workloads on Google Cloud using the Console, gcloud CLI, and Cloud Shell — aligned to the ACE exam.",
    whatYouLearn: [
      "Set up a GCP project, billing, and IAM roles",
      "Deploy Compute Engine, GKE, and Cloud Run workloads",
      "Configure VPC networking and firewall rules",
      "Monitor and troubleshoot with Cloud Operations",
    ],
    curriculum: [
      {
        title: "GCP Fundamentals & IAM",
        lectures: [
          { id: "gcp-projects-billing", title: "Projects, Billing Accounts & Quotas", minutes: 10 },
          { id: "gcp-iam-roles", title: "IAM Roles & the Principle of Least Privilege", minutes: 12 },
        ],
      },
      {
        title: "Compute & Kubernetes Engine",
        lectures: [
          { id: "gcp-compute-engine", title: "Compute Engine Machine Types & Images", minutes: 13 },
          { id: "gcp-gke", title: "Deploying Your First GKE Cluster", minutes: 18 },
          { id: "gcp-cloud-run", title: "Serverless Containers with Cloud Run", minutes: 11 },
        ],
      },
      {
        title: "Storage, Networking & Security",
        lectures: [
          { id: "gcp-vpc", title: "VPC Networks, Subnets & Firewall Rules", minutes: 14 },
          { id: "gcp-storage-classes", title: "Cloud Storage Classes & Access Control", minutes: 12 },
        ],
      },
      {
        title: "ACE Practice Exam",
        lectures: [
          { id: "gcp-practice-exam", title: "Practice Exam Walkthrough", minutes: 22 },
        ],
      },
    ],
  },
  {
    id: "sap-s4hana-fundamentals",
    title: "SAP S/4HANA: Fundamentals for Business Professionals",
    instructor: "Ingrid Voss",
    price: 649,
    originalPrice: 3699,
    level: "All Levels",
    category: "SAP",
    color: "#0FAAFF",
    description:
      "A business-process view of SAP S/4HANA — finance, procurement, and supply chain — for professionals working alongside SAP teams.",
    whatYouLearn: [
      "Navigate the SAP Fiori launchpad and core modules",
      "Understand S/4HANA finance and procurement processes",
      "Map organizational structures to SAP configuration",
      "Speak confidently with SAP implementation teams",
    ],
    curriculum: [
      {
        title: "S/4HANA Overview & Navigation",
        lectures: [
          { id: "sap-fiori", title: "Navigating the SAP Fiori Launchpad", minutes: 10 },
          { id: "sap-org-structure", title: "Organizational Structures in S/4HANA", minutes: 12 },
        ],
      },
      {
        title: "Finance (FI/CO) Essentials",
        lectures: [
          { id: "sap-fi-basics", title: "General Ledger & Financial Accounting Basics", minutes: 15 },
          { id: "sap-co-basics", title: "Cost Center & Profit Center Accounting", minutes: 13 },
        ],
      },
      {
        title: "Procurement & Supply Chain",
        lectures: [
          { id: "sap-procure-to-pay", title: "The Procure-to-Pay Process", minutes: 14 },
          { id: "sap-mm-basics", title: "Materials Management Fundamentals", minutes: 11 },
        ],
      },
      {
        title: "Case Study & Review",
        lectures: [
          { id: "sap-case-study", title: "End-to-End Case Study Walkthrough", minutes: 20 },
        ],
      },
    ],
  },
]

export function allLectures(course: Course): Lecture[] {
  return course.curriculum.flatMap((s) => s.lectures)
}

export function courseMinutes(course: Course): number {
  return allLectures(course).reduce((sum, l) => sum + l.minutes, 0)
}

export function courseHours(course: Course): number {
  return Math.round((courseMinutes(course) / 60) * 10) / 10
}

export function findLecture(course: Course, lectureId: string) {
  return allLectures(course).find((l) => l.id === lectureId)
}

export function firstPlayableLecture(course: Course): Lecture {
  const flat = allLectures(course)
  return flat.find((l) => l.videoUrl) ?? flat[0]
}

export function adjacentLecture(course: Course, lectureId: string, dir: 1 | -1) {
  const flat = allLectures(course)
  const i = flat.findIndex((l) => l.id === lectureId)
  if (i === -1) return undefined
  return flat[i + dir]
}

/** Progress within a course, derived from which lecture ids are marked complete. */
export function courseProgress(course: Course, completedIds: string[] | Set<string>) {
  const has = (id: string) => (completedIds instanceof Set ? completedIds.has(id) : completedIds.includes(id))
  const lectures = allLectures(course)
  const done = lectures.filter((l) => has(l.id)).length
  return { done, total: lectures.length, percent: lectures.length === 0 ? 0 : Math.round((done / lectures.length) * 100) }
}

/** The first lecture in curriculum order that isn't marked complete yet. */
export function nextIncompleteLecture(course: Course, completedIds: string[] | Set<string>) {
  const has = (id: string) => (completedIds instanceof Set ? completedIds.has(id) : completedIds.includes(id))
  return allLectures(course).find((l) => !has(l.id))
}
