'use client';
import { SubmitForm } from "@/components/submit-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/components/app-layout";

export default function SubmitPage() {
  return (
    <AppLayout>
      <div className="container mx-auto max-w-3xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Submit a New Proposal</CardTitle>
            <CardDescription>
              Have an idea to improve your community? Share it here. Your proposal will be analyzed by AI and then published to the public feed for feedback.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubmitForm />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
