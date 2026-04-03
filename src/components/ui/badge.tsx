import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/12 text-primary border border-primary/15",
        secondary: "bg-secondary text-secondary-foreground border border-border",
        success: "bg-success/12 text-success border border-success/15",
        warning: "bg-warning/12 text-warning border border-warning/15",
        destructive: "bg-destructive/12 text-destructive border border-destructive/15",
        gold: "bg-gold/12 text-gold border border-gold/15",
        outline: "border border-border text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
