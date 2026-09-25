export type Lecture = {
  id: string
  title: string
  minutes: number
  hasVideo?: boolean
  /** Language codes with a selectable dubbed audio track + subtitles (e.g. ["en","hi"]). The video itself has no embedded audio. */
  audioLanguages?: string[]
  /** Has a real transcript, so the in-lecture "Ask a doubt" assistant can ground answers in it. */
  hasTranscript?: boolean
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
  logo: string
  rating: number
  ratingCount: number
  description: string
  about: string[]
  requirements: string[]
  instructorBio: string
  whatYouLearn: string[]
  curriculum: Section[]
  announcements?: { date: string; text: string }[]
}

export const categories = ["Microsoft Azure", "AWS", "Google Cloud", "SAP"]

export const courses: Course[] = [
  {
    id: "microsoft-azure-basics",
    title: "Microsoft Azure Basics",
    instructor: "Vishwaanth",
    price: 549,
    originalPrice: 3299,
    level: "Beginner",
    category: "Microsoft Azure",
    bestseller: true,
    color: "#0078D4",
    logo: "/logos/azure.png",
    rating: 4.8,
    ratingCount: 2145,
    description:
      "A hands-on walkthrough of building a no-code AI agent in Microsoft Foundry — from creating a project to testing your agent live in the playground.",
    about: [
      "A hands-on walkthrough of Microsoft Foundry's no-code agent builder: creating a project, building an agent, writing its instructions, and testing it live in the playground.",
      "This course is being rebuilt from scratch — more lectures covering Azure fundamentals, resource groups, networking, and storage are on the way.",
    ],
    requirements: [
      "An active or free-tier Azure subscription (the free account covers everything used in this course)",
      "No prior Azure or AI Foundry knowledge assumed",
    ],
    instructorBio:
      "Vishwaanth builds and ships this course's platform end to end, and teaches Azure the way he actually uses it day to day — resource groups, networking, and automation via the CLI.",
    whatYouLearn: [
      "Create a Microsoft Foundry project and provision its resources",
      "Build a no-code AI agent and write its instructions",
      "Test an agent live in the Foundry playground",
    ],
    curriculum: [
      {
        title: "Getting Started",
        lectures: [
          {
            id: "azb-01-intro",
            title: "Build an AI Agent with Microsoft Foundry (No Code)",
            minutes: 3,
            hasVideo: true,
            audioLanguages: ["en", "hi", "es", "ar"],
            hasTranscript: true,
          },
        ],
      },
    ],
  },
  {
    id: "aws-solutions-architect",
    title: "AWS for Spring Boot Developers: EC2, S3, RDS, DynamoDB & Beanstalk",
    instructor: "Marcus Webb",
    price: 599,
    originalPrice: 3499,
    level: "Intermediate",
    category: "AWS",
    bestseller: true,
    color: "#FF9900",
    logo: "/logos/aws.png",
    rating: 4.7,
    ratingCount: 1832,
    description:
      "A hands-on, project-based walkthrough of deploying real Spring Boot and Angular applications on AWS — EC2, S3, RDS, DynamoDB, Elastic Beanstalk, Secrets Manager, and SQS.",
    about: [
      "A project-based walkthrough of deploying real Spring Boot and Angular applications on AWS — not exam-prep slides, actual console work and command-line deployments.",
      "You'll launch EC2 instances, deploy to Elastic Beanstalk, connect applications to RDS and DynamoDB, manage credentials with Secrets Manager, and wire up SQS messaging — the same services you'd reach for building a real product on AWS.",
      "By the end, you'll have deployed a full-stack Spring Boot + Angular + MySQL application end to end on AWS infrastructure, not just clicked through a single toy example.",
    ],
    requirements: [
      "An AWS account (the Free Tier covers everything used in this course)",
      "Basic Java/Spring Boot familiarity is helpful but not required to follow along",
      "Comfort with the command line",
    ],
    instructorBio:
      "Marcus Webb focuses on practical, deployment-first AWS training — less exam trivia, more \"here's how you'd actually ship this.\"",
    whatYouLearn: [
      "Launch and configure EC2 instances for a live application",
      "Deploy Spring Boot and Angular apps to Elastic Beanstalk and S3",
      "Connect applications to RDS (MySQL) and DynamoDB",
      "Manage credentials with Secrets Manager and integrate SQS messaging",
    ],
    curriculum: [
      {
        title: "Getting Started",
        lectures: [
          { id: "aws-01-intro", title: "What is AWS? Amazon Cloud Services Tutorial", minutes: 9, hasVideo: true },
        ],
      },
      {
        title: "Compute & Deployment",
        lectures: [
          { id: "aws-02-ec2-instance", title: "Create an EC2 Instance in AWS — Step by Step", minutes: 8, hasVideo: true },
          { id: "aws-03-ec2-s3-deploy", title: "Deploy a Spring Boot Application on AWS Using EC2 & S3", minutes: 18, hasVideo: true },
          { id: "aws-04-beanstalk-tomcat", title: "Deploy Spring Boot Applications with AWS Elastic Beanstalk (Tomcat)", minutes: 9, hasVideo: true },
        ],
      },
      {
        title: "Databases & Storage",
        lectures: [
          { id: "aws-05-rds-mysql", title: "Amazon RDS — Deploy a Spring Boot + MySQL CRUD App to Elastic Beanstalk", minutes: 15, hasVideo: true },
          { id: "aws-06-dynamodb", title: "AWS DynamoDB — Spring Boot CRUD Example on Elastic Beanstalk", minutes: 34, hasVideo: true },
          { id: "aws-07-angular-s3", title: "Deploy an Angular Application to AWS S3", minutes: 7, hasVideo: true },
        ],
      },
      {
        title: "Advanced Integration",
        lectures: [
          { id: "aws-08-secrets-manager", title: "Manage Credentials Securely with AWS Secrets Manager & RDS", minutes: 27, hasVideo: true },
          { id: "aws-09-sqs", title: "Spring Cloud AWS — Amazon Simple Queue Service (SQS) with Spring Boot", minutes: 19, hasVideo: true },
          { id: "aws-10-fullstack-beanstalk", title: "Full-Stack Deployment: Spring Boot + Angular + MySQL on AWS (Beanstalk, S3, RDS)", minutes: 21, hasVideo: true },
        ],
      },
    ],
    announcements: [
      {
        date: "2026-09-15",
        text: "New lectures on Elastic Beanstalk and Secrets Manager are now live — check the updated Course content tab.",
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
    logo: "/logos/google-cloud.png",
    rating: 4.6,
    ratingCount: 945,
    description:
      "Deploy and manage workloads on Google Cloud using the Console, gcloud CLI, and Cloud Shell — aligned to the ACE exam.",
    about: [
      "Deploy and manage real workloads on Google Cloud using the Console, the gcloud CLI, and Cloud Shell — structured around the Associate Cloud Engineer exam guide.",
      "You'll cover project setup and IAM, Compute Engine and GKE, serverless deployment with Cloud Run, and the core networking and storage services you'll be tested on and actually use.",
      "Each section pairs a short concept explanation with a hands-on task in the Console or CLI, so you're building muscle memory, not just recognizing terms.",
    ],
    requirements: [
      "A Google Cloud account (the free trial credit is enough to follow along)",
      "No prior GCP experience required",
      "Basic comfort with a terminal for the gcloud CLI sections",
    ],
    instructorBio:
      "Mei Lin Tan teaches Google Cloud fundamentals with an emphasis on the tools you'll actually use day to day — Console, gcloud, and Cloud Shell.",
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
    announcements: [
      {
        date: "2026-09-05",
        text: "Thanks for enrolling in the Associate Cloud Engineer track — I'm putting together additional VPC networking labs, stay tuned for an update.",
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
    logo: "/logos/sap.png",
    rating: 4.5,
    ratingCount: 612,
    description:
      "A business-process view of SAP S/4HANA — finance, procurement, and supply chain — for professionals working alongside SAP teams.",
    about: [
      "A business-process view of SAP S/4HANA — finance, procurement, and supply chain — built for professionals who work alongside SAP teams rather than configure the system themselves.",
      "You'll navigate the Fiori launchpad, understand how organizational structures map to configuration, and walk through real finance and procurement processes end to end, finishing with a case study that ties it all together.",
      "This isn't a developer-focused ABAP course — it's aimed at business stakeholders who need to speak confidently with SAP implementation teams.",
    ],
    requirements: [
      "No SAP experience required — this course is written for business professionals, not developers",
      "General familiarity with business processes (finance, procurement, or supply chain) is helpful but not required",
    ],
    instructorBio:
      "Ingrid Voss brings a business-process lens to SAP training, focused on how the system supports real finance and procurement workflows rather than technical configuration.",
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
    announcements: [
      {
        date: "2026-08-28",
        text: "Welcome! Quick note: the case study in the final section assumes you're already comfortable navigating the SAP Fiori launchpad from Section 1.",
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
  return flat.find((l) => l.hasVideo) ?? flat[0]
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
