export interface JobExtraction {
  company: string;
  requirements: string[];
}

export enum StepStatus {
  IDLE = 'IDLE',
  EXTRACTING = 'EXTRACTING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export const ARTIFACT_URLS = {
  REACT_GITHUB_URL: "https://github.com/ksprabin/world-clock-app",
  AI_WEB_APP_URL: "https://fund-management-sooty.vercel.app/",
  PORTFOLIO_URL: "https://prabin-portfolio-nu.vercel.app/"
};