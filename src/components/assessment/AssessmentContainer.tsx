import { useState, useCallback, useMemo } from 'react';
import { getQuestionsForIndustry, Question, companyTypes } from '@/data/questions';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { ResultsView } from './ResultsView';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Step = 'intro' | 'questions' | 'results';

export function AssessmentContainer() {
  const [step, setStep] = useState<Step>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [showIndustryDialog, setShowIndustryDialog] = useState(false);

  // Get questions based on selected industry
  const questions = useMemo(() => {
    if (!selectedIndustry) return [];
    return getQuestionsForIndustry(selectedIndustry);
  }, [selectedIndustry]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleOptionSelect = useCallback((optionIndex: number) => {
    const questionId = currentQuestion.id;
    const currentAnswers = answers[questionId] || [];

    if (currentQuestion.type === 'single') {
      setAnswers({ ...answers, [questionId]: [optionIndex] });
    } else {
      if (currentAnswers.includes(optionIndex)) {
        setAnswers({
          ...answers,
          [questionId]: currentAnswers.filter(i => i !== optionIndex)
        });
      } else {
        setAnswers({
          ...answers,
          [questionId]: [...currentAnswers, optionIndex]
        });
      }
    }
  }, [answers, currentQuestion]);

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // After all questions, go to results
      setStep('results');
    }
  };

  const handlePrevious = () => {
    if (step === 'questions') {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      } else {
        // Go back to intro if on first question
        setStep('intro');
      }
    }
  };

  const handleStart = () => {
    // Open industry selection dialog
    setShowIndustryDialog(true);
  };

  const handleIndustryConfirm = () => {
    if (selectedIndustry) {
      // Reset answers when starting new assessment
      setAnswers({});
      setCurrentQuestionIndex(0);
      setShowIndustryDialog(false);
      setStep('questions');
    }
  };

  const handleRestart = () => {
    setStep('intro');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSelectedIndustry('');
    setShowIndustryDialog(false);
  };

  const currentAnswers = answers[currentQuestion?.id] || [];
  const hasAnswer = currentAnswers.length > 0;

  if (step === 'intro') {
    return (
      <>
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-20 text-center animate-fade-in">
          <div className="bg-card rounded-2xl p-8 md:p-12 card-shadow border border-border">
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground mb-4">
              How mature is your risk management framework?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Take this free assessment to evaluate your organization's risk management maturity. 
              You'll receive an instant score compared to industry benchmarks, along with personalized 
              insights and recommendations.
            </p>
            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Industry-specific questions</p>
                  <p className="text-sm text-muted-foreground">Tailored to your organization type</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Instant results</p>
                  <p className="text-sm text-muted-foreground">Get your maturity score immediately</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Anonymous & private</p>
                  <p className="text-sm text-muted-foreground">Your responses are not stored or shared</p>
                </div>
              </div>
            </div>
            <Button size="lg" onClick={handleStart} className="w-full sm:w-auto px-8">
              Start Assessment
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Industry Selection Dialog */}
        <Dialog open={showIndustryDialog} onOpenChange={setShowIndustryDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Select Your Industry</DialogTitle>
              <DialogDescription>
                Choose your industry to receive industry-specific risk maturity questions. 
                The questions will be tailored to your organization type.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="industry-select" className="text-base font-medium mb-2 block">
                Industry <span className="text-destructive">*</span>
              </Label>
              {companyTypes.length === 0 ? (
                <div className="p-4 border border-destructive rounded-md bg-destructive/10">
                  <p className="text-sm text-destructive">
                    Unable to load industries. Please refresh the page.
                  </p>
                </div>
              ) : (
                <Select
                  value={selectedIndustry}
                  onValueChange={setSelectedIndustry}
                >
                  <SelectTrigger id="industry-select" className="h-12 w-full">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {companyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowIndustryDialog(false);
                  setSelectedIndustry('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleIndustryConfirm}
                disabled={!selectedIndustry}
              >
                Start Assessment
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (step === 'results') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <ResultsView answers={answers} questions={questions} onRestart={handleRestart} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <ProgressBar
        current={currentQuestionIndex + 1}
        total={totalQuestions}
        className="mb-8"
      />

      <div className="bg-card rounded-2xl p-6 md:p-10 card-shadow border border-border min-h-[400px] flex flex-col">
        <div className="flex-1">
          {currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              selectedOptions={currentAnswers}
              onSelect={handleOptionSelect}
            />
          )}
        </div>

        {/* Navigation */}
        <div className={cn(
          "flex mt-8 pt-6 border-t border-border",
          currentQuestionIndex === 0 ? "justify-end" : "justify-between"
        )}>
          {currentQuestionIndex > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
          )}

          <Button
            onClick={handleNext}
            disabled={!hasAnswer}
            className="gap-2"
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'Continue' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
