import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-8 text-center w-full">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50">
            Form Prototype Builder
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Build and test form variations using shadcn/ui components. Describe the form fields you want, and we'll build it for you to test and iterate.
          </p>
          
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                View existing prototypes or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/prototypes" className="block">
                <Button className="w-full" size="lg">
                  View Prototypes
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Browse and test form variations built with shadcn/ui components
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
