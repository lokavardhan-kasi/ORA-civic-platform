import { SVGProps } from "react";

export function OraLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>ORA Logo</title>
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 2a10 10 0 0 0-7.5 3.5" />
      <path d="M12 22a10 10 0 0 0 7.5-3.5" />
      <path d="M2 12a10 10 0 0 0 3.5 7.5" />
      <path d="M22 12a10 10 0 0 0-3.5-7.5" />
    </svg>
  );
}
