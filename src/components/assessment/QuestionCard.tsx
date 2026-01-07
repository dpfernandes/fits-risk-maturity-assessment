import { Question } from '@/data/questions';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  selectedOptions: number[];
  onSelect: (optionIndex: number) => void;
  className?: string;
}

export function QuestionCard({ question, selectedOptions, onSelect, className }: QuestionCardProps) {
  // All questions are single-select
  return (
    <div className={cn("animate-fade-in", className)}>
      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6 font-serif">
        {question.id}. {question.question}
      </h2>
      <RadioGroup
        value={selectedOptions[0]?.toString() || ''}
        onValueChange={(value) => onSelect(parseInt(value))}
        className="space-y-3"
      >
        {question.options.map((option, index) => (
          <label
            key={index}
            htmlFor={`option-${question.id}-${index}`}
            className={cn(
              "flex items-start space-x-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:border-primary/50 hover:bg-primary/5",
              selectedOptions.includes(index)
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            )}
          >
            <RadioGroupItem value={index.toString()} id={`option-${question.id}-${index}`} className="mt-1" />
            <span className="text-base leading-relaxed flex-1">
              {option}
            </span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
