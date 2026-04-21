export default {
  theme: {
    extend: {
      colors: {
        "bg-base":       "var(--bg-base)",
        "bg-surface":    "var(--bg-surface)",
        "bg-subtle":     "var(--bg-subtle)",
        "bg-muted":      "var(--bg-muted)",

        "fg-base":       "var(--fg-base)",
        "fg-muted":      "var(--fg-muted)",
        "fg-subtle":     "var(--fg-subtle)",
        "fg-on-accent":  "var(--fg-on-accent)",

        "border-base":   "var(--border-base)",
        "border-strong": "var(--border-strong)",

        "accent":        "var(--accent-bg)",
        "accent-hover":  "var(--accent-bg-hover)",
        "accent-fg":     "var(--accent-fg)",

        "danger":        "var(--danger-bg)",
        "danger-hover":  "var(--danger-bg-hover)",
        "danger-fg":     "var(--danger-fg)",
        "danger-subtle": "var(--danger-subtle)",

        "success":       "var(--success-bg)",
        "success-fg":    "var(--success-fg)",
        "success-subtle":"var(--success-subtle)",

        "warning":       "var(--warning-bg)",
        "warning-fg":    "var(--warning-fg)",
        "warning-subtle":"var(--warning-subtle)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      fontFamily: {
        mono: "var(--font-mono)",
      },
    },
  },
};