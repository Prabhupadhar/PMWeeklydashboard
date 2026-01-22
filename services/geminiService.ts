
import { GoogleGenAI, Type } from "@google/genai";
import { DashboardData, HealthStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDashboardInsights = async (rawCsvData: string): Promise<DashboardData> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Act as a senior PM. Analyze the following project tracking data (CSV format) and generate a comprehensive weekly status dashboard in JSON format.
    
    Data:
    ${rawCsvData}
    
    Requirements:
    1. Infer project name and current date.
    2. Assess health metrics.
    3. Calculate velocity allocation.
    4. NEW: workloadDistribution (Array of {name, count}) - how many tasks each person has.
    5. NEW: burnTrend (Array of {label, value}) - a trend line showing tasks completed over the last 7 days.
    6. NEW: phaseProgress (Array of {phase, percent}) - progress of current project phases (e.g., Design, Dev, QA).
    7. Priority distribution, Milestones, Sentiment, and Executive Summary.
    
    Ensure the response is strictly valid JSON following the DashboardData interface.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          projectName: { type: Type.STRING },
          reportingPeriod: { type: Type.STRING },
          overallStatus: { type: Type.STRING, enum: [HealthStatus.ON_TRACK, HealthStatus.AT_RISK, HealthStatus.OFF_TRACK] },
          executiveSummary: { type: Type.STRING },
          scheduleHealth: { type: Type.STRING, enum: [HealthStatus.ON_TRACK, HealthStatus.AT_RISK, HealthStatus.OFF_TRACK] },
          scopeHealth: { type: Type.STRING, enum: [HealthStatus.ON_TRACK, HealthStatus.AT_RISK, HealthStatus.OFF_TRACK] },
          qualityHealth: { type: Type.STRING, enum: [HealthStatus.ON_TRACK, HealthStatus.AT_RISK, HealthStatus.OFF_TRACK] },
          resourceHealth: { type: Type.STRING, enum: [HealthStatus.ON_TRACK, HealthStatus.AT_RISK, HealthStatus.OFF_TRACK] },
          achievements: { type: Type.ARRAY, items: { type: Type.STRING } },
          risks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                mitigation: { type: Type.STRING }
              }
            }
          },
          actionItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                task: { type: Type.STRING },
                owner: { type: Type.STRING },
                dueDate: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["Open", "Completed", "In Progress"] }
              }
            }
          },
          progress: {
            type: Type.OBJECT,
            properties: {
              completed: { type: Type.NUMBER },
              inProgress: { type: Type.NUMBER },
              todo: { type: Type.NUMBER },
              blocked: { type: Type.NUMBER }
            }
          },
          priorityDistribution: {
            type: Type.OBJECT,
            properties: {
              high: { type: Type.NUMBER },
              medium: { type: Type.NUMBER },
              low: { type: Type.NUMBER }
            }
          },
          workloadDistribution: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                count: { type: Type.NUMBER }
              }
            }
          },
          burnTrend: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.NUMBER }
              }
            }
          },
          phaseProgress: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING },
                percent: { type: Type.NUMBER }
              }
            }
          },
          milestones: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                date: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["Completed", "Upcoming", "Delayed"] }
              }
            }
          },
          teamSentiment: { type: Type.STRING, enum: ["Positive", "Neutral", "Stressed"] }
        },
        required: ["projectName", "overallStatus", "executiveSummary"]
      }
    }
  });

  const parsedData = JSON.parse(response.text ?? '{}');
  return {
    ...parsedData,
    id: Math.random().toString(36).substr(2, 9),
    activeWidgets: ['progress', 'highlights', 'risks', 'actions', 'workload', 'trend'], // Standard defaults
    lastUpdated: new Date().toISOString()
  };
};
