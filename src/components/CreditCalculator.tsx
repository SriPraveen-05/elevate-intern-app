import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, Award } from "lucide-react";

const CreditCalculator = () => {
  const [duration, setDuration] = useState("12");
  const [evaluation, setEvaluation] = useState("excellent");
  const [logbookCompletion, setLogbookCompletion] = useState("95");
  const [calculatedCredits, setCalculatedCredits] = useState<number | null>(null);

  const calculateCredits = () => {
    const weeks = parseInt(duration);
    const completionRate = parseInt(logbookCompletion);
    
    let baseCredits = 0;
    if (weeks >= 8 && weeks < 12) baseCredits = 2;
    else if (weeks >= 12 && weeks < 16) baseCredits = 4;
    else if (weeks >= 16) baseCredits = 6;

    let evaluationMultiplier = 1;
    if (evaluation === "excellent") evaluationMultiplier = 1.2;
    else if (evaluation === "good") evaluationMultiplier = 1.0;
    else if (evaluation === "average") evaluationMultiplier = 0.8;

    const completionFactor = completionRate / 100;

    const credits = Math.round(baseCredits * evaluationMultiplier * completionFactor);
    setCalculatedCredits(credits);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Credit Calculator
        </CardTitle>
        <CardDescription>NEP-based credit assignment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Internship Duration (weeks)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="12"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="evaluation">Performance Evaluation</Label>
            <Select value={evaluation} onValueChange={setEvaluation}>
              <SelectTrigger id="evaluation">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent (A)</SelectItem>
                <SelectItem value="good">Good (B)</SelectItem>
                <SelectItem value="average">Average (C)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logbook">Logbook Completion (%)</Label>
            <Input
              id="logbook"
              type="number"
              placeholder="95"
              value={logbookCompletion}
              onChange={(e) => setLogbookCompletion(e.target.value)}
            />
          </div>

          <Button 
            onClick={calculateCredits}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Credits
          </Button>
        </div>

        {/* Result */}
        {calculatedCredits !== null && (
          <div className="p-6 bg-gradient-subtle rounded-lg border-2 border-accent/20 animate-fade-in">
            <div className="text-center">
              <Award className="h-12 w-12 text-accent mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">{calculatedCredits}</div>
              <Badge className="bg-accent text-accent-foreground mb-3">NEP Credits</Badge>
              <p className="text-sm text-muted-foreground">
                Based on {duration} weeks, {evaluation} performance, and {logbookCompletion}% logbook completion
              </p>
            </div>
          </div>
        )}

        {/* Credit Guidelines */}
        <div className="pt-4 border-t space-y-2">
          <h4 className="font-semibold text-sm mb-3">NEP Credit Guidelines</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
              <span className="text-muted-foreground">8-11 weeks</span>
              <Badge variant="outline">2 credits</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
              <span className="text-muted-foreground">12-15 weeks</span>
              <Badge variant="outline">4 credits</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
              <span className="text-muted-foreground">16+ weeks</span>
              <Badge variant="outline">6 credits</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditCalculator;
