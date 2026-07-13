import React, { forwardRef } from "react";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label?: string;
  error?: string;
  type?: string;
  options?: { value: string; label: string }[]; // For select type
  helperText?: string;
  containerClassName?: string;
}

export const Input = forwardRef<any, InputProps>(
  (
    {
      label,
      error,
      type = "text",
      options,
      helperText,
      containerClassName = "",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    const baseInputStyles =
      "w-full px-4 py-3 rounded-xl border bg-white text-zinc-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-zinc-400 disabled:bg-zinc-50 disabled:text-zinc-500 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-600 dark:disabled:bg-zinc-950";

    const stateStyles = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700";

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
          </label>
        )}

        {type === "textarea" ? (
          <textarea
            id={inputId}
            ref={ref}
            className={`${baseInputStyles} ${stateStyles} resize-none min-h-[100px] ${className}`}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : type === "select" ? (
          <select
            id={inputId}
            ref={ref}
            className={`${baseInputStyles} ${stateStyles} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10 ${className}`}
            {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={`${baseInputStyles} ${stateStyles} ${className}`}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {error && (
          <span className="text-xs text-red-500 font-medium">{error}</span>
        )}
        {!error && helperText && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
