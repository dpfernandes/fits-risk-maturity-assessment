export interface Question {
  id: number;
  question: string;
  type: 'single' | 'multi';
  options: string[];
  points: Record<number, number>; // option index to points
}

export const questions: Question[] = [
  {
    id: 1,
    question: "What is the status of your risk management framework?",
    type: 'multi',
    options: [
      "We have Enterprise Risk Management where operational risk framework is integrated into the overall ERM framework, including risk processes and risk functions",
      "We have a formal governance structure used to manage risk oversight",
      "We use risk identification and assessment tools (e.g., top down and/or bottom up assessment tools)",
      "None of the above"
    ],
    points: { 0: 3, 1: 2, 2: 2, 3: 0 }
  },
  {
    id: 2,
    question: "Do you use an Enterprise Risk Management software application?",
    type: 'single',
    options: [
      "Yes, we are all on the same system",
      "Some of us are on a system",
      "No"
    ],
    points: { 0: 3, 1: 1, 2: 0 }
  },
  {
    id: 3,
    question: "Do you have a board approved risk appetite and tolerance framework?",
    type: 'multi',
    options: [
      "Yes, our board has approved our risk appetite and tolerance levels",
      "Yes, and our 2nd line and board monitors adherence to the framework",
      "No"
    ],
    points: { 0: 2, 1: 3, 2: 0 }
  },
  {
    id: 4,
    question: "What is the state of your governance structure, ERM set-up and defense?",
    type: 'multi',
    options: [
      "Senior management has an effective governance oversight structure with well defined, transparent and consistent lines of responsibilities",
      "There is a lack of an effective governance structure in general across the organization",
      "We work with a true Enterprise Risk Management set-up, with one method and platform",
      "We work with Risk Management in silos"
    ],
    points: { 0: 3, 1: 0, 2: 3, 3: 0 }
  },
  {
    id: 5,
    question: "Which kind of defense model is applied in your organization?",
    type: 'single',
    options: [
      "3 Lines of Defense (3LOD)",
      "5 Lines of Assurance (5LOA)",
      "None of the above"
    ],
    points: { 0: 2, 1: 3, 2: 0 }
  },
  {
    id: 6,
    question: "What is the status of your risk culture?",
    type: 'multi',
    options: [
      "Our culture is Open and Aware - people are trained on risk management and transparent on risk issues",
      "Less open and aware - the culture is open but could be improved",
      "Closed - people are not aware of risk management and/or reluctant to share information",
      "We have a code of conduct or ethical policy",
      "We have aligned our compensation policies with our risk appetite and tolerance"
    ],
    points: { 0: 3, 1: 1, 2: 0, 3: 2, 4: 2 }
  },
  {
    id: 7,
    question: "Do you feel comfortable with your mitigation efforts around cyber security?",
    type: 'single',
    options: [
      "Yes",
      "No"
    ],
    points: { 0: 3, 1: 0 }
  },
  {
    id: 8,
    question: "Is your board actively involved in risk management?",
    type: 'single',
    options: [
      "Yes, our board approves the policies of the framework and provides independent review and best practices",
      "No"
    ],
    points: { 0: 3, 1: 0 }
  },
  {
    id: 9,
    question: "Do you trust the output from your risk framework in your decision making?",
    type: 'single',
    options: [
      "Yes, our risk framework is advanced enough that risk appetite is set at decision taking time",
      "No"
    ],
    points: { 0: 3, 1: 0 }
  },
  {
    id: 10,
    question: "Do you consider risks when developing new products, activities, processes, and/or systems?",
    type: 'multi',
    options: [
      "Yes, risk and performance indicators are used to provide insight into risk exposure",
      "Yes, we have clearly defined key risk indicators and/or key performance indicators",
      "Yes, we thoroughly assess all aspects consistent with taxonomy and measurement categories",
      "Yes, we have clearly defined roles and responsibilities to assess and challenge decisions",
      "No, we do not consider risk this formalized"
    ],
    points: { 0: 2, 1: 2, 2: 2, 3: 2, 4: 0 }
  },
  {
    id: 11,
    question: "Do you have a reporting structure to ensure risk profiles are monitored and actions are taken?",
    type: 'multi',
    options: [
      "Yes, reports are comprehensive, accurate, consistent and actionable across business lines",
      "Yes, our reporting is timely and we can produce reports in both normal and stressed conditions",
      "No"
    ],
    points: { 0: 3, 1: 2, 2: 0 }
  },
  {
    id: 12,
    question: "Do you have a clear business continuity framework?",
    type: 'single',
    options: [
      "Yes, we have established business continuity plans equivalent to our operation size and complexity",
      "No"
    ],
    points: { 0: 3, 1: 0 }
  },
  {
    id: 13,
    question: "Does your organization currently have organized operational risk training?",
    type: 'single',
    options: [
      "Yes",
      "No"
    ],
    points: { 0: 3, 1: 0 }
  },
  {
    id: 14,
    question: "Does Internal Audit follow a risk-based approach aligned with 1st and 2nd line risk management?",
    type: 'single',
    options: [
      "Yes, we are one happy family",
      "No, Internal Auditors fly solo"
    ],
    points: { 0: 3, 1: 0 }
  },
  {
    id: 15,
    question: "Is risk management tied to and involved in strategy work?",
    type: 'single',
    options: [
      "Yes, we perform risk assessments on strategy and objectives",
      "Not in a formalized way",
      "Not at all"
    ],
    points: { 0: 3, 1: 1, 2: 0 }
  }
];

export const companyTypes = ['Financial', 'Non-financial'];

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

export function calculateScore(answers: Record<number, number[]>): number {
  let totalScore = 0;
  let maxPossible = 0;

  questions.forEach((q) => {
    const selectedOptions = answers[q.id] || [];
    
    // Calculate max possible for this question
    const maxPoints = Math.max(...Object.values(q.points));
    if (q.type === 'multi') {
      // For multi-select, max is sum of all positive point options
      const positivePoints = Object.values(q.points).filter(p => p > 0);
      maxPossible += positivePoints.reduce((a, b) => a + b, 0);
    } else {
      maxPossible += maxPoints;
    }

    // Calculate actual score
    selectedOptions.forEach(optionIdx => {
      totalScore += q.points[optionIdx] || 0;
    });
  });

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
