import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    // Base styles with enhanced typography and spacing
    "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl text-sm font-semibold",
    "transition-all duration-300 ease-out transform-gpu",
    "disabled:pointer-events-none disabled:opacity-40 disabled:scale-95",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "active:scale-[0.98] hover:scale-[1.02]",
    // Icon styles
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    // Enhanced accessibility
    "aria-invalid:ring-2 aria-invalid:ring-red-500/50",
    // Modern shadow and backdrop effects
    "backdrop-blur-sm border border-transparent",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800",
          "text-white shadow-lg shadow-blue-600/25",
          "hover:shadow-xl hover:shadow-blue-600/30",
          "focus-visible:ring-blue-500",
          "border-blue-500/20",
          "relative overflow-hidden",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/10 before:to-white/0",
          "before:translate-x-[-100%] before:animate-[shimmer_2s_infinite]",
        ],
        destructive: [
          "bg-gradient-to-br from-red-500 via-red-600 to-red-700",
          "text-white shadow-lg shadow-red-500/25",
          "hover:shadow-xl hover:shadow-red-500/30",
          "focus-visible:ring-red-500",
          "border-red-400/20",
        ],
        outline: [
          "border-2 border-gray-200 dark:border-gray-700",
          "bg-white/50 dark:bg-gray-900/50",
          "text-gray-900 dark:text-gray-100",
          "shadow-sm hover:shadow-md",
          "hover:bg-gray-50 dark:hover:bg-gray-800/50",
          "hover:border-gray-300 dark:hover:border-gray-600",
          "focus-visible:ring-gray-500",
        ],
        secondary: [
          "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300",
          "dark:from-gray-700 dark:via-gray-800 dark:to-gray-900",
          "text-gray-900 dark:text-gray-100",
          "shadow-md hover:shadow-lg",
          "border-gray-300/50 dark:border-gray-600/50",
          "focus-visible:ring-gray-500",
        ],
        ghost: [
          "text-gray-700 dark:text-gray-300",
          "hover:bg-gray-100/80 dark:hover:bg-gray-800/80",
          "hover:text-gray-900 dark:hover:text-gray-100",
          "focus-visible:ring-gray-500",
          "border-transparent",
        ],
        link: [
          "text-blue-600 dark:text-blue-400",
          "underline-offset-4 hover:underline",
          "focus-visible:ring-blue-500",
          "p-0 h-auto font-medium",
        ],
        premium: [
          "bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600",
          "text-white shadow-xl shadow-purple-500/30",
          "hover:shadow-2xl hover:shadow-purple-500/40",
          "focus-visible:ring-purple-500",
          "border-purple-400/30",
          "relative overflow-hidden",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0",
          "before:translate-x-[-100%] before:animate-[shimmer_2s_infinite]",
        ],
        success: [
          "bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600",
          "text-white shadow-lg shadow-emerald-500/25",
          "hover:shadow-xl hover:shadow-emerald-500/30",
          "focus-visible:ring-emerald-500",
          "border-emerald-400/20",
        ],
      },
      size: {
        xs: "h-7 px-2.5 py-1 text-xs rounded-lg gap-1.5",
        sm: "h-8 px-4 py-2 text-xs rounded-lg gap-2",
        default: "h-10 px-6 py-2.5 text-sm rounded-xl gap-2.5",
        lg: "h-12 px-8 py-3 text-base rounded-xl gap-3",
        xl: "h-14 px-10 py-4 text-lg rounded-2xl gap-3.5",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-12 rounded-xl",
      },
      loading: {
        true: "cursor-wait",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  }
)

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          buttonVariants({ variant, size, loading, className }),
          "group relative"
        )}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          </div>
        )}
        
        <div className={cn("flex items-center gap-2", loading && "opacity-0")}>
          {leftIcon && (
            <span className="flex items-center justify-center">
              {leftIcon}
            </span>
          )}
          
          {children}
          
          {rightIcon && (
            <span className="flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>
      </Comp>
    )
  }
)

Button.displayName = "Button"

// Demo component to showcase the enhanced buttons
const ButtonShowcase = () => {
  const [loading, setLoading] = React.useState(false)
  
  const handleLoadingDemo = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Enhanced Professional Button Component
        </h1>
        
        {/* Variants Showcase */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Button Variants
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Default</Button>
              <Button variant="premium">Premium</Button>
              <Button variant="success">Success</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link Button</Button>
            </div>
          </div>

          {/* Sizes Showcase */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Button Sizes
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          </div>

          {/* Icons & Loading States */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Icons & Loading States
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button 
                leftIcon={<span>📧</span>}
              >
                Send Email
              </Button>
              <Button 
                variant="premium"
                rightIcon={<span>✨</span>}
              >
                Upgrade Now
              </Button>
              <Button 
                variant="success"
                leftIcon={<span>💾</span>}
                loading={loading}
                onClick={handleLoadingDemo}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button size="icon" variant="outline">
                <span>🔍</span>
              </Button>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Interactive Demo
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  variant="default"
                  size="lg"
                  leftIcon={<span>🚀</span>}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                >
                  Learn More
                </Button>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="premium"
                  rightIcon={<span>→</span>}
                >
                  Try Premium Features
                </Button>
                <Button variant="ghost" disabled>
                  Disabled State
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

export { Button, buttonVariants, ButtonShowcase as default }