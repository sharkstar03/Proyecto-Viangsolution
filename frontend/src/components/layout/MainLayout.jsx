// src/components/common/Modal.jsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import Button from './Button';
  
  const Modal = ({ 
    open, 
    onClose, 
    title, 
    description, 
    children, 
    footer,
    size = "md" 
  }) => {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={cn(
          "sm:max-w-[425px]",
          {
            "sm:max-w-[600px]": size === "lg",
            "sm:max-w-[900px]": size === "xl",
          }
        )}>
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          {children}
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    );
  };
  
  export default Modal;