import { calculateScore, getMaturityLevel, Question } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, TrendingUp, RotateCcw } from 'lucide-react';

interface ResultsViewProps {
  answers: Record<number, number[]>;
  questions: Question[];
  onRestart: () => void;
}

export function ResultsView({ answers, questions, onRestart }: ResultsViewProps) {
  const score = calculateScore(answers, questions);
  const { level, description, color } = getMaturityLevel(score);

  const getScoreColor = () => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-amber-500';
    return 'text-destructive';
  };

  const getProgressColor = () => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-primary';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-destructive';
  };

  // Analyze answers for insights
  const getInsights = () => {
    const insights: { positive: string[]; improvements: string[] } = {
      positive: [],
      improvements: []
    };

    // Analyze high and low scoring questions
    questions.forEach((q) => {
      const selectedOptions = answers[q.id] || [];
      if (selectedOptions.length > 0) {
        const selectedOptionIndex = selectedOptions[0];
        const answerPoints = q.points[selectedOptionIndex] || 0;
        const weightedScore = q.weight * answerPoints;
        const maxWeightedScore = q.weight * Math.max(...Object.values(q.points));
        
        // If score is high (>= 80% of max for this question)
        if (weightedScore >= maxWeightedScore * 0.8) {
          insights.positive.push(`Strong performance in: ${q.question.substring(0, 60)}...`);
        } else if (weightedScore < maxWeightedScore * 0.5) {
          insights.improvements.push(`Consider improving: ${q.question.substring(0, 60)}...`);
        }
      } else {
        insights.improvements.push(`Missing response: ${q.question.substring(0, 60)}...`);
      }
    });

    // Limit to top insights
    return {
      positive: insights.positive.slice(0, 4),
      improvements: insights.improvements.slice(0, 4)
    };
  };

  const insights = getInsights();

  return (
    <div className="animate-fade-in space-y-8 max-w-3xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">
          Your Risk Maturity Score
        </h2>
        <p className="text-muted-foreground">
          Based on your {questions.length} responses
        </p>
      </div>

      {/* Score Circle */}
      <div className="flex justify-center py-8">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${score * 2.83} 283`}
              className={cn("transition-all duration-1000", getProgressColor())}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-5xl font-bold", getScoreColor())}>{score}%</span>
            <span className={cn("text-lg font-semibold mt-1", color)}>{level}</span>
          </div>
        </div>
      </div>

      <p className="text-center text-lg text-muted-foreground max-w-xl mx-auto">
        {description}
      </p>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-6 pt-4">
        {/* Strengths */}
        <div className="bg-card rounded-xl p-6 card-shadow border border-border">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <h3 className="text-lg font-semibold">Your Strengths</h3>
          </div>
          <ul className="space-y-3">
            {insights.positive.length > 0 ? (
              insights.positive.slice(0, 4).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">
                Complete the assessment to see your strengths
              </li>
            )}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-card rounded-xl p-6 card-shadow border border-border">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold">Areas to Improve</h3>
          </div>
          <ul className="space-y-3">
            {insights.improvements.length > 0 ? (
              insights.improvements.slice(0, 4).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">
                Great job! You're doing well across all areas
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4 pt-6">
        <Button
          onClick={onRestart}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Assessment
        </Button>
        <p className="text-xs text-muted-foreground text-center max-w-md">
          Your responses are anonymous and not stored. Results are for your internal use only.
        </p>
      </div>
    </div>
  );
}
