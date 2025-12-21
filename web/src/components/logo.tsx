/**
 * Logo Component
 * TeddyBear's Room - Light Mode Only
 */

import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function Logo({
  width = 40,
  height = 48,
  className,
  priority = false,
}: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="TeddyBear's Room"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}

export default Logo;
