import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

const DigitalLogbook = () => {
  const [entries, setEntries] = useState([
    {
      date: "2025-06-01",
      hours: 4,
      summary: "Orientation and setup",
      verified: true,
    },
    {
      date: "2025-06-02",
      hours: 6,
      summary: "Shadowed dev team, ticket triage",
      verified: false,
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Digital Logbook</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Entry Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="md:col-span-3">
            <Input type="date" placeholder="mm/dd/yyyy" />
          </div>
          <div className="md:col-span-2">
            <Input type="number" placeholder="Hours" />
          </div>
          <div className="md:col-span-5">
            <Textarea placeholder="Summary of work" className="min-h-[40px]" />
          </div>
          <div className="md:col-span-2">
            <Button className="w-full h-full bg-accent text-accent-foreground hover:bg-accent/90">
              Add
            </Button>
          </div>
        </div>

        {/* Entries List */}
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex-1">
                <div className="font-semibold mb-1">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {entry.date}
                    <span className="text-muted-foreground font-normal">•</span>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {entry.hours}h
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{entry.summary}</p>
              </div>
              <div className="mt-3 md:mt-0">
                {entry.verified ? (
                  <Badge className="bg-accent text-accent-foreground">Verified</Badge>
                ) : (
                  <Button size="sm" variant="outline">
                    Mark Verified
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">28</div>
            <div className="text-xs text-muted-foreground">Total Entries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">156</div>
            <div className="text-xs text-muted-foreground">Total Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">85%</div>
            <div className="text-xs text-muted-foreground">Verified</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DigitalLogbook;
