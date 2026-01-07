import { useState, useCallback, useMemo } from 'react';
import { getQuestionsForIndustry, Question } from '@/data/questions';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { CompanyInfoForm, CompanyInfo } from './CompanyInfoForm';
import { ResultsView } from './ResultsView';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'intro' | 'company' | 'questions' | 'results';

export function AssessmentContainer() {
  const [step, setStep] = useState<Step>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyType: '',
    turnover: '',
    employees: ''
  });

  // Get questions based on company type
  const questions = useMemo(() => {
    if (!companyInfo.companyType) return [];
    return getQuestionsForIndustry(companyInfo.companyType);
  }, [companyInfo.companyType]);

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
      setStep('company');
    }
  };

  const handlePrevious = () => {
    if (step === 'questions') {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      } else {
        setStep('company');
      }
    } else if (step === 'company') {
      setStep('intro');
    }
  };

  const handleStart = () => {
    setStep('company');
    setCurrentQuestionIndex(0);
  };

  const handleCompanyInfoNext = () => {
    if (companyInfo.companyType) {
      setStep('questions');
      setCurrentQuestionIndex(0);
    }
  };

  const handleSubmit = () => {
    setStep('results');
  };

  const handleRestart = () => {
    setStep('intro');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCompanyInfo({ companyType: '', turnover: '', employees: '' });
  };

  const currentAnswers = answers[currentQuestion?.id] || [];
  const hasAnswer = currentAnswers.length > 0;
  const hasCompanyInfo = companyInfo.companyType && companyInfo.turnover && companyInfo.employees;

  if (step === 'intro') {
    return (
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
    );
  }

  if (step === 'results') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <ResultsView answers={answers} questions={questions} onRestart={handleRestart} />
      </div>
    );
  }

  if (step === 'company') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-card rounded-2xl p-6 md:p-10 card-shadow border border-border min-h-[400px] flex flex-col">
          <div className="flex-1">
            <CompanyInfoForm
              data={companyInfo}
              onChange={setCompanyInfo}
            />
          </div>

          {/* Navigation */}
          <div className="flex mt-8 pt-6 border-t border-border justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <Button
              onClick={handleCompanyInfoNext}
              disabled={!companyInfo.companyType}
              className="gap-2"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-card rounded-2xl p-6 md:p-10 card-shadow border border-border text-center">
          <p className="text-muted-foreground">Please select a company type to begin the assessment.</p>
        </div>
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
