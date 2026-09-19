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
  logo: string
  rating: number
  ratingCount: number
  description: string
  whatYouLearn: string[]
  curriculum: Section[]
}

export const categories = ["Microsoft Azure", "AWS", "Google Cloud", "SAP"]

// QA-only: videos live in a private blob container, so URLs carry a read-only
// SAS token supplied at build time (never committed — see VITE_QA_VIDEO_SAS
// in the deploy-frontend-qa workflow). Replace with per-request signed URLs
// from the Video service once playback auth exists (Phase 2).
const QA_VIDEO_BASE = "https://stlearnlyqa4127.blob.core.windows.net/videos"
const QA_VIDEO_SAS = import.meta.env.VITE_QA_VIDEO_SAS ?? ""
const qaVideo = (blobName: string) => `${QA_VIDEO_BASE}/${blobName}?${QA_VIDEO_SAS}`

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
      "A hands-on introduction to Microsoft Azure — cloud fundamentals, core resources, virtual machines, networking, storage, and CLI automation — built as a practical roadmap toward AZ-900 and AZ-104.",
    whatYouLearn: [
      "Explain core cloud computing concepts and Azure's global infrastructure",
      "Deploy and manage Azure resources, resource groups, and virtual machines (including running Jenkins on an Azure VM)",
      "Design Azure Virtual Networks with firewalls, NSGs, and Bastion for secure connectivity",
      "Work with Azure Storage services (Blob, File, Table, Queue) and automate resources with the Azure CLI",
    ],
    curriculum: [
      {
        title: "Getting Started",
        lectures: [
          { id: "azb-01-intro", title: "Course Introduction and Syllabus (AZ-900/AZ-104 Roadmap)", minutes: 32, videoUrl: qaVideo("azb-01-intro.mp4") },
          { id: "azb-02-cloud-fundamentals", title: "Fundamentals of Cloud Computing", minutes: 50, videoUrl: qaVideo("azb-02-cloud-fundamentals.mp4") },
          { id: "azb-03-getting-started", title: "Getting Started with Microsoft Azure", minutes: 31, videoUrl: qaVideo("azb-03-getting-started.mp4") },
        ],
      },
      {
        title: "Core Azure Resources & Compute",
        lectures: [
          { id: "azb-04-resources-rg-arm", title: "Azure Resources, Resource Groups and Resource Manager", minutes: 25, videoUrl: qaVideo("azb-04-resources-rg-arm.mp4") },
          { id: "azb-05-vms-jenkins", title: "Azure Virtual Machines and Deploying Jenkins on Azure VM", minutes: 44, videoUrl: qaVideo("azb-05-vms-jenkins.mp4") },
        ],
      },
      {
        title: "Azure Networking",
        lectures: [
          { id: "azb-06-vnet-fundamentals", title: "Azure Virtual Network (VNet) Fundamentals", minutes: 19, videoUrl: qaVideo("azb-06-vnet-fundamentals.mp4") },
          { id: "azb-07-networking-basic-advanced", title: "Azure Networking Basic to Advanced", minutes: 39, videoUrl: qaVideo("azb-07-networking-basic-advanced.mp4") },
          { id: "azb-08-networking-project", title: "Azure Networking Project - VNet, Firewall, NSG and Bastion", minutes: 38, videoUrl: qaVideo("azb-08-networking-project.mp4") },
          { id: "azb-09-networking-interview", title: "Azure Networking Interview Questions and Scenarios", minutes: 34, videoUrl: qaVideo("azb-09-networking-interview.mp4") },
        ],
      },
      {
        title: "Storage & Automation",
        lectures: [
          { id: "azb-10-storage-services", title: "Azure Storage Services - Blob, File, Table and Queue", minutes: 24, videoUrl: qaVideo("azb-10-storage-services.mp4") },
          { id: "azb-11-cli-automation", title: "Automating Azure Resources with Azure CLI", minutes: 29, videoUrl: qaVideo("azb-11-cli-automation.mp4") },
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
          { id: "aws-01-intro", title: "What is AWS? Amazon Cloud Services Tutorial", minutes: 9, videoUrl: qaVideo("aws-01-intro.mp4") },
        ],
      },
      {
        title: "Compute & Deployment",
        lectures: [
          { id: "aws-02-ec2-instance", title: "Create an EC2 Instance in AWS — Step by Step", minutes: 8, videoUrl: qaVideo("aws-02-ec2-instance.mp4") },
          { id: "aws-03-ec2-s3-deploy", title: "Deploy a Spring Boot Application on AWS Using EC2 & S3", minutes: 18, videoUrl: qaVideo("aws-03-ec2-s3-deploy.mp4") },
          { id: "aws-04-beanstalk-tomcat", title: "Deploy Spring Boot Applications with AWS Elastic Beanstalk (Tomcat)", minutes: 9, videoUrl: qaVideo("aws-04-beanstalk-tomcat.mp4") },
        ],
      },
      {
        title: "Databases & Storage",
        lectures: [
          { id: "aws-05-rds-mysql", title: "Amazon RDS — Deploy a Spring Boot + MySQL CRUD App to Elastic Beanstalk", minutes: 15, videoUrl: qaVideo("aws-05-rds-mysql.mp4") },
          { id: "aws-06-dynamodb", title: "AWS DynamoDB — Spring Boot CRUD Example on Elastic Beanstalk", minutes: 34, videoUrl: qaVideo("aws-06-dynamodb.mp4") },
          { id: "aws-07-angular-s3", title: "Deploy an Angular Application to AWS S3", minutes: 7, videoUrl: qaVideo("aws-07-angular-s3.mp4") },
        ],
      },
      {
        title: "Advanced Integration",
        lectures: [
          { id: "aws-08-secrets-manager", title: "Manage Credentials Securely with AWS Secrets Manager & RDS", minutes: 27, videoUrl: qaVideo("aws-08-secrets-manager.mp4") },
          { id: "aws-09-sqs", title: "Spring Cloud AWS — Amazon Simple Queue Service (SQS) with Spring Boot", minutes: 19, videoUrl: qaVideo("aws-09-sqs.mp4") },
          { id: "aws-10-fullstack-beanstalk", title: "Full-Stack Deployment: Spring Boot + Angular + MySQL on AWS (Beanstalk, S3, RDS)", minutes: 21, videoUrl: qaVideo("aws-10-fullstack-beanstalk.mp4") },
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
    logo: "/logos/google-cloud.png",
    rating: 4.6,
    ratingCount: 945,
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
    logo: "/logos/sap.png",
    rating: 4.5,
    ratingCount: 612,
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
