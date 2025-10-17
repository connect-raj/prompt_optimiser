import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "Prompt Optimiser",
  version: "1.0.0",
});

// Ping tool for connectivity check
server.registerTool(
  "ping",
  {
    title: "Ping",
    description:
      "Pings the server to check whether the MCP is connected or not",
  },
  () => {
    return {
      content: [
        {
          type: "text",
          text: "PONG! Prompt Optimiser MCP Server is connected and running.",
        },
      ],
    };
  }
);

// Advanced iterative optimization tool
server.registerTool(
  "optimize-prompt-interactive",
  {
    title: "Optimize Prompt (Interactive)",
    description:
      "Provides expert prompt engineering guidance. Returns a formatted, copy-paste ready optimized prompt " +
      "for GitHub Copilot in VSCode, with optional clarifications.",
    inputSchema: {
      originalPrompt: z.string(),
    },
  },
  async ({ originalPrompt }) => {
    const interactiveOptimization = `You are a prompt engineering expert optimizing this request: "${originalPrompt}"

# OPTIMIZATION FRAMEWORK

## Step 1: Analyze the Original Prompt
Identify:
- **Core intent**: What is the user really trying to accomplish?
- **Ambiguities**: What's unclear or underspecified?
- **Missing context**: What technical details would improve outcomes?
- **Output format**: What deliverable does the user expect?

## Step 2: Apply Optimization Principles

Transform the prompt using these techniques:

### Specificity Enhancement
- Replace vague terms with concrete specifications
- Add technical stack details (languages, frameworks, libraries)
- Specify constraints (performance, security, scalability)
- Define success criteria and quality standards

### Structural Clarity
- Use clear, active language
- Break complex requests into logical components
- Add context about the use case and environment
- Specify the desired output format (code, documentation, analysis, etc.)

### Actionability
- Make requirements concrete and testable
- Include examples or patterns when helpful
- Specify error handling and edge cases
- Add relevant best practices and considerations

## Step 3: Identify Strategic Clarifications

Ask 2-3 questions ONLY if they meet these criteria:
- ✅ Would significantly change the approach or solution
- ✅ Involve critical decisions (architecture, technology choices, scope)
- ✅ Address ambiguity that can't be reasonably assumed
- ❌ DON'T ask about minor preferences or obvious defaults
- ❌ DON'T ask if the prompt is already clear enough

If no strategic clarifications needed, just say the optimized prompt is ready to use.

---

# YOUR TASK

Optimize "${originalPrompt}" following the framework above.

## RESPONSE FORMAT

### OPTIMIZED PROMPT (Ready to Copy & Paste)

\`\`\`
[Rewrite the prompt using the optimization principles above. Make it:
- Specific with technical details and context
- Clear about deliverables and requirements
- Structured and easy to understand
- Well-defined scope and constraints
- Ready to produce high-quality results]
\`\`\`

**📋 Copy the content above (inside the code block) and paste it directly into GitHub Copilot chat.**

---

### IMPROVEMENTS MADE
- [Improvement 1: e.g., "Added specific framework requirements instead of generic terms"]
- [Improvement 2: e.g., "Included error handling and validation considerations"]
- [Improvement 3: e.g., "Specified expected output format and structure"]
- [Continue listing key enhancements...]

### CLARIFICATION QUESTIONS
[List 2-3 strategic questions that would significantly improve the result, OR write:]
"None - the prompt is sufficiently clear and ready to use."

**Note:** If you have clarifications, I can refine the optimized prompt further. Otherwise, use the prompt above directly.

---

# CRITICAL REMINDERS

1. **Focus on clarity** - eliminate ambiguity and add necessary context
2. **Be strategic with questions** - max 2-3, only if truly impactful
3. **Structure for success** - organize the prompt logically and clearly
4. **Maintain user intent** - preserve the original goal while enhancing specificity
5. **Ready to use** - the optimized prompt should be immediately actionable
6. **Format for copy-paste** - present the optimized prompt in a clear code block for easy copying

The goal is: Original Prompt → Analysis → Copy-Paste Ready Optimized Prompt → Optional Clarifications`;

    return {
      content: [
        {
          type: "text",
          text: interactiveOptimization,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Prompt Optimiser MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Server error:", err);
  process.exit(1);
});
