'use client';

import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 text-gray-400">
      <div className="container mx-auto max-w-5xl py-8 px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} ORA &mdash; All rights reserved.</p>
          <p>
            Contact us: <a href="mailto:contact@ora.app" className="hover:text-white">contact@ora.app</a>
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="#" aria-label="Twitter">
            <Twitter className="h-6 w-6 hover:text-white transition-colors" />
          </Link>
          <Link href="#" aria-label="LinkedIn">
            <Linkedin className="h-6 w-6 hover:text-white transition-colors" />
          </Link>
          <Link href="#" aria-label="GitHub">
            <Github className="h-6 w-6 hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
