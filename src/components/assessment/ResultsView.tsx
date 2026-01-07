import { calculateScore, getMaturityLevel, questions } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, TrendingUp, RotateCcw } from 'lucide-react';

interface ResultsViewProps {
  answers: Record<number, number[]>;
  onRestart: () => void;
}

export function ResultsView({ answers, onRestart }: ResultsViewProps) {
  const score = calculateScore(answers);
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

    // Check specific questions for insights
    if (answers[1]?.includes(0)) {
      insights.positive.push('Strong Enterprise Risk Management integration');
    } else {
      insights.improvements.push('Consider implementing integrated Enterprise Risk Management');
    }

    if (answers[2]?.[0] === 0) {
      insights.positive.push('Unified ERM software platform');
    } else if (answers[2]?.[0] !== 0) {
      insights.improvements.push('Consolidate risk management tools into a single platform');
    }

    if (answers[6]?.[0] === 0 && answers[6]?.includes(3)) {
      insights.positive.push('Open risk culture with ethical policies');
    } else {
      insights.improvements.push('Develop a more open and transparent risk culture');
    }

    if (answers[7]?.[0] === 0) {
      insights.positive.push('Proactive cyber security measures');
    } else {
      insights.improvements.push('Strengthen cyber security mitigation efforts');
    }

    if (answers[8]?.[0] === 0) {
      insights.positive.push('Active board involvement in risk management');
    } else {
      insights.improvements.push('Increase board engagement with risk oversight');
    }

    if (answers[12]?.[0] === 0) {
      insights.positive.push('Robust business continuity framework');
    } else {
      insights.improvements.push('Establish a comprehensive business continuity plan');
    }

    if (answers[15]?.[0] === 0) {
      insights.positive.push('Risk management integrated with strategy');
    } else {
      insights.improvements.push('Align risk management with strategic planning');
    }

    return insights;
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
