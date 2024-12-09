import { Card, CardContent } from "@/components/ui/card";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <Card className="w-full max-w-[400px] mx-4">
        <CardContent className="pt-6">{children}</CardContent>
      </Card>
      <div className="absolute bottom-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} GuestList. All rights reserved.
      </div>
    </div>
  );
}