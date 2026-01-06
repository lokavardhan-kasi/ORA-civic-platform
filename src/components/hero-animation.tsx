'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const frameCount = 191;
const frameDownsample = 4; // Use every 4th frame
const totalFramesToLoad = Math.ceil(frameCount / frameDownsample);

const currentFrame = (index: number) => {
  const frameNumber = (index * frameDownsample).toString().padStart(3, '0');
  return `https://mlbhiqpuybigiuolwhxn.supabase.co/storage/v1/object/public/ORA-homepage/frame_${frameNumber}_delay-0.042s.webp`;
};

export function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const animationDataRef = useRef({ frame: 0 });

  useEffect(() => {
    // Preload images
    const images: HTMLImageElement[] = [];
    for (let i = 0; i < totalFramesToLoad; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  useGSAP(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const renderFrame = () => {
        const frameIndex = Math.round(animationDataRef.current.frame);
        const img = imagesRef.current[frameIndex];
        if (img && img.complete && img.naturalWidth > 0) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      };

    const firstImage = imagesRef.current[0];
    if (firstImage) {
      firstImage.onload = renderFrame;
    }

    gsap.to(animationDataRef.current, {
      frame: totalFramesToLoad - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=2000',
        scrub: 1,
        pin: true,
      },
      onUpdate: renderFrame,
    });
    
    const handleResize = () => {
        if(canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame();
        }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, { scope: containerRef, dependencies: [] });

  return (
    <div ref={containerRef} className="h-screen w-screen fixed top-0 left-0">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
    </div>
  );
}
