// src/components/common/Input.jsx
import { cn } from "@/lib/utils";
import { Input as InputUI } from "@/components/ui/input";

const Input = ({ className, error, ...props }) => {
  return (
    <InputUI
      className={cn(
        "transition-colors duration-200",
        {
          "border-red-500 focus:border-red-500 focus:ring-red-500": error,
        },
        className
      )}
      {...props}
    />
  );
};

export default Input;