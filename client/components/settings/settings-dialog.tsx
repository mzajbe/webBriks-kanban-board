"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Palette, Sparkles, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && (resolvedTheme === "dark" || theme === "dark");

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  const themeOptions = [
    {
      id: "light",
      name: "Light",
      icon: Sun,
      description: "Clean, bright appearance",
    },
    {
      id: "dark",
      name: "Dark",
      icon: Moon,
      description: "Sleek, eye-friendly contrast",
    },
    {
      id: "system",
      name: "System",
      icon: Monitor,
      description: "Syncs with your OS setting",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-6 rounded-2xl border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0F172A] shadow-xl">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Palette className="h-4 w-4" />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Workspace Settings
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Customize your workspace appearance and interface preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-5">
          {/* Main Dark Mode Switch Row */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/60 transition-colors">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                {isDarkMode ? (
                  <Moon className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-500" />
                )}
                <Label
                  htmlFor="dark-mode-toggle"
                  className="text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer"
                >
                  Dark Mode
                </Label>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                {isDarkMode
                  ? "Dark theme is currently active across the application."
                  : "Enable dark theme to reduce glare and eye fatigue."}
              </p>
            </div>

            {mounted ? (
              <Switch
                id="dark-mode-toggle"
                checked={isDarkMode}
                onCheckedChange={handleToggle}
              />
            ) : (
              <div className="h-5 w-9 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            )}
          </div>

          {/* Theme Preset Cards */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Theme Preference
            </Label>
            <div className="grid grid-cols-3 gap-2.5">
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = mounted && theme === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTheme(opt.id)}
                    className={cn(
                      "relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer",
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-200 shadow-2xs font-semibold"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800/60 font-medium"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-600 text-white dark:bg-emerald-500">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    )}
                    <Icon className="h-4 w-4 mb-1.5" />
                    <span className="text-xs">{opt.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                      {opt.id === "system" ? "Auto" : opt.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto bg-[#1b4332] hover:bg-[#143627] dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
