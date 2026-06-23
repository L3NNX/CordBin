const ArchitectureDiagram = () => {
  return (
    <div className="relative w-full h-full bg-background border border-border p-8">

      {/* Corner Brackets */}
      <span className="pointer-events-none absolute inset-0">
        <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-foreground/40" />
        <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-foreground/40" />
        <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-foreground/40" />
        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-foreground/40" />
      </span>

      <svg viewBox="0 0 1000 600" className="w-full h-full">

        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1"/>
          </pattern>

          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* CLIENT */}
        <rect x="60" y="260" width="170" height="80"
          fill="hsl(var(--card))"
          stroke="currentColor"
          rx="6"
        />
        <text x="145" y="300" textAnchor="middle" fontSize="13" fontFamily="monospace">
          Client
        </text>
        <text x="145" y="320" textAnchor="middle" fontSize="10" fill="gray">
          Upload / Download
        </text>

        {/* ENCRYPTION */}
        <rect x="280" y="230" width="220" height="100"
          fill="hsl(var(--card))"
          stroke="currentColor"
          rx="6"
        />
        <text x="390" y="270" textAnchor="middle" fontSize="13" fontFamily="monospace">
          AES‑256‑GCM
        </text>
        <text x="390" y="290" textAnchor="middle" fontSize="10" fill="gray">
          Client‑Side Encryption
        </text>

        {/* CHUNK ORCHESTRATOR */}
        <rect x="540" y="220" width="240" height="110"
          fill="hsl(var(--card))"
          stroke="currentColor"
          rx="6"
        />
        <text x="660" y="260" textAnchor="middle" fontSize="13" fontFamily="monospace">
          Chunk Orchestrator
        </text>
        <text x="660" y="280" textAnchor="middle" fontSize="10" fill="gray">
          9.5MB Blocks · Resume Support
        </text>

        {/* METADATA */}
        <rect x="540" y="380" width="240" height="90"
          fill="hsl(var(--muted))"
          stroke="currentColor"
          rx="6"
        />
        <text x="660" y="415" textAnchor="middle" fontSize="13" fontFamily="monospace">
          Metadata Registry
        </text>
        <text x="660" y="435" textAnchor="middle" fontSize="10" fill="gray">
          MongoDB
        </text>

        {/* RATE LIMIT */}
        <rect x="280" y="380" width="220" height="90"
          fill="hsl(var(--muted))"
          stroke="currentColor"
          rx="6"
        />
        <text x="390" y="415" textAnchor="middle" fontSize="13" fontFamily="monospace">
          Rate Limit Manager
        </text>
        <text x="390" y="435" textAnchor="middle" fontSize="10" fill="gray">
          Global + Bucket Tracking
        </text>

        {/* CHANNEL POOL */}
        <rect x="820" y="230" width="160" height="100"
          fill="hsl(var(--card))"
          stroke="currentColor"
          rx="6"
        />
        <text x="900" y="270" textAnchor="middle" fontSize="13" fontFamily="monospace">
          Channel Pool
        </text>

        {/* DISCORD API */}
        <rect x="820" y="380" width="160" height="90"
          fill="hsl(var(--card))"
          stroke="currentColor"
          rx="6"
        />
        <text x="900" y="415" textAnchor="middle" fontSize="13" fontFamily="monospace">
          Discord API
        </text>

        {/* ARROWS */}

        {/* Upload Path */}
        <line x1="230" y1="300" x2="280" y2="280"
          stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrow)" />

        <line x1="500" y1="280" x2="540" y2="275"
          stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrow)" />

        <line x1="660" y1="330" x2="660" y2="380"
          stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrow)" />

        <line x1="540" y1="415" x2="500" y2="415"
          stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrow)" />

        <line x1="780" y1="275" x2="820" y2="275"
          stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrow)" />

        <line x1="900" y1="330" x2="900" y2="380"
          stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrow)" />

      </svg>
    </div>
  );
};

export default ArchitectureDiagram;