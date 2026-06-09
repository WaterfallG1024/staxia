import * as React from "react"
import { cn } from "../../utils/cn"

const Slider = React.forwardRef(({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
  const handleChange = (e) => {
    onValueChange?.([parseFloat(e.target.value)])
  }

  const val = value?.[0] || min;
  const percentage = ((val - min) / (max - min)) * 100;

  return (
    <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
      <input
        type="range"
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={handleChange}
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        {...props}
      />
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div 
          className="absolute h-full bg-slate-900 dark:bg-slate-50" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div 
        className="absolute h-5 w-5 rounded-full border-2 border-slate-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-50 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 pointer-events-none"
        style={{ left: `calc(${percentage}% - 10px)` }}
      />
    </div>
  )
})
Slider.displayName = "Slider"

export { Slider }
