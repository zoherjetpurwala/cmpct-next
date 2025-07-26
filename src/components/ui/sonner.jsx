"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = (props) => {
  const { resolvedTheme = "light" } = useTheme(); // auto-detects 'light', 'dark', or 'system'

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          title: "text-base font-semibold",
          description: "group-[.toast]:text-muted-foreground text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground hover:opacity-90 transition",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground hover:opacity-80 transition",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
