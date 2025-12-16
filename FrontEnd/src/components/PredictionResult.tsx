import { Shield, ShieldAlert, ShieldCheck, Scan, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface PredictionResultProps {
  result: {
    label: "clean" | "defective";
    probability: number;
  } | null;
  isLoading: boolean;
}

const PredictionResult = ({ result, isLoading }: PredictionResultProps) => {
  if (isLoading) {
    return (
      <div className="relative rounded-2xl glass p-8 overflow-hidden border-glow">
        {/* Animated scan lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-x-0 h-32 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent scan-line" />
        </div>
        
        {/* Corner decorations */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-primary/60" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-primary/60" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-primary/60" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-primary/60" />

        <div className="relative flex flex-col items-center justify-center gap-5 min-h-[280px]">
          {/* Animated icon */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 pulse-glow" />
            <div className="relative p-6 rounded-full bg-primary/10 border border-primary/30">
              <Scan className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xl font-semibold text-foreground flex items-center gap-2 justify-center">
              <Activity className="w-5 h-5 text-primary" />
              Scanning Code
              <span className="inline-flex">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Running GraphCodeBERT neural analysis
            </p>
          </div>

          {/* Progress indicator */}
          <div className="w-full max-w-xs">
            <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary via-primary/60 to-primary rounded-full shimmer" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="relative rounded-2xl border border-dashed border-border/60 bg-card/30 p-8 min-h-[340px]">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-bg opacity-30 rounded-2xl" />
        
        <div className="relative flex flex-col items-center justify-center gap-5 h-full">
          <div className="p-6 rounded-full bg-muted/30 border border-border/50">
            <Shield className="w-12 h-12 text-muted-foreground/60" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-muted-foreground">Awaiting Analysis</p>
            <p className="text-sm text-muted-foreground/70 max-w-[200px]">
              Enter your C/C++ code and click analyze to begin
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/50 font-mono">
            <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            <span>IDLE</span>
          </div>
        </div>
      </div>
    );
  }

  const isClean = result.label === "clean";
  const percentage = Math.round(result.probability * 100);

  return (
    <div
      className={cn(
        "relative rounded-2xl p-8 overflow-hidden animate-scale-in transition-all duration-500 min-h-[340px]",
        isClean
          ? "glass border-2 border-success/50 glow-success"
          : "glass border-2 border-destructive/50 glow-destructive"
      )}
    >
      {/* Background gradient */}
      <div 
        className={cn(
          "absolute inset-0 opacity-20",
          isClean 
            ? "bg-gradient-to-br from-success/30 via-transparent to-success/10"
            : "bg-gradient-to-br from-destructive/30 via-transparent to-destructive/10"
        )} 
      />

      {/* Corner decorations */}
      <div className={cn("absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2", isClean ? "border-success/60" : "border-destructive/60")} />
      <div className={cn("absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2", isClean ? "border-success/60" : "border-destructive/60")} />
      <div className={cn("absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2", isClean ? "border-success/60" : "border-destructive/60")} />
      <div className={cn("absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2", isClean ? "border-success/60" : "border-destructive/60")} />

      <div className="relative flex flex-col items-center justify-center gap-5">
        {/* Status badge */}
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider",
          isClean 
            ? "bg-success/20 text-success border border-success/30" 
            : "bg-destructive/20 text-destructive border border-destructive/30"
        )}>
          {isClean ? "SECURE" : "VULNERABLE"}
        </div>

        {/* Icon */}
        <div className={cn(
          "relative p-5 rounded-2xl",
          isClean ? "bg-success/10" : "bg-destructive/10"
        )}>
          <div className={cn(
            "absolute inset-0 rounded-2xl pulse-glow",
            isClean ? "bg-success/20" : "bg-destructive/20"
          )} />
          {isClean ? (
            <ShieldCheck className="relative w-16 h-16 text-success" />
          ) : (
            <ShieldAlert className="relative w-16 h-16 text-destructive" />
          )}
        </div>

        {/* Result text */}
        <div className="text-center space-y-1">
          <p className={cn(
            "text-3xl font-bold uppercase tracking-wide text-glow",
            isClean ? "text-success" : "text-destructive"
          )}>
            {isClean ? "Clean Code" : "Defect Found"}
          </p>
          <p className="text-sm text-muted-foreground">
            {isClean
              ? "No security vulnerabilities detected"
              : "Potential security vulnerability identified"}
          </p>
        </div>

        {/* Confidence meter */}
        <div className="w-full max-w-xs space-y-3 mt-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">Confidence Score</span>
            <span className={cn(
              "font-mono font-bold text-lg",
              isClean ? "text-success" : "text-destructive"
            )}>
              {percentage}%
            </span>
          </div>
          <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden">
            <div
              className={cn(
                "absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out",
                isClean 
                  ? "bg-gradient-to-r from-success/80 to-success" 
                  : "bg-gradient-to-r from-destructive/80 to-destructive"
              )}
              style={{ width: `${percentage}%` }}
            />
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
