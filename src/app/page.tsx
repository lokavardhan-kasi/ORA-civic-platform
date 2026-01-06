'use client';
import { Button } from '@/components/ui/button';
import { HeroAnimation } from '@/components/hero-animation';
import { Footer } from '@/components/footer';
import { ArrowRight, CheckCircle, Vote, MessageSquare, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { OraLogo } from '@/components/icons';

export default function LandingPage() {
  return (
    <div className="bg-black text-white w-full">
      <header className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-20">
        <Link href="/" className="flex items-center gap-2">
            <OraLogo className="h-8 w-8" />
            <span className="font-bold text-lg">ORA</span>
        </Link>
        <Button asChild variant="outline" className="border-gray-500 text-gray-200 bg-black/50 hover:bg-gray-800 hover:text-white">
          <Link href="/login">
            Login
          </Link>
        </Button>
      </header>
      <HeroAnimation />
      <div className="relative z-10">
        <main className="min-h-screen">
          <section className="relative h-[70vh] min-h-[500px] flex flex-col justify-center items-center text-center px-4">
            <div className="pt-20">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 max-w-4xl leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                The Public Record of Civic Sentiment
              </h1>
              <p className="max-w-2xl mx-auto mb-8 text-base md:text-xl text-gray-300">
                ORA is a non-partisan platform for verified citizens to weigh in on government decisions that affect their lives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200">
                  <Link href="/feed">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
             <div className="absolute bottom-8 text-center text-gray-400 animate-bounce">
                <p className="text-sm">Scroll to discover</p>
                <ChevronDown className="h-6 w-6 mx-auto" />
            </div>
          </section>
          
          <section id="how-it-works" className="py-20 bg-gray-900/50 backdrop-blur-md border-t border-b border-gray-800">
            <div className="container mx-auto max-w-5xl px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How ORA Works</h2>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 border border-primary/50 mb-4">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Verify & Participate</h3>
                  <p className="text-gray-400">
                    Users verify their identity to ensure a one-person, one-vote system. Select your region to see relevant regional, state, and national issues.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 border border-primary/50 mb-4">
                    <Vote className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Cast Your Vote</h3>
                  <p className="text-gray-400">
                    Express your opinion on proposals with a clear Agree, Mixed, or Disagree vote. Your vote is immutable and recorded publicly.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                   <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 border border-primary/50 mb-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Foster Discussion</h3>
                  <p className="text-gray-400">
                    Engage in public discussion. Comments can be liked to highlight the most important reasoning and perspectives from the community.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
