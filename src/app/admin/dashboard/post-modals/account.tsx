"use client";

import { User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AccountProps {
  name: string;
  email: string;
}

export default function Account({ name, email }: AccountProps) {
  return (
    <Card className="w-full overflow-hidden p-6">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full">
              <User className="h-12 w-12" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">{name}</CardTitle>
              <CardDescription>{email}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <h1 className="text-2xl font-semibold">My Posts:</h1>
      </CardContent>
    </Card>
  );
}
