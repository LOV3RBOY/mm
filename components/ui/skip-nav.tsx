import type * as React from "react"
import { cn } from "@/lib/utils"

export interface SkipNavProps extends React.HTMLAttributes<HTMLAnchorElement> {
  contentId?: string
  children?: React.ReactNode
}

export function SkipNavLink({
  contentId = "content",
  className,
  children = "Skip to content",
  ...props
}: SkipNavProps) {
  return (
    <a
      href={`#${contentId}`}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:text-black focus:p-4 focus:block",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}

export interface SkipNavContentProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string
}

export function SkipNavContent({ id = "content", ...props }: SkipNavContentProps) {
  return <div id={id} tabIndex={-1} {...props} />
}

