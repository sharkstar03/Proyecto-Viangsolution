// src/components/common/Select.jsx
import { 
    Select as SelectUI,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { cn } from "@/lib/utils";
  
  const Select = ({ className, error, items, placeholder, ...props }) => {
    return (
      <SelectUI {...props}>
        <SelectTrigger 
          className={cn(
            "w-full",
            {
              "border-red-500 focus:border-red-500 focus:ring-red-500": error,
            },
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items?.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectUI>
    );
  };
  
  export default Select;