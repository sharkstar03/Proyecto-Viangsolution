// src/components/common/Button.jsx
import { cn } from "@/lib/utils";
import { Button as ButtonUI } from "@/components/ui/button";

const Button = ({ children, className, variant = "default", ...props }) => {
  return (
    <ButtonUI
      className={cn(
        "font-semibold",
        {
          "bg-primary text-white hover:bg-primary/90": variant === "primary",
          "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "destructive",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
        },
        className
      )}
      {...props}
    >
      {children}
    </ButtonUI>
  );
};

export default Button;