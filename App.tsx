import React, { useState, useEffect } from 'react';
import { extractJobDetails, generateCoverLetter } from './services/geminiService';
import { StepStatus } from './types';

const App: React.FC = () => {
  const [resume, setResume] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [status, setStatus] = useState<StepStatus>(StepStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Pre-fill for demonstration purposes (matching the user's provided example)
  useEffect(() => {
    setResume("I have 6 years of Python development, focusing on MLOps pipelines using Kubernetes and GCP. I successfully led a project to build and deploy a production RAG system last year. I pride myself on clear documentation and cross-team communication.");
    setJobDescription("Senior Software Engineer, ML Platform at Innovatech Solutions. We are looking for an engineer with 5+ years of Python experience, specializing in MLOps and cloud infrastructure. Key skills include: Kubernetes for deployment, expertise in building and maintaining Retrieval-Augmented Generation (RAG) systems, and strong collaboration skills.");
  }, []);

  const handleGenerate = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setErrorMessage("Please provide both your experience and the job description.");
      setStatus(StepStatus.ERROR);
      return;
    }

    setErrorMessage('');
    setGeneratedLetter('');
    setStatus(StepStatus.EXTRACTING);

    try {
      // Step 1: Extraction
      const extractedData = await extractJobDetails(jobDescription);
      
      // Step 2: Generation
      setStatus(StepStatus.GENERATING);
      const letter = await generateCoverLetter(extractedData, resume);
      
      setGeneratedLetter(letter);
      setStatus(StepStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
      setStatus(StepStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Orchestrator Web</h1>
          </div>
          <p className="hidden md:block text-sm text-gray-500 font-medium">Extraction → Generation Chain</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {/* Input 1: Resume */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-100 bg-indigo-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">1. Resume / Summary</h2>
                <p className="text-sm text-gray-500 mt-1">Paste your relevant work history and skills.</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">1</div>
            </div>
            <div className="p-6 flex-grow">
              <textarea 
                className="w-full h-64 p-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none text-base leading-relaxed placeholder-gray-400 outline-none"
                placeholder="E.g., 5 years experience in Python, specializing in RAG systems..."
                value={resume}
                onChange={(e) => setResume(e.target.value)}
              />
            </div>
          </section>

          {/* Input 2: Job Description */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-100 bg-emerald-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">2. Job Description</h2>
                <p className="text-sm text-gray-500 mt-1">Paste the full job posting text.</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">2</div>
            </div>
            <div className="p-6 flex-grow">
              <textarea 
                className="w-full h-64 p-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none text-base leading-relaxed placeholder-gray-400 outline-none"
                placeholder="E.g., We are looking for a Senior Software Engineer with expertise in..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </section>
        </div>

        {/* Action Button & Status */}
        <div className="flex flex-col items-center mb-12 space-y-6">
          <button
            onClick={handleGenerate}
            disabled={status === StepStatus.EXTRACTING || status === StepStatus.GENERATING}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            {status === StepStatus.EXTRACTING || status === StepStatus.GENERATING ? (
              <span className="flex items-center gap-2">
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Generate Cover Letter"
            )}
          </button>

          {/* Status Indicators */}
          <div className="w-full max-w-2xl">
            {status === StepStatus.EXTRACTING && (
              <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-100 text-yellow-800 flex items-center justify-center gap-2 animate-pulse">
                <span className="font-semibold">Step 1/2:</span> Extracting company and key requirements...
              </div>
            )}
            {status === StepStatus.GENERATING && (
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-800 flex items-center justify-center gap-2 animate-pulse">
                <span className="font-semibold">Step 2/2:</span> Generating tailored cover letter...
              </div>
            )}
            {status === StepStatus.ERROR && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-700 text-center">
                <span className="font-bold block mb-1">Error</span>
                {errorMessage}
              </div>
            )}
            {status === StepStatus.SUCCESS && (
              <div className="p-4 rounded-lg bg-green-50 border border-green-100 text-green-700 text-center flex flex-col items-center">
                <span className="font-bold text-lg mb-1">✅ Success!</span>
                <span className="text-sm">Cover letter generated successfully.</span>
              </div>
            )}
          </div>
        </div>

        {/* Output Area */}
        {generatedLetter && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-fade-in-up">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Generated Cover Letter</h2>
              <button 
                onClick={() => navigator.clipboard.writeText(generatedLetter)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                Copy to Clipboard
              </button>
            </div>
            <div className="p-8 md:p-12 bg-white">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
                {generatedLetter}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;