import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { usePostings } from "@/hooks/useData";

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: postings = [] } = usePostings();
  const posting = postings.find(p => p.id === id || p.title === id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">Back</Button>
        <Card>
          <CardHeader>
            <CardTitle>{posting?.title ?? id}</CardTitle>
            <CardDescription>{posting?.company}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Badge variant="outline">{posting?.location ?? "Location TBA"}</Badge>
              <Badge variant="outline">{posting?.duration ?? "Duration TBA"}</Badge>
              {posting?.stipend ? <Badge variant="outline">{posting.stipend}</Badge> : null}
            </div>
            {posting?.skills?.length ? (
              <div className="flex flex-wrap gap-2">
                {posting.skills.map((s, i) => <Badge key={i} variant="secondary">{s}</Badge>)}
              </div>
            ) : null}
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{posting?.description ?? "No description available."}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InternshipDetails;


