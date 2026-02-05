
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are the ParkPoint SOP Expert. Your role is to provide accurate guidance based on ParkPoint's Policy and Procedure Manuals.

For every user query, you MUST return a response in the following JSON format:
{
  "summary": "Detailed summary structured EXCLUSIVELY in bullet points (using •). Each point must be a clear procedural step or policy rule. Include specific SOP reference numbers (e.g., SOP-HR-01, SOP-OPS-05) directly in the text where relevant.",
  "roles": [
    { "position": "Position Name", "responsibility": "Specific role responsibility for this task" }
  ],
  "flowchart": {
    "nodes": [
      { "id": "1", "text": "Start", "type": "start" },
      { "id": "2", "text": "Step Description", "type": "process" }
    ],
    "edges": [
      { "from": "1", "to": "2" }
    ]
  },
  "references": ["SOP Number - Title", "Manual Section X.Y"],
  "faqs": ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]
}

Guidelines for FAQs:
- Generate exactly 5 dynamic FAQs directly related to the user's current query.
- These questions should help the user explore deeper or related procedural details.
- Ensure they are specific to ParkPoint policies.

Contextual Key Points to use:
1. Finance: FM manages originals. CoA is 6 digits. Petty cash float is BD 500. Expenses < BD 50 from petty cash. Reference: SOP-FIN-01.
2. HR: Recruitment starts with MRF. Probation 3 months. Annual Leave (BH: 2.5 days/mo). Termination needs 2 written warnings. Reference: SOP-HR-02.
3. Operations: Valet lost ticket involves LPR check -> Overnight report -> OTP verification. Shift start 15 mins before duty. Reference: SOP-OPS-10.
4. Audit: Fortnightly and Monthly reporting. Risk Matrix (High/Med/Low). Reference: SOP-AUD-04.
5. Revenue Reco: 4-step approach matching PMS to PSP statements. 1% threshold for variance. Reference: SOP-REV-01.

If the answer is not in the manuals, politely state that you can only provide information based on official ParkPoint policies. ALWAYS include SOP reference numbers where applicable.`;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const queryProcedure = async (query: string, retryCount = 0): Promise<any> => {
  // Always create a fresh instance to pick up potentially new API keys from the selection dialog
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: query }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.1, // Lower temperature for more consistent procedural accuracy
      },
    });

    if (!response.text) throw new Error("Empty response from AI");
    return JSON.parse(response.text);
  } catch (error: any) {
    const status = error?.status || (error?.message?.includes('429') ? 429 : 0);
    const isQuotaError = status === 429 || error?.message?.includes('RESOURCE_EXHAUSTED');

    if (isQuotaError && retryCount < 4) {
      // Exponential backoff: 3s, 6s, 12s, 24s
      const waitTime = Math.pow(2, retryCount) * 3000;
      console.warn(`Quota reached. Retry ${retryCount + 1}/4 in ${waitTime}ms...`);
      await sleep(waitTime);
      return queryProcedure(query, retryCount + 1);
    }
    
    throw error;
  }
};
