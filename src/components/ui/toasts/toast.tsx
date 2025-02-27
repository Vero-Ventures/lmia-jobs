"use client";
import { forwardRef } from "react";
import {
  Provider,
  Viewport,
  Root,
  Action,
  Close,
  Title,
  Description,
} from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ElementRef, ComponentPropsWithoutRef, ReactElement } from "react";

const ToastProvider = Provider;

const ToastViewport = forwardRef<
  ElementRef<typeof Viewport>,
  ComponentPropsWithoutRef<typeof Viewport>
>(({ className, ...props }, ref) => (
  <Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100001] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));

ToastViewport.displayName = Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-slate-200 p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full dark:border-slate-800",
  {
    variants: {
      variant: {
        default:
          "border bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50",
        destructive:
          "destructive group border-red-500 bg-red-500 text-slate-50 dark:border-red-900 dark:bg-red-900 dark:text-slate-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = forwardRef<
  ElementRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});

Toast.displayName = Root.displayName;

const ToastAction = forwardRef<
  ElementRef<typeof Action>,
  ComponentPropsWithoutRef<typeof Action>
>(({ className, ...props }, ref) => (
  <Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-transparent px-3 text-sm font-medium ring-offset-white transition-colors group-[.destructive]:border-slate-100/40 hover:bg-slate-100 group-[.destructive]:hover:border-red-500/30 group-[.destructive]:hover:bg-red-500 group-[.destructive]:hover:text-slate-50 focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none group-[.destructive]:focus:ring-red-500 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:group-[.destructive]:border-slate-800/40 dark:hover:bg-slate-800 dark:group-[.destructive]:hover:border-red-900/30 dark:group-[.destructive]:hover:bg-red-900 dark:group-[.destructive]:hover:text-slate-50 dark:focus:ring-slate-300 dark:group-[.destructive]:focus:ring-red-900",
      className
    )}
    {...props}
  />
));

ToastAction.displayName = Action.displayName;

const ToastClose = forwardRef<
  ElementRef<typeof Close>,
  ComponentPropsWithoutRef<typeof Close>
>(({ className, ...props }, ref) => (
  <Close
    ref={ref}
    className={cn(
      "absolute top-2 right-2 rounded-md p-1 text-slate-950/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-slate-950 group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:ring-2 focus:outline-none group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600 dark:text-slate-50/50 dark:hover:text-slate-50",
      className
    )}
    toast-close=""
    {...props}>
    <X className="h-4 w-4" />
  </Close>
));

ToastClose.displayName = Close.displayName;

const ToastTitle = forwardRef<
  ElementRef<typeof Title>,
  ComponentPropsWithoutRef<typeof Title>
>(({ className, ...props }, ref) => (
  <Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));

ToastTitle.displayName = Title.displayName;

const ToastDescription = forwardRef<
  ElementRef<typeof Description>,
  ComponentPropsWithoutRef<typeof Description>
>(({ className, ...props }, ref) => (
  <Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));

ToastDescription.displayName = Description.displayName;

type ToastProps = ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
