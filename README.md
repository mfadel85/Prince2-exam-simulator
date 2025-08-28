# PRINCE2 Foundation Exam Simulator

A modern, responsive web application for practicing PRINCE2 Foundation certification exams. Built with Next.js, TypeScript, and Tailwind CSS, optimized for Cloudflare Pages deployment.

## Features

### 🎯 **Exam Functionality**
- **Customizable Question Count**: Choose from 10 to 60 questions
- **Flexible Time Limits**: Set exam duration from 15 to 90 minutes
- **Timer with Visual Alerts**: Real-time countdown with urgent warnings
- **Progress Tracking**: Visual progress bar and answered question counter
- **Comprehensive Results**: Detailed scoring and performance analysis

### 📱 **Responsive Design**
- **Mobile-First**: Optimized for phones, tablets, and desktops
- **Touch-Friendly**: Large buttons and intuitive navigation
- **Modern UI**: Clean design with Tailwind CSS

### 🚀 **Technical Features**
- **Static Site Generation**: Optimized for Cloudflare Pages
- **TypeScript**: Full type safety and better development experience
- **Modular Architecture**: Easy to extend and maintain
- **Sample Question Bank**: 25+ PRINCE2 Foundation practice questions included
  
### 🔀 **Improved Randomization**
- Unbiased Fisher–Yates shuffle (replaces previous naive sort randomization)
- Optional deterministic seeding for reproducible exams
- Optional balanced selection across categories

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ExamSimulatorCore
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Taking an Exam
1. **Configure Exam**: Select number of questions and time limit
2. **Answer Questions**: Navigate through questions using Previous/Next buttons
3. **Monitor Progress**: Watch the timer and progress indicators
4. **Finish Exam**: Complete all questions or finish early
5. **Review Results**: See your score, pass/fail status, and detailed breakdown

### Customizing Questions

Replace the sample questions in `src/data/questions.ts` with your own:

```typescript
export const questionBank: Question[] = [
  {
    id: "q1",
    question: "Your question text here",
    options: [
      "Option A",
      "Option B", 
      "Option C",
      "Option D"
    ],
    correctAnswer: "B", // A, B, C, or D
    explanation: "Explanation of the correct answer",
    category: "Question Category"
  }
  // Add more questions...
];
```

## Deployment

### Cloudflare Pages

Static export is enabled (`output: 'export'`). Use Cloudflare Pages with:

1. **Build command**: `npm run pages:build`
2. **Deploy command**: `npm run deploy` (required field; it is a no‑op that returns success)
3. **Output directory**: `out`
4. **Node version**: 18+ (set in Pages settings if needed)

The build script first runs `next build` then `next export` via `pages:build`. The deploy step is a placeholder because Pages requires a deploy command if specified; static assets are already in `out/`.

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server (local testing)
npm run start

# Lint code
npm run lint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main page component
├── components/           # Reusable components
│   ├── ExamInterface.tsx # Main exam interface
│   ├── ExamResults.tsx   # Results display
│   ├── ExamSetup.tsx     # Initial configuration
│   ├── ProgressBar.tsx   # Progress indicator
│   ├── QuestionCard.tsx  # Question display
│   └── Timer.tsx         # Timer component
└── data/
    └── questions.ts      # Question bank and utilities
```

## Configuration

### Environment Variables
No environment variables required - fully client-side application.

### Customization Options

- **Question Bank**: Edit `src/data/questions.ts`
- **Styling**: Modify Tailwind classes in components
- **Timer Settings**: Adjust time options in `ExamSetup.tsx`
- **Passing Score**: Change pass threshold in `ExamResults.tsx`
 - **Randomization**: Call `getRandomQuestions(count, { seed, balanceByCategory })`
 - **PDF Import**: Place PDFs in `src/exams/` then run `npm run extract:pdfs`

## Random Question Selection Algorithm
## Importing Questions from PDFs

1. Copy exam PDFs into `src/exams/`.
2. Run:
```bash
npm run extract:pdfs
```
3. Script parses questions into `src/data/generatedQuestions.ts` and merges with base questions.

Heuristics:
- Looks for lines starting with `<number>.` for question starts.
- Options detected via prefixes `A)`, `B)`, `C)`, `D)` (various punctuation supported).
- Attempts to read answers via `Correct Answer:` or `Answer:` tokens (if present).
- If no explicit answer found, defaults to `A` (review required).

Review & QA:
- Open `generatedQuestions.ts` after extraction.
- Run a quick validation in a REPL:
```ts
import { validateQuestionBank } from '@/data/questions';
console.log(validateQuestionBank());
```

You can safely commit the generated file for reproducibility.

The function `getRandomQuestions(count, options)` implements an unbiased Fisher–Yates shuffle.

```ts
getRandomQuestions(20); // Simple random 20
getRandomQuestions(60, { seed: 1234 }); // Deterministic 60 (same seed -> same set)
getRandomQuestions(40, { balanceByCategory: true }); // Tries to evenly distribute categories
getRandomQuestions(50, { seed: Date.now(), balanceByCategory: true }); // Seed + balance
```

Options:
- `seed?: number` — Provide a numeric seed to reproduce a selection (e.g. for review).
- `balanceByCategory?: boolean` — Distributes picks round‑robin across categories.

Implementation details:
1. If `balanceByCategory` is true: group questions by category, independently shuffle each group, then pick round‑robin until the requested count is reached or all groups are exhausted.
2. Otherwise: clone full array, perform Fisher–Yates shuffle with either `Math.random` or a deterministic Mulberry32 seeded PRNG, and slice the first N.
3. This avoids bias present in `array.sort(() => 0.5 - Math.random())`.

You can validate the integrity of the bank:
```ts
import { validateQuestionBank } from '@/data/questions';
console.log(validateQuestionBank()); // [] means no issues
```

## PRINCE2 Foundation Info

- **Pass Mark**: 55% (33/60 questions in full exam)
- **Exam Duration**: 60 minutes for 60 questions
- **Question Types**: Multiple choice with 4 options each
- **Categories**: Principles, Themes, Processes, Organization

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add your questions to the question bank
5. Test thoroughly
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support:
1. Check existing issues in the repository
2. Create a new issue with detailed information
3. Include browser version and steps to reproduce any bugs

---

**Built with ❤️ for PRINCE2 certification preparation**
