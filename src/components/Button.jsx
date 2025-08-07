const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center touch-target"

  const variants = {
    primary:
      "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700",
    secondary:
      "bg-secondary-100 hover:bg-secondary-200 text-secondary-700 focus:ring-secondary-500 dark:bg-secondary-800 dark:hover:bg-secondary-700 dark:text-secondary-200",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700",
    outline:
      "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-primary-500",
  }

  const sizes = {
    sm: "px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm min-h-[32px] sm:min-h-[36px]",
    md: "px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-sm min-h-[36px] sm:min-h-[40px]",
    lg: "px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base min-h-[40px] sm:min-h-[44px]",
  }

  const disabledClasses = disabled || loading ? "opacity-50 cursor-not-allowed" : ""

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-current mr-1 sm:mr-2"></div>
          <span className="text-xs sm:text-sm">Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
