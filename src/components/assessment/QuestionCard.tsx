import { Question } from '@/data/questions';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  selectedOptions: number[];
  onSelect: (optionIndex: number) => void;
  className?: string;
}

export function QuestionCard({ question, selectedOptions, onSelect, className }: QuestionCardProps) {
  if (question.type === 'single') {
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
            <div
              key={index}
              className={cn(
                "flex items-start space-x-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:border-primary/50 hover:bg-primary/5",
                selectedOptions.includes(index)
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
              )}
              onClick={() => onSelect(index)}
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
              <Label
                htmlFor={`option-${index}`}
                className="text-base leading-relaxed cursor-pointer flex-1"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  return (
    <div className={cn("animate-fade-in", className)}>
      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2 font-serif">
        {question.id}. {question.question}
      </h2>
      <p className="text-muted-foreground mb-6 text-sm">Select all that apply</p>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start space-x-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:border-primary/50 hover:bg-primary/5",
              selectedOptions.includes(index)
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            )}
            onClick={() => onSelect(index)}
          >
            <Checkbox
              id={`option-${index}`}
              checked={selectedOptions.includes(index)}
              onCheckedChange={() => onSelect(index)}
              className="mt-1"
            />
            <Label
              htmlFor={`option-${index}`}
              className="text-base leading-relaxed cursor-pointer flex-1"
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
