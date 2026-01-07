import questionsData from './risk_maturity_questions.json';

// Type definition for the JSON structure
interface JsonAnswer {
  Answer: string;
  Points: number;
}

interface JsonQuestion {
  Question: string;
  Answers: JsonAnswer[];
  Weight: number;
  'Max Points': number;
}

type JsonQuestionsData = Record<string, JsonQuestion[]>;

export interface Question {
  id: number;
  question: string;
  type: 'single';
  options: string[];
  points: Record<number, number>; // option index to points
  weight: number;
  maxPoints: number;
}

type QuestionsByIndustry = Record<string, Question[]>;

// Transform JSON data to Question format
function transformQuestions(data: JsonQuestionsData): QuestionsByIndustry {
  const result: QuestionsByIndustry = {};
  
  for (const [industry, questions] of Object.entries(data)) {
    result[industry] = questions.map((q, index) => {
      const options: string[] = [];
      const points: Record<number, number> = {};
      
      q.Answers.forEach((answer, answerIndex) => {
        options.push(answer.Answer);
        points[answerIndex] = answer.Points;
      });
      
      return {
        id: index + 1,
        question: q.Question,
        type: 'single' as const,
        options,
        points,
        weight: q.Weight,
        maxPoints: q['Max Points']
      };
    });
  }
  
  return result;
}

export const questionsByIndustry = transformQuestions(questionsData);

// Get questions for a specific industry
export function getQuestionsForIndustry(industry: string): Question[] {
  // Handle exact match or partial match
  if (questionsByIndustry[industry]) {
    return questionsByIndustry[industry];
  }
  
  // Try to find a match (case-insensitive, partial)
  const normalizedIndustry = industry.toLowerCase();
  for (const [key, questions] of Object.entries(questionsByIndustry)) {
    if (key.toLowerCase().includes(normalizedIndustry) || normalizedIndustry.includes(key.toLowerCase())) {
      return questions;
    }
  }
  
  // Default to first industry if no match
  return Object.values(questionsByIndustry)[0] || [];
}

// Get all available industry types
export const companyTypes = Object.keys(questionsByIndustry);

export const annualTurnover = [
  '€0 - 4,999,999',
  '€5,000,000 - 49,999,999',
  '€50,000,000 - 500,000,000',
  'More than €500,000,000'
];

export const employeeRanges = [
  '1 - 99',
  '100 - 599',
  '600 - 1,500',
  'More than 1,500'
];

// Calculate score using Weight × Points
export function calculateScore(answers: Record<number, number[]>, questions: Question[]): number {
  let totalScore = 0;
  let maxPossible = 0;

  questions.forEach((q) => {
    const selectedOptions = answers[q.id] || [];
    
    // Calculate max possible for this question (Weight × max answer points)
    const maxAnswerPoints = Math.max(...Object.values(q.points));
    const questionMaxPoints = q.weight * maxAnswerPoints;
    maxPossible += questionMaxPoints;

    // Calculate actual score (Weight × selected answer points)
    if (selectedOptions.length > 0) {
      const selectedOptionIndex = selectedOptions[0]; // Single select
      const answerPoints = q.points[selectedOptionIndex] || 0;
      totalScore += q.weight * answerPoints;
    }
  });

  if (maxPossible === 0) return 0;
  return Math.round((totalScore / maxPossible) * 100);
}

export function getMaturityLevel(score: number): { level: string; description: string; color: string } {
  if (score >= 80) {
    return {
      level: 'Advanced',
      description: 'Your organization demonstrates a mature risk management framework with strong governance and culture.',
      color: 'text-success'
    };
  } else if (score >= 60) {
    return {
      level: 'Developing',
      description: 'Your risk management framework is well-established but has room for improvement in certain areas.',
      color: 'text-primary'
    };
  } else if (score >= 40) {
    return {
      level: 'Emerging',
      description: 'Your organization has basic risk management practices but needs significant development.',
      color: 'text-amber-500'
    };
  } else {
    return {
      level: 'Initial',
      description: 'Your risk management framework requires substantial development and formalization.',
      color: 'text-destructive'
    };
  }
}
