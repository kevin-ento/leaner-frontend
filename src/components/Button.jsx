import { memo } from "react";

const Button = memo(({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  icon,
  iconPosition = "left",
  ...props
}) => {
  const baseClasses =
    "font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 inline-flex items-center justify-center"

  const variants = {
    primary:
      "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200",
    danger: 
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700",
    outline:
      "border border-gray-300 dark:border-gray-600 bg-transparent dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-primary-500",
    ghost:
      "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500 hover:text-gray-900 dark:hover:text-white",
    success:
      "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-700",
  }

  const sizes = {
    xs: "px-2 py-1 text-xs min-h-[28px]",
    sm: "px-3 py-1.5 text-sm min-h-[32px]",
    md: "px-4 py-2 text-sm min-h-[40px]",
    lg: "px-6 py-3 text-base min-h-[48px]",
    xl: "px-8 py-4 text-lg min-h-[56px]",
  }

  const disabledClasses = disabled || loading ? "opacity-50 cursor-not-allowed" : ""

  const iconClasses = icon ? "gap-2" : ""

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${iconClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center w-full">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          <span className="flex-shrink-0">{children}</span>
          {icon && iconPosition === "right" && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </>
      )}
    </button>
  )
})

Button.displayName = 'Button';

export default Button
