import { generatedQuestions } from './generatedQuestions';
import { csvQuestions } from './csvQuestions';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string; // A, B, C, or D
  explanation?: string;
  category?: string;
}

// Sample PRINCE2 Foundation questions - replace with your PDF content
// Base (manually curated) questions. Auto-generated PDF extracted questions will be appended.
const baseQuestions: Question[] = [
  {
    id: "q1",
    question: "What is the purpose of the Business Case theme?",
    options: [
      "To establish the mechanism to monitor and compare actual achievements against those planned",
      "To establish mechanisms to judge whether a project is and remains desirable, viable and achievable",
      "To define the way in which the project board will be held responsible for the success of the project",
      "To understand the impact of potential events on the project objectives"
    ],
    correctAnswer: "B",
    explanation: "The Business Case theme establishes mechanisms to judge whether a project remains desirable, viable and achievable throughout its lifecycle.",
    category: "Business Case"
  },
  {
    id: "q2",
    question: "According to PRINCE2, which statement about the Project Manager role is CORRECT?",
    options: [
      "The Project Manager must attend every meeting of the Project Board",
      "The Project Manager is responsible for the day-to-day management of the project",
      "The Project Manager is accountable for the success of the project",
      "The Project Manager decides whether the project remains viable"
    ],
    correctAnswer: "B",
    explanation: "The Project Manager is responsible for the day-to-day management of the project on behalf of the Project Board.",
    category: "Organization"
  },
  {
    id: "q3",
    question: "What is defined as 'a set of interrelated activities and decisions over a period of time'?",
    options: [
      "Process",
      "Project",
      "Stage",
      "Work Package"
    ],
    correctAnswer: "A",
    explanation: "A process is defined as 'a set of interrelated activities and decisions over a period of time' in PRINCE2.",
    category: "Processes"
  },
  {
    id: "q4",
    question: "Which is a purpose of the Plans theme?",
    options: [
      "To establish the project's structure of accountability",
      "To assess and control uncertainty",
      "To facilitate communication and control by defining the means of delivering the products",
      "To identify, assess and control any potential changes to the baseline"
    ],
    correctAnswer: "C",
    explanation: "The Plans theme facilitates communication and control by defining the means of delivering the products.",
    category: "Plans"
  },
  {
    id: "q5",
    question: "When should the Business Case be reviewed?",
    options: [
      "At the end of each stage",
      "Only at the start of the project",
      "Continuously throughout the project",
      "Only when requested by the Project Board"
    ],
    correctAnswer: "C",
    explanation: "The Business Case should be reviewed continuously throughout the project to ensure the project remains justified.",
    category: "Business Case"
  },
  {
    id: "q6",
    question: "What level of plan is produced as part of Managing a Stage Boundary?",
    options: [
      "Project Plan",
      "Stage Plan",
      "Team Plan",
      "Exception Plan"
    ],
    correctAnswer: "B",
    explanation: "A Stage Plan for the next stage is produced as part of Managing a Stage Boundary process.",
    category: "Plans"
  },
  {
    id: "q7",
    question: "Which principle helps to ensure continued business justification?",
    options: [
      "Continued Business Justification",
      "Learn from Experience",
      "Defined Roles and Responsibilities",
      "Focus on Products"
    ],
    correctAnswer: "A",
    explanation: "The 'Continued Business Justification' principle directly ensures that projects remain justified throughout their lifecycle.",
    category: "Principles"
  },
  {
    id: "q8",
    question: "What is the composition of the Project Board?",
    options: [
      "Executive and Project Manager",
      "Executive, Senior User and Senior Supplier",
      "Project Manager, Team Manager and Project Assurance",
      "Executive, Project Manager and Change Authority"
    ],
    correctAnswer: "B",
    explanation: "The Project Board consists of Executive, Senior User(s), and Senior Supplier(s).",
    category: "Organization"
  },
  {
    id: "q9",
    question: "Which process includes the activity 'Authorize the project'?",
    options: [
      "Starting up a Project",
      "Directing a Project",
      "Initiating a Project",
      "Managing a Stage Boundary"
    ],
    correctAnswer: "B",
    explanation: "The 'Authorize the project' activity is part of the Directing a Project process.",
    category: "Processes"
  },
  {
    id: "q10",
    question: "What is the minimum number of management stages required for a PRINCE2 project?",
    options: [
      "1",
      "2",
      "3",
      "4"
    ],
    correctAnswer: "B",
    explanation: "A PRINCE2 project requires a minimum of 2 management stages: an initiation stage and at least one subsequent delivery stage.",
    category: "Plans"
  },
  {
    id: "q11",
    question: "Which theme addresses the question 'What is the impact if things go wrong?'",
    options: [
      "Business Case",
      "Risk",
      "Quality",
      "Change"
    ],
    correctAnswer: "B",
    explanation: "The Risk theme addresses potential events that could impact project objectives, including what happens if things go wrong.",
    category: "Risk"
  },
  {
    id: "q12",
    question: "What is recorded in a lessons log?",
    options: [
      "Details of risks identified during the project",
      "Informal lessons that can be applied to future projects",
      "Details of quality activities undertaken",
      "Changes made to the project's products"
    ],
    correctAnswer: "B",
    explanation: "The lessons log records informal lessons that can be applied to future projects and activities.",
    category: "Quality"
  },
  {
    id: "q13",
    question: "Which is a purpose of the Organization theme?",
    options: [
      "To define the way to measure delivery against expectations",
      "To define and establish the project's structure of accountability and responsibilities",
      "To identify, assess and control uncertainty",
      "To establish mechanisms to judge whether the project is desirable, viable and achievable"
    ],
    correctAnswer: "B",
    explanation: "The Organization theme defines and establishes the project's structure of accountability and responsibilities.",
    category: "Organization"
  },
  {
    id: "q14",
    question: "When might a project use team managers?",
    options: [
      "When the project manager needs help with administrative tasks",
      "When specialist skills are required to create products",
      "When work packages are complex or when control needs to be delegated",
      "When the project board requires additional assurance"
    ],
    correctAnswer: "C",
    explanation: "Team managers are appointed when work packages are complex or when the project manager needs to delegate detailed control.",
    category: "Organization"
  },
  {
    id: "q15",
    question: "Which principle ensures that project roles are clearly defined?",
    options: [
      "Learn from Experience",
      "Defined Roles and Responsibilities", 
      "Manage by Stages",
      "Focus on Products"
    ],
    correctAnswer: "B",
    explanation: "The 'Defined Roles and Responsibilities' principle ensures that project roles are clearly defined and understood.",
    category: "Principles"
  },
  {
    id: "q16",
    question: "What is the purpose of Project Assurance?",
    options: [
      "To provide independent oversight of the project on behalf of the Project Board",
      "To manage the day-to-day activities of the project",
      "To create the project's products",
      "To chair the Project Board meetings"
    ],
    correctAnswer: "A",
    explanation: "Project Assurance provides independent oversight of the project on behalf of the Project Board interests.",
    category: "Organization"
  },
  {
    id: "q17",
    question: "Which is created during the Starting up a Project process?",
    options: [
      "Project Brief",
      "Project Initiation Documentation",
      "Project Product Description",
      "Stage Plan"
    ],
    correctAnswer: "A",
    explanation: "The Project Brief is created during the Starting up a Project process.",
    category: "Processes"
  },
  {
    id: "q18",
    question: "What is the recommended approach for applying the Progress theme?",
    options: [
      "Monitor actual achievements against planned achievements",
      "Focus on time and cost only",
      "Review progress monthly",
      "Delegate all monitoring to team managers"
    ],
    correctAnswer: "A",
    explanation: "The Progress theme recommends monitoring actual achievements against planned achievements across all aspects of performance.",
    category: "Progress"
  },
  {
    id: "q19",
    question: "Which role is responsible for ensuring that the project's products meet the needs of the users?",
    options: [
      "Executive",
      "Project Manager",
      "Senior User",
      "Senior Supplier"
    ],
    correctAnswer: "C",
    explanation: "The Senior User is responsible for ensuring that the project's products meet the needs and expectations of the users.",
    category: "Organization"
  },
  {
    id: "q20",
    question: "What should happen to a project if it can no longer be justified?",
    options: [
      "Continue but with reduced scope",
      "Request additional funding",
      "Pause the project temporarily",
      "Close the project prematurely"
    ],
    correctAnswer: "D",
    explanation: "If a project can no longer be justified, it should be closed prematurely to avoid wasting resources.",
    category: "Business Case"
  },
  // Add more questions as needed up to 60+ questions
  {
    id: "q21",
    question: "Which is a responsibility of the Executive?",
    options: [
      "Day-to-day management of the project",
      "Creating the project's products",
      "Overall business assurance of the project",
      "Managing team performance"
    ],
    correctAnswer: "C",
    explanation: "The Executive is responsible for overall business assurance of the project.",
    category: "Organization"
  },
  {
    id: "q22",
    question: "What is the trigger for the Managing a Stage Boundary process?",
    options: [
      "A stage is forecast to exceed tolerance",
      "A stage is approaching its end",
      "A new risk has been identified",
      "The project board requests a review"
    ],
    correctAnswer: "B",
    explanation: "Managing a Stage Boundary process is triggered when a management stage is approaching its end.",
    category: "Processes"
  },
  {
    id: "q23",
    question: "Which PRINCE2 principle is being applied when previous project experiences are used to help make decisions?",
    options: [
      "Focus on Products",
      "Learn from Experience",
      "Defined Roles and Responsibilities",
      "Tailor to Suit the Project Environment"
    ],
    correctAnswer: "B",
    explanation: "The 'Learn from Experience' principle involves using previous project experiences to inform current decisions.",
    category: "Principles"
  },
  {
    id: "q24",
    question: "What is the purpose of the Quality theme?",
    options: [
      "To define the way to measure delivery against expectations",
      "To identify stakeholder communication requirements",
      "To establish the project's approach to risk management",
      "To define roles and responsibilities"
    ],
    correctAnswer: "A",
    explanation: "The Quality theme defines the way to measure delivery against expectations and ensures products are fit for purpose.",
    category: "Quality"
  },
  {
    id: "q25",
    question: "Which statement about tolerances is CORRECT?",
    options: [
      "Tolerances are only set for cost and time",
      "Tolerances provide a range within which a level of management can operate",
      "Tolerances cannot be changed once set",
      "Only the project manager can set tolerances"
    ],
    correctAnswer: "B",
    explanation: "Tolerances provide a range of permissible deviation within which a particular level of management can operate without referring back.",
    category: "Progress"
  }
];

// Final combined question bank (base + generated from PDFs)
export const questionBank: Question[] = [...baseQuestions, ...generatedQuestions, ...csvQuestions];

/** Utility: total number of questions currently available */
export const questionCount = questionBank.length;

/**
 * NOTE: If generatedQuestions stays empty after running extraction, the PDFs may
 * be image-based (scanned). In that case an OCR step is required. Consider
 * integrating Tesseract (server-side) or manually transcribing questions.
 */

/**
 * Options for random question selection
 */
interface RandomQuestionOptions {
  /** Provide a numeric seed for deterministic selection (useful for review / sharing). */
  seed?: number;
  /** Attempt to balance picks across categories (best effort if not divisible). */
  balanceByCategory?: boolean;
}

/**
 * Deterministic pseudo‑random number generator (Mulberry32).
 */
function createRng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ t >>> 15, 1 | t);
    r ^= r + Math.imul(r ^ r >>> 7, 61 | r);
    return ((r ^ r >>> 14) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates in-place shuffle using supplied RNG */
function shuffleInPlace<T>(arr: T[], rng: () => number) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Get a random selection of questions for the exam.
 * Previous implementation used Array.sort(() => 0.5 - Math.random()) which is
 * not guaranteed uniform. This now uses Fisher–Yates for unbiased shuffling.
 *
 * @param count Number of questions requested
 * @param options Optional: seed & category balancing
 */
export function getRandomQuestions(count: number, options: RandomQuestionOptions = {}): Question[] {
  const target = Math.min(Math.max(count, 0), questionBank.length);
  if (target === 0) return [];

  const rng = options.seed !== undefined ? createRng(options.seed) : Math.random;

  if (options.balanceByCategory) {
    // Group by category (undefined grouped under 'uncategorized')
    const groups: Record<string, Question[]> = {};
    for (const q of questionBank) {
      const key = q.category || 'uncategorized';
      (groups[key] ||= []).push(q);
    }
    // Shuffle each group independently
    Object.values(groups).forEach(g => shuffleInPlace(g, rng));
    const categories = Object.keys(groups).sort();
    const selection: Question[] = [];
    // Round‑robin pick
    let exhausted = 0;
    while (selection.length < target && exhausted < categories.length) {
      exhausted = 0;
      for (const cat of categories) {
        const g = groups[cat];
        if (g.length === 0) {
          exhausted++;
          continue;
        }
        if (selection.length < target) {
          selection.push(g.pop()!);
        } else {
          break;
        }
      }
    }
    return selection;
  }

  // Simple path: clone, shuffle, slice
  const cloned = questionBank.slice();
  shuffleInPlace(cloned, rng);
  return cloned.slice(0, target);
}

/**
 * Validate the question bank and return an array of warnings (empty if OK)
 */
export function validateQuestionBank(): string[] {
  const warnings: string[] = [];
  const seen = new Set<string>();
  questionBank.forEach((q, idx) => {
    if (seen.has(q.id)) warnings.push(`Duplicate id '${q.id}' at index ${idx}`);
    seen.add(q.id);
    if (q.options.length !== 4) warnings.push(`Question '${q.id}' should have exactly 4 options (has ${q.options.length}).`);
    if (!/[ABCD]/.test(q.correctAnswer)) warnings.push(`Question '${q.id}' has invalid correctAnswer '${q.correctAnswer}'.`);
    const correctIndex = q.correctAnswer.charCodeAt(0) - 65;
    if (!q.options[correctIndex]) warnings.push(`Question '${q.id}' correctAnswer index out of range.`);
  });
  return warnings;
}

/**
 * Get questions by category
 */
export function getQuestionsByCategory(category: string): Question[] {
  return questionBank.filter(q => q.category === category);
}

/**
 * Get all available categories
 */
export function getCategories(): string[] {
  const categories = questionBank
    .map(q => q.category)
    .filter((cat): cat is string => cat !== undefined);
  
  return Array.from(new Set(categories)).sort();
}
