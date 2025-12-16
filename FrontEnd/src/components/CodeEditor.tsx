import Editor from "@monaco-editor/react";
import { Terminal, Code2 } from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const CodeEditor = ({ value, onChange, disabled }: CodeEditorProps) => {
  return (
    <div className="group relative rounded-2xl overflow-hidden glass border-glow transition-all duration-500 hover:glow-primary">
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/50 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/50 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/50 rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/50 rounded-br-2xl" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-background/50">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive/80 shadow-lg shadow-destructive/30" />
            <div className="w-3 h-3 rounded-full bg-warning/80 shadow-lg shadow-warning/30" />
            <div className="w-3 h-3 rounded-full bg-success/80 shadow-lg shadow-success/30" />
          </div>
          <div className="h-4 w-px bg-border/50" />
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-muted-foreground">source.c</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Terminal className="w-3.5 h-3.5" />
          <span>C/C++</span>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <Editor
          height="420px"
          defaultLanguage="c"
          theme="vs-dark"
          value={value}
          onChange={(val) => onChange(val || "")}
          options={{
            fontSize: 14,
            fontFamily: "JetBrains Mono, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 20, bottom: 20 },
            lineNumbers: "on",
            readOnly: disabled,
            wordWrap: "on",
            automaticLayout: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            renderLineHighlight: "gutter",
            lineNumbersMinChars: 3,
            folding: true,
            glyphMargin: false,
          }}
        />
        
        {/* Scan line effect when disabled/loading */}
        {disabled && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-x-0 h-20 bg-gradient-to-b from-primary/20 to-transparent scan-line" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
