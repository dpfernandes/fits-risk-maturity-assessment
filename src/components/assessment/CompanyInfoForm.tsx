import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { companyTypes, annualTurnover, employeeRanges } from '@/data/questions';
import { cn } from '@/lib/utils';

export interface CompanyInfo {
  companyType: string;
  turnover: string;
  employees: string;
}

interface CompanyInfoFormProps {
  data: CompanyInfo;
  onChange: (data: CompanyInfo) => void;
  className?: string;
}

export function CompanyInfoForm({ data, onChange, className }: CompanyInfoFormProps) {
  // Ensure companyTypes is available
  if (companyTypes.length === 0) {
    console.warn('Company types not loaded. Available types:', companyTypes);
  }

  return (
    <div className={cn("animate-fade-in space-y-6", className)}>
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2 font-serif">
          Select Your Industry
        </h2>
        <p className="text-muted-foreground mb-6">
          Choose your industry to receive industry-specific risk maturity questions. Additional information is optional and helps us provide more relevant insights. Your data remains anonymous.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="company-type" className="text-base font-medium">
            Select Your Industry <span className="text-destructive">*</span>
          </Label>
          <p className="text-sm text-muted-foreground mb-4">
            Choose the industry that best matches your organization. The questions will be tailored to your industry.
          </p>
          {companyTypes.length === 0 ? (
            <div className="p-4 border border-destructive rounded-md bg-destructive/10">
              <p className="text-sm text-destructive">
                Unable to load industries. Please refresh the page.
              </p>
            </div>
          ) : (
            <Select
              value={data.companyType}
              onValueChange={(value) => {
                onChange({ ...data, companyType: value });
              }}
            >
              <SelectTrigger id="company-type" className="h-12 w-full">
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

        <div className="space-y-2">
          <Label htmlFor="turnover" className="text-base font-medium">
            Annual Turnover <span className="text-muted-foreground font-normal">(Optional)</span>
          </Label>
          <Select
            value={data.turnover}
            onValueChange={(value) => onChange({ ...data, turnover: value })}
          >
            <SelectTrigger id="turnover" className="h-12">
              <SelectValue placeholder="Select annual turnover (optional)" />
            </SelectTrigger>
            <SelectContent>
              {annualTurnover.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="employees" className="text-base font-medium">
            Number of Employees <span className="text-muted-foreground font-normal">(Optional)</span>
          </Label>
          <Select
            value={data.employees}
            onValueChange={(value) => onChange({ ...data, employees: value })}
          >
            <SelectTrigger id="employees" className="h-12">
              <SelectValue placeholder="Select employee range (optional)" />
            </SelectTrigger>
            <SelectContent>
              {employeeRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
