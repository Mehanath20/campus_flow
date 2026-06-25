"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Lock, Phone, Book, GraduationCap, Target, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
    else router.push("/dashboard");
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Create Account</h1>
        <p className="text-sm text-gray-500">
          Step {step} of 3: {step === 1 ? 'Basic Info' : step === 2 ? 'Academic Details' : 'Career & Goals'}
        </p>
        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={cn("h-2 rounded-full transition-all", step >= i ? "w-8 bg-indigo-600" : "w-2 bg-gray-200")} />
          ))}
        </div>
      </div>

      <form onSubmit={handleNext} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input id="name" placeholder="John Doe" required className="pl-10 h-12 bg-white/80" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input id="email" type="email" placeholder="john@campus.edu" required className="pl-10 h-12 bg-white/80" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input id="phone" type="tel" placeholder="+1 234 567 890" className="pl-10 h-12 bg-white/80" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input id="password" type="password" required className="pl-10 h-12 bg-white/80" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <div className="relative">
                  <Book className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input id="branch" placeholder="Computer Science" required className="pl-10 h-12 bg-white/80" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input id="year" placeholder="3rd Year" required className="pl-10 h-12 bg-white/80" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input id="section" placeholder="A" required className="h-12 bg-white/80" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjects">Current Subjects (comma separated)</Label>
              <Input id="subjects" placeholder="OS, DBMS, CN" className="h-12 bg-white/80" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <Label htmlFor="career">Career Goal</Label>
              <div className="relative">
                <Target className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input id="career" placeholder="Software Engineer" required className="pl-10 h-12 bg-white/80" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Input id="skills" placeholder="React, Node.js, Python" className="h-12 bg-white/80" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weak">Weak Subjects/Areas</Label>
              <Input id="weak" placeholder="Dynamic Programming, Networking" className="h-12 bg-white/80" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calendar">Google Calendar Link</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input id="calendar" placeholder="https://calendar.google.com/..." className="pl-10 h-12 bg-white/80" />
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm font-normal">
                I agree to the terms and conditions
              </Label>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          {step > 1 && (
            <Button type="button" variant="outline" className="w-1/3 h-12" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button type="submit" className={cn("h-12 bg-indigo-600 hover:bg-indigo-700 shadow-md", step > 1 ? "w-2/3" : "w-full")}>
            {step === 3 ? "Complete Registration" : "Next Step"}
          </Button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
