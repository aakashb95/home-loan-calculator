import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formatIndianCurrency = (num: number): string => {
  const lakhs = 100000;
  const crores = 10000000;
  if (num >= crores) {
    return (num / crores).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Cr";
  } else if (num >= lakhs) {
    return (num / lakhs).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " L";
  } else {
    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};

export const HomeBuyingCalculator: React.FC = () => {
  const [yourSalary, setYourSalary] = useState<string>('0');
  const [spouseSalary, setSpouseSalary] = useState<string>('0');
  const [currentRent, setCurrentRent] = useState<string>('0');
  const [loanTerm, setLoanTerm] = useState<string>('20');
  const [interestRate, setInterestRate] = useState<string>('8');
  const [downPaymentPercentage, setDownPaymentPercentage] = useState<number>(20);
  const [emiPercentage, setEmiPercentage] = useState<number>(30);
  const [affordableHomePrice, setAffordableHomePrice] = useState<number>(0);
  const [emi, setEmi] = useState<number>(0);
  const [totalAmountPaid, setTotalAmountPaid] = useState<number>(0);
  const [showExplainer, setShowExplainer] = useState<boolean>(false);

  const [desiredHomePrice, setDesiredHomePrice] = useState<string>('0');
  const [requiredIncome, setRequiredIncome] = useState<number>(0);
  const [totalAmountPaidDesired, setTotalAmountPaidDesired] = useState<number>(0);
  const [emiDesired, setEmiDesired] = useState<number>(0);

  const [showEmiAlert, setShowEmiAlert] = useState<boolean>(false);

  const calculateAffordability = useCallback((): void => {
    const totalMonthlySalary = parseFloat(yourSalary) + parseFloat(spouseSalary);
    const loanTermYears = parseFloat(loanTerm);
    const annualInterestRate = parseFloat(interestRate) / 100;

    const maxEMI = totalMonthlySalary * (emiPercentage / 100);

    const monthlyInterestRate = annualInterestRate / 12;
    const numberOfPayments = loanTermYears * 12;
    const maxLoanAmount = maxEMI * ((1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments)) / monthlyInterestRate);

    const totalAffordablePrice = maxLoanAmount / (1 - (downPaymentPercentage / 100));
    setAffordableHomePrice(totalAffordablePrice);

    const calculatedEMI = (maxLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    setEmi(calculatedEMI);

    const totalPaid = calculatedEMI * numberOfPayments + (totalAffordablePrice * (downPaymentPercentage / 100));
    setTotalAmountPaid(totalPaid);
  }, [yourSalary, spouseSalary, loanTerm, interestRate, emiPercentage, downPaymentPercentage]);

  const calculateRequiredIncome = useCallback((): void => {
    const homePriceValue = parseFloat(desiredHomePrice);
    const loanTermYears = parseFloat(loanTerm);
    const annualInterestRate = parseFloat(interestRate) / 100;

    const loanAmount = homePriceValue * (1 - (downPaymentPercentage / 100));
    const monthlyInterestRate = annualInterestRate / 12;
    const numberOfPayments = loanTermYears * 12;

    const monthlyEMI = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    const requiredMonthlyIncome = monthlyEMI / (emiPercentage / 100);
    setRequiredIncome(requiredMonthlyIncome);
    setEmiDesired(monthlyEMI);

    const totalPaid = monthlyEMI * numberOfPayments + (homePriceValue * (downPaymentPercentage / 100));
    setTotalAmountPaidDesired(totalPaid);
  }, [desiredHomePrice, loanTerm, interestRate, downPaymentPercentage, emiPercentage]);

  useEffect(() => {
    calculateAffordability();
  }, [yourSalary, spouseSalary, currentRent, loanTerm, interestRate, downPaymentPercentage, emiPercentage, calculateAffordability]);

  useEffect(() => {
    calculateRequiredIncome();
  }, [desiredHomePrice, loanTerm, interestRate, downPaymentPercentage, emiPercentage, calculateRequiredIncome]);

  useEffect(() => {
    if (emiPercentage > 50) {
      setShowEmiAlert(true);
    } else {
      setShowEmiAlert(false);
    }
  }, [emiPercentage]);

  const Explainer: React.FC = () => (
    <Alert className="mt-4">
      <AlertTitle>Understanding Home Affordability and Loan Calculations in India:</AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li><b>Affordable Home Price:</b> The maximum property value you can finance based on your income and chosen EMI percentage. In India, this often determines whether you can buy in prime areas or upcoming localities.</li>
          <li><b>EMI (Equated Monthly Installment):</b> Your monthly loan repayment, including principal and interest. This is crucial for budgeting in the Indian context, where EMIs are a significant part of monthly expenses.</li>
          <li><b>Total Amount Paid:</b> Includes the down payment and all EMIs over the loan term. In India, this can often be 1.5 to 2 times the original loan amount due to long loan tenures.</li>
          <li><b>Down Payment:</b> Usually 10-20% of the property value in India. A larger down payment can help secure better interest rates from banks and NBFCs.</li>
          <li><b>Loan Term:</b> Typically 15-30 years in India. Longer terms are popular as they reduce EMI burden, but increase overall interest paid.</li>
          <li><b>Interest Rate:</b> Can vary significantly between banks and NBFCs in India. Even a 0.5% difference can greatly impact long-term costs.</li>
          <li><b>EMI as % of Income:</b> Most Indian lenders prefer this to be under 50% of your monthly income. Exceeding this may require a co-applicant or additional income proof.</li>
          <li><b>Additional Costs:</b> Factor in stamp duty (varies by state), registration charges, GST on under-construction properties, and society maintenance fees.</li>
          <li><b>Future Planning:</b> Consider potential job changes, children's education costs, and retirement planning alongside your home loan commitment.</li>
          <li><b>Professional Advice:</b> Consult with SEBI-registered financial advisors and compare offers from multiple banks for the best deal in the Indian market.</li>
        </ul>
      </AlertDescription>
    </Alert>
  );

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Home Buying Calculator</h1>
      {showEmiAlert && (
        <Alert variant="destructive" className="mb-4 animate-pulse">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            An EMI percentage above 50% of your income is very high and may lead to financial stress.
          </AlertDescription>
        </Alert>
      )}
      <Tabs defaultValue="afford" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="afford" className="text-sm">What Home Can I Afford?</TabsTrigger>
          <TabsTrigger value="income" className="text-sm">Income Needed</TabsTrigger>
        </TabsList>
        <TabsContent value="afford">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">What Home Can I Afford?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Monthly Salary (₹)</label>
                  <Input
                    type="number"
                    value={yourSalary}
                    onChange={(e) => setYourSalary(e.target.value)}
                    placeholder="Your salary"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spouse&apos;s Monthly Salary (₹)</label>
                  <Input
                    type="number"
                    value={spouseSalary}
                    onChange={(e) => setSpouseSalary(e.target.value)}
                    placeholder="Spouse's salary"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Rent (₹)</label>
                  <Input
                    type="number"
                    value={currentRent}
                    onChange={(e) => setCurrentRent(e.target.value)}
                    placeholder="Your current rent"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (years)</label>
                  <Input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    placeholder="Loan term"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                  <Input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="Interest rate"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Down Payment: {downPaymentPercentage}% of home price
                  </label>
                  <Slider
                    value={[downPaymentPercentage]}
                    onValueChange={(values) => setDownPaymentPercentage(values[0])}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    EMI as % of Income: {emiPercentage}%
                  </label>
                  <Slider
                    value={[emiPercentage]}
                    onValueChange={(values) => setEmiPercentage(values[0])}
                    max={70}
                    step={1}
                    className={`w-full ${emiPercentage > 50 ? 'bg-red-200' : ''}`}
                  />
                </div>
                {affordableHomePrice > 0 && (
                  <div className="mt-4 p-4 bg-green-100 rounded-md text-sm">
                    <p className="text-green-800 font-semibold">You can afford a home worth: ₹{formatIndianCurrency(affordableHomePrice)}</p>
                    <p className="text-green-800">Monthly EMI: ₹{formatIndianCurrency(emi)}</p>
                    <p className="text-green-800">Your Current Rent: ₹{formatIndianCurrency(parseFloat(currentRent))}</p>
                    <p className="text-green-800 font-semibold mt-2">
                      {emi > parseFloat(currentRent)
                        ? `EMI is ₹${formatIndianCurrency(emi - parseFloat(currentRent))} more than your rent.`
                        : `EMI is ₹${formatIndianCurrency(parseFloat(currentRent) - emi)} less than your rent.`}
                    </p>
                    <p className="text-green-800 font-semibold mt-2">Total amount paid over {loanTerm} years: ₹{formatIndianCurrency(totalAmountPaid)}</p>
                  </div>
                )}
                <button onClick={() => setShowExplainer(!showExplainer)} className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {showExplainer ? 'Hide' : 'Show'} Explainer
                </button>
                {showExplainer && <Explainer />}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Income Needed for My Dream Home</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Desired Home Price (₹)</label>
                  <Input
                    type="number"
                    value={desiredHomePrice}
                    onChange={(e) => setDesiredHomePrice(e.target.value)}
                    placeholder="Enter desired home price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loan Term (years)</label>
                  <Input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    placeholder="Loan term"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
                  <Input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="Interest rate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Down Payment: {downPaymentPercentage}% of home price</label>
                  <Slider
                    value={[downPaymentPercentage]}
                    onValueChange={(values) => setDownPaymentPercentage(values[0])}
                    max={50}
                    step={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">EMI as % of Income: {emiPercentage}%</label>
                  <Slider
                    value={[emiPercentage]}
                    onValueChange={(values) => setEmiPercentage(values[0])}
                    max={70}
                    step={1}
                    className={`w-full ${emiPercentage > 50 ? 'bg-red-200' : ''}`}
                  />
                </div>
                {requiredIncome > 0 && (
                  <div className="mt-4 p-4 bg-blue-100 rounded-md">
                    <p className="text-blue-800 font-semibold">Required Monthly Income: ₹{formatIndianCurrency(requiredIncome)}</p>
                    <p className="text-blue-800">Required Annual Income: ₹{formatIndianCurrency(requiredIncome * 12)}</p>
                    <p className="text-blue-800">Monthly EMI: ₹{formatIndianCurrency(emiDesired)}</p>
                    <p className="text-blue-800 mt-2">This assumes EMI is {emiPercentage}% of your monthly income.</p>
                    <p className="text-blue-800 font-semibold mt-2">Total amount paid over {loanTerm} years: ₹{formatIndianCurrency(totalAmountPaidDesired)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeBuyingCalculator;