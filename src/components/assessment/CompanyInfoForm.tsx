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
  return (
    <div className={cn("animate-fade-in space-y-6", className)}>
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2 font-serif">
          Tell us about your organization
        </h2>
        <p className="text-muted-foreground mb-6">
          This information helps us provide more relevant insights. Your data remains anonymous.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="company-type" className="text-base font-medium">
            Company Type
          </Label>
          <Select
            value={data.companyType}
            onValueChange={(value) => onChange({ ...data, companyType: value })}
          >
            <SelectTrigger id="company-type" className="h-12">
              <SelectValue placeholder="Select company type" />
            </SelectTrigger>
            <SelectContent>
              {companyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="turnover" className="text-base font-medium">
            Annual Turnover
          </Label>
          <Select
            value={data.turnover}
            onValueChange={(value) => onChange({ ...data, turnover: value })}
          >
            <SelectTrigger id="turnover" className="h-12">
              <SelectValue placeholder="Select annual turnover" />
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
            Number of Employees
          </Label>
          <Select
            value={data.employees}
            onValueChange={(value) => onChange({ ...data, employees: value })}
          >
            <SelectTrigger id="employees" className="h-12">
              <SelectValue placeholder="Select employee range" />
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
