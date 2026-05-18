const axios = require('axios');
const Employee = require('../models/Employee');

/**
 * Builds an intelligent AI prompt based on employee data.
 * Adapts the prompt to performance tier for targeted analysis.
 *
 * @param {Object} employee - Employee document
 * @param {string} mode - 'single' | 'ranking' | 'batch'
 * @returns {string} Crafted prompt
 */
const buildPrompt = (employee, mode = 'single') => {
  const tier =
    employee.performanceScore >= 80
      ? 'HIGH PERFORMER'
      : employee.performanceScore >= 60
      ? 'AVERAGE PERFORMER'
      : 'NEEDS IMPROVEMENT';

  if (mode === 'single') {
    return `You are an expert HR analytics AI for a corporate organization. Analyze the following employee profile and generate a comprehensive, actionable recommendation report.

EMPLOYEE PROFILE:
- Name: ${employee.name}
- Department: ${employee.department}
- Performance Score: ${employee.performanceScore}/100 (${tier})
- Years of Experience: ${employee.experience} years
- Current Skills: ${employee.skills.join(', ')}

INSTRUCTIONS:
1. Assess promotion eligibility (consider score ≥ 80 AND experience ≥ 2 years as eligible)
2. Identify specific skill gaps based on department and current skills
3. Suggest a concrete training plan if performance < 80
4. Provide a ranking within the organization (High/Mid/Low tier)
5. Generate actionable AI feedback (3-4 sentences max)
6. If score < 60: focus on improvement plan and support
7. If score ≥ 80: focus on promotion, rewards, leadership opportunities

RESPONSE FORMAT (JSON):
{
  "promotionEligible": true/false,
  "ranking": "Top 10% / Top 25% / Average / Bottom 25%",
  "performanceTier": "Excellent / Good / Needs Improvement",
  "trainingRecommendations": ["skill1", "skill2", "skill3"],
  "aiSummary": "concise 3-4 sentence professional feedback",
  "actionItems": ["action1", "action2", "action3"],
  "salaryReviewRecommended": true/false
}

Respond ONLY with valid JSON. No extra text.`;
  }

  if (mode === 'ranking') {
    return `You are an expert HR analytics AI. Rank these employees and provide brief reasoning.

EMPLOYEES (name, score, experience, dept):
${employee
  .map(
    (e, i) =>
      `${i + 1}. ${e.name} | Score: ${e.performanceScore}/100 | Exp: ${e.experience}yrs | Dept: ${e.department}`
  )
  .join('\n')}

Generate a ranked list with brief justification for each ranking decision. Consider: performance score (60%), experience (25%), department demand (15%).

RESPONSE FORMAT (JSON array, sorted best to worst):
[
  {
    "rank": 1,
    "name": "employee name",
    "score": 85,
    "justification": "Brief 1-sentence reason",
    "recommendation": "Promotion / Retain / Training"
  }
]

Respond ONLY with valid JSON.`;
  }
};

/**
 * Calls OpenRouter API with the given prompt using LLaMA 3.1.
 * @param {string} prompt
 * @returns {Promise<string>} AI response text
 */
const callOpenRouter = async (prompt) => {
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'EmpAI - Employee Performance Analytics',
      },
      timeout: 30000,
    }
  );

  return response.data.choices[0]?.message?.content || '';
};

/**
 * @desc    Get AI recommendation for a single employee
 * @route   POST /api/ai/recommend
 * @access  Private
 */
const getRecommendation = async (req, res, next) => {
  try {
    const { employeeId, employeeData } = req.body;

    let employee;

    if (employeeId) {
      employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ success: false, message: 'Employee not found.' });
      }
    } else if (employeeData) {
      // Allow inline analysis without DB lookup
      employee = employeeData;
    } else {
      return res.status(400).json({ success: false, message: 'Provide employeeId or employeeData.' });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'AI service not configured. Set OPENROUTER_API_KEY in .env',
      });
    }

    const prompt = buildPrompt(employee, 'single');
    const rawResponse = await callOpenRouter(prompt);

    // Parse JSON response safely
    let recommendation;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      recommendation = JSON.parse(jsonMatch ? jsonMatch[0] : rawResponse);
    } catch {
      // Fallback to raw text if JSON parsing fails
      recommendation = { aiSummary: rawResponse, raw: true };
    }

    // Cache recommendation in DB if looked up by ID
    if (employeeId && employee.save) {
      employee.aiRecommendation = recommendation.aiSummary || '';
      employee.lastAiUpdate = new Date();
      await employee.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      data: {
        employee: {
          id: employee._id || null,
          name: employee.name,
          department: employee.department,
          performanceScore: employee.performanceScore,
          experience: employee.experience,
          skills: employee.skills,
        },
        recommendation,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error.response?.status === 401) {
      return res.status(401).json({ success: false, message: 'Invalid OpenRouter API key.' });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ success: false, message: 'AI rate limit exceeded. Please wait and retry.' });
    }
    next(error);
  }
};

/**
 * @desc    Rank multiple employees using AI
 * @route   POST /api/ai/rank
 * @access  Private
 */
const rankEmployees = async (req, res, next) => {
  try {
    const { employeeIds } = req.body;

    let employees;
    if (employeeIds && employeeIds.length > 0) {
      employees = await Employee.find({ _id: { $in: employeeIds } }).lean();
    } else {
      // Rank all employees if no IDs specified
      employees = await Employee.find({}).sort('-performanceScore').limit(20).lean();
    }

    if (employees.length === 0) {
      return res.status(404).json({ success: false, message: 'No employees found to rank.' });
    }

    const prompt = buildPrompt(employees, 'ranking');
    const rawResponse = await callOpenRouter(prompt);

    let rankings;
    try {
      const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);
      rankings = JSON.parse(jsonMatch ? jsonMatch[0] : rawResponse);
    } catch {
      rankings = [{ raw: rawResponse }];
    }

    res.status(200).json({
      success: true,
      data: {
        rankings,
        totalRanked: employees.length,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendation, rankEmployees };
