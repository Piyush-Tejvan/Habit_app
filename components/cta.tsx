"use client";
import { ArrowIcon } from "@/components/arrow-icon";
import Link from "next/link";
import { track } from "@/lib/analytics";
export function PilotCTA({
  children = "Request pilot details",
  className = "button button-primary",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href="/request"
      className={className}
      onClick={() => track("pilot_cta_clicked")}
    >
      {children}
      <ArrowIcon />
    </Link>
  );
}
