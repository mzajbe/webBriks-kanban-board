"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-200 dark:group-[.toaster]:bg-slate-900 dark:group-[.toaster]:text-slate-100 dark:group-[.toaster]:border-slate-800 group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl group-[.toaster]:text-xs font-sans",
          description: "group-[.toast]:text-slate-500 dark:group-[.toast]:text-slate-400",
          actionButton:
            "group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50 dark:group-[.toast]:bg-slate-100 dark:group-[.toast]:text-slate-900",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 dark:group-[.toast]:bg-slate-800 dark:group-[.toast]:text-slate-300",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
