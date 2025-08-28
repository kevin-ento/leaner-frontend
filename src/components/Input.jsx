import { memo } from "react";

const Input = memo(({ label, error, className = "", required = false, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input 
        className={`input-field ${error ? "border-red-500 focus:ring-red-500" : ""} ${className}`} 
        {...props} 
        aria-describedby={error ? `${props.name}-error` : undefined}
        aria-invalid={error ? "true" : "false"}
      />
      {error && (
        <p id={`${props.name}-error`} className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
});

Input.displayName = 'Input';

export default Input
