// ======================================================
// Reusable Logo Component
// ======================================================

import Image from "next/image";

type LogoProps = {
  size?: number;
};

export default function Logo({
  size = 64,
}: LogoProps) {
  return (
    <Image
      src="/Logo.png"
      alt="SupportOS AI Logo"
      width={size}
      height={size}
      priority
    />
  );
}