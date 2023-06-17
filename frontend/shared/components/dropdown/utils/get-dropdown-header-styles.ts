export default function getDropdownHeaderStyles(highlight?: boolean): string {
	return `
          max-height: 22px;
          min-height: 22px;
          border-radius: 3px;
          ${highlight ? "background: var(--pj-accent-color);" : "background: var(--pj-background-secondary);"}
          color: ${highlight ? "white" : "var(--pj-color-secondary)"};
   `
}