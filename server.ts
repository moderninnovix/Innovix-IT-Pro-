import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header for AI Studio
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper for safe error forwarding
function handleApiError(res: any, error: any, context: string) {
  console.error(`Error in ${context}:`, error);
  res.status(500).json({ 
    error: "Failed to process request with AI", 
    details: error instanceof Error ? error.message : String(error) 
  });
}

// 1. Endpoint: AI Advisor Chat
app.post("/api/gemini/advisor", async (req, res) => {
  try {
    const { prompt, chatHistory } = req.body;
    
    // Format history if available
    const systemInstruction = 
      "You are 'BizFlow IT AI Advisor', an expert Bangladeshi IT Entrepreneur, IT Project Manager, and Financial Advisor. " +
      "You assist the owner of an IT Services / Software Company. Speak in a highly encouraging, professional, and clear tone. " +
      "Provide answers with practical steps. Support bilingual answers: reply in Bengali if the user asks in Bengali or requests it, " +
      "otherwise English, or mixed (Banglish/Bilingual) as preferred by local tech startups in Dhaka. " +
      "Help with team productivity, coding workflows, client communications, price setting, and accounts auditing.";

    const contents = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }
    }
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error) {
    handleApiError(res, error, "AI Advisor Chat");
  }
});

// 2. Endpoint: Generate Project Roadmap & Deliverables
app.post("/api/gemini/roadmap", async (req, res) => {
  try {
    const { clientName, projectName, totalBudget, notes } = req.body;

    const prompt = `Generate a modern, step-by-step Technical Project Roadmap for Client: "${clientName}" for Project: "${projectName}" with a budget of ${totalBudget} USD. Special notes/User requirements: "${notes || 'None'}".`;
    
    const systemInstruction = 
      "You are an Elite Agile Scrum Master and Software Architect. " +
      "Your output must be a JSON object containing keys: 'phases' as an array of objects. " +
      "Each phase must have: 'phaseTitle', 'weeksToComplete', 'description', 'deliverables' (array of strings), and 'estimatedCost'. " +
      "Follow constraints strictly. Respond only with the raw JSON format.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["phases"],
          properties: {
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["phaseTitle", "weeksToComplete", "description", "deliverables", "estimatedCost"],
                properties: {
                  phaseTitle: { type: Type.STRING },
                  weeksToComplete: { type: Type.STRING },
                  description: { type: Type.STRING },
                  deliverables: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  estimatedCost: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const responseText = response.text || "{}";
    res.json(JSON.parse(responseText.trim()));
  } catch (error) {
    handleApiError(res, error, "Project Roadmap generation");
  }
});

// 3. Endpoint: Pitch Proposal / Invoice Request Draft Generator
app.post("/api/gemini/invoice-email", async (req, res) => {
  try {
    const { clientName, projectName, totalBudget, paidAmount, dueAmount, language } = req.body;

    const prompt = `Create a professional invoice/due-payment reminder email for a client.
    Client: ${clientName}
    Project: ${projectName}
    Total Budget: $${totalBudget}
    Paid Amount: $${paidAmount}
    Due Amount: $${dueAmount}
    Language: ${language || 'English'}
    Format: Subject Line first, then Email Body.`;

    const systemInstruction = 
      "You are a professional IT Business Developer. " +
      "Draft an elegant, warm, yet firm payment request email. If language is 'Bengali', " +
      "write the draft in beautiful polite corporate Bengali. Maintain absolute professionalism, " +
      "emphasizing great partnership and support.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.5,
      }
    });

    res.json({ emailText: response.text });
  } catch (error) {
    handleApiError(res, error, "Invoice Email Draft");
  }
});

// 4. Endpoint: Virtual Meeting summarizer
app.post("/api/gemini/meeting-summarize", async (req, res) => {
  try {
    const { meetingTitle, agenda, discussionNotes } = req.body;

    const prompt = `Meeting: "${meetingTitle}"\nAgenda: "${agenda}"\nDiscussion logs: "${discussionNotes}"`;

    const systemInstruction = 
      "Analyze the discussions from this company team meeting. " +
      "Extract: " +
      "1. A concise professional Bengali or English summary " +
      "2. Primary action points / tasks to delegate " +
      "3. Suggested task assignments with titles, due dates, priority, and assigned person " +
      "Your response must be structured as JSON containing keys: 'summary' (string), 'actionPoints' (array of strings), " +
      "and 'suggestedTasks' as an array of objects. Each suggested task has: 'title' (string), 'priority' ('Low' | 'Medium' | 'High'), " +
      "'assignedTo' (e.g., 'Developer' or 'Designer'). " +
      "Make sure to output strictly the raw JSON structure.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["summary", "actionPoints", "suggestedTasks"],
          properties: {
            summary: { type: Type.STRING },
            actionPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestedTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "priority", "assignedTo"],
                properties: {
                  title: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                  assignedTo: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const responseText = response.text || "{}";
    res.json(JSON.parse(responseText.trim()));
  } catch (error) {
    handleApiError(res, error, "Meeting Summarization");
  }
});

// 5. Endpoint: Remote Work Legal Agreement Generator
app.post("/api/gemini/agreement", async (req, res) => {
  try {
    const { 
      projectName, 
      employeeName, 
      employeeRole, 
      companyName, 
      description, 
      terms, 
      language 
    } = req.body;

    const userLanguage = language || 'bn';

    const systemInstruction = 
      "You are an expert corporate legal consultant, specialized in remote tech work agreements, " +
      "employment law, Non-Disclosure Agreements (NDA), Intellectual Property assignment, and service level contracts for IT companies in Bangladesh (Dhaka). " +
      "Your draft agreements are professional, clear, watertight, and hold employees responsible for deadlines, code secrecy, and complete asset handovers. " +
      "If the requested language is 'bn', write the entire legal agreement in elegant, professional legal Bengali (দলিল ও আইনি ভাষা). " +
      "If the language is 'en', write the agreement in professional, clean legal English. " +
      "Format the output beautifully with standard contract headings, numbered paragraphs, bullet points, sign-off blocks, and clean legal phrasing.";

    const prompt = `Write a comprehensive, professional Remote Work Legal Agreement / Remote Employee Contract.
    
    COMPLEXITY INFORMATION & METADATA:
    - Company Name: ${companyName || 'Innovix BD Ltd'}
    - Remote Employee / Developer Name: ${employeeName}
    - Role/Designation: ${employeeRole || 'Developer'}
    - Assigned Project Title: ${projectName}
    - Project Description & Scope of Work: ${description || 'Building custom software assets and maintaining code repository.'}
    - Custom Payment & Penalty Instructions: ${terms || 'Paid standard monthly or per milestone. Bug testing or late delivery triggers terms as per team managers.'}
    
    STRUCTURE REQUIREMENTS:
    The contract must include:
    1. OFFICIAL PREAMBLE: Defining date, company info, client role, and defined terms.
    2. SCOPE OF REMOTE SERVICES: Complete checklist of tasks.
    3. LIABILITIES & ACCOUNTABILITY: Since the employee works remotely, daily logs, clear report submission, server sync, accountability in work hours, internet and hardware requirements.
    4. INTELLECTUAL PROPERTY & SOURCE CODE OWNERSHIP: Explicitly state that all code, algorithms, repositories, Figma layout components, documents, data elements are 100% intellectual property of ${companyName || 'Innovix BD Ltd'} and cannot be shared, cloned, or sold elsewhere.
    5. NON-DISCLOSURE & SECRECY (NDA): NDAs, clients details protection.
    6. FINANCIAL COMPENSATION & PENALTIES: Explicitly state payment conditions and exact penalties for unreasonable delays, non-communication (unreachable), or buggy delivery structures.
    7. DEPARTURE & TERMINATION CLAUSE.
    8. SIGNATURE SIGN-OFF BLOCKS (Admin and Employee).
    
    Make the Markdown output detailed and professional. Do not use generic filler words, write real clauses.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ agreementText: response.text });
  } catch (error) {
    handleApiError(res, error, "Agreement Generation");
  }
});

// Setup Vite Dev server or Serve Static files based on NODE_ENV
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA Fallback for static assets
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
