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

// Main prompt optimization tool
server.registerTool(
  "optimize-prompt",
  {
    title: "Optimize User Prompt",
    description:
      "Takes a user's original prompt and returns an optimized, refined version. " +
      "The output should be used as the actual prompt to execute, not the original input. " +
      "This tool acts as a prompt engineer to improve clarity, specificity, and effectiveness.",
    inputSchema: {
      originalPrompt: z.string(),
      context: z.string().optional(),
    },
  },
  async ({ originalPrompt, context }) => {
    // This creates instructions for the LLM to optimize the prompt
    const optimizationInstructions = `Act as an expert prompt engineer. A user has provided the following prompt that needs optimization:

      ORIGINAL PROMPT:
      "${originalPrompt}"
      ${context ? `\nADDITIONAL CONTEXT:\n${context}` : ""}

          YOUR TASK:
          Analyze this prompt and create an OPTIMIZED VERSION that:
          1. Is clear, specific, and unambiguous
          2. Includes relevant context and constraints
          3. Uses effective prompt engineering techniques
          4. Maintains the user's original intent
          5. Is structured for optimal AI performance

      OUTPUT FORMAT:
      Provide ONLY the optimized prompt itself - no explanations, no meta-commentary, no sections. 
      Just write the improved prompt as if you are the user making the request.

      The optimized prompt should be ready to execute immediately.`;

    return {
      content: [
        {
          type: "text",
          text: optimizationInstructions,
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
      "Provides an interactive prompt optimization experience with explanations and questions. " +
      "Returns both the optimized prompt AND suggestions for further improvement.",
    inputSchema: {
      originalPrompt: z.string(),
    },
  },
  async ({ originalPrompt }) => {
    const interactiveOptimization = `
    I want you to become my Prompt engineer. Your goal is to help me craft the best possible prompt for my needs. 
    The prompt will be used by you, ChatGPT. You will follow the following process:
        1. Your first response will be to ask me what the prompt should be about. I will provide my answer, but we will 
        need to improve it through continual iterations by going through the next steps.
        2. Based on my input, you will generate 2 sections, a) Revised prompt (provide your rewritten prompt, it should 
        be clear, concise, and easily understood by you), b) Questions (ask any relevant questions pertaining to what 
        additional information is needed from me to improve the prompt).
        3. We will continue this iterative process with me providing additional information to you and you updating 
        the prompt in the Revised prompt section until I say we are done.

      ORIGINAL PROMPT:
      "${originalPrompt}"

      Provide your response in this format:

      ## OPTIMIZED PROMPT
      [Write the improved, production-ready prompt here]

      ## IMPROVEMENTS MADE
      - [List key improvements: e.g., added specificity, clarified intent, structured better]

      ## OPTIONAL ENHANCEMENTS
      [Ask 2-3 questions that could further refine this prompt, if applicable]

      Be thorough but concise. The optimized prompt should be immediately usable.`;

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
