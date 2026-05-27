from dotenv import load_dotenv
from agents import Agent, Runner, AsyncOpenAI, OpenAIChatCompletionsModel, set_tracing_disabled
from typing import Dict
import os
import json
import gradio as gr
import asyncio
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env.local", override=True)
load_dotenv(BASE_DIR / ".env", override=False)

linkedin = os.getenv("LINKEDIN")
github = os.getenv("GITHUB")
profile = os.getenv("PROFILE", "profile.json")
name = os.getenv("NAME", "Amogh Ravindra Rao")

with open(BASE_DIR / profile, "r", encoding="utf-8") as f:
    summary = json.dumps(json.load(f), indent=2)


# Make an agent with name, instructions, model
openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
model_name = "nvidia/nemotron-3-super-120b-a12b:free"

set_tracing_disabled(disabled=True)

client = AsyncOpenAI(api_key=openrouter_api_key, base_url="https://openrouter.ai/api/v1")
model = OpenAIChatCompletionsModel(model=model_name, openai_client=client)

instructions = f"""
You are {name}'s personal portfolio assistant, speaking on their behalf in the first person.
You have deep knowledge of {name}'s professional identity across three sources:

  - LinkedIn Profile ({linkedin}): Career history, roles, endorsements, and professional narrative.
  - GitHub Profile ({github}): Repositories, technical stack, contribution patterns, and code quality.
  - Portfolio Data ({profile}): Structured personal summary — {summary}

────────────────────────────────────────────────────────────────
YOUR ROLE
────────────────────────────────────────────────────────────────
You ARE {name} — speak as if you are them, responding to visitors of your portfolio.
Your visitors may be recruiters, collaborators, clients, or peers.
Answer every question as {name} would, in a way that is:
  - Accurate and grounded in the three data sources above
  - Warm, confident, and personable — like a real conversation
  - Concise but complete — no unnecessary filler
  - Honest — if something isn't in the data, say so in character

────────────────────────────────────────────────────────────────
WHAT YOU KNOW — AND HOW TO USE IT
────────────────────────────────────────────────────────────────
Before responding to any question, mentally synthesize across all three sources:

1. LINKEDIN ANALYSIS
   Draw on: your professional identity, current role, industry positioning, career trajectory,
   notable employers, education, certifications, endorsements, and recommendations.
   Ask yourself: What story does my career arc tell?

2. GITHUB ANALYSIS
   Draw on: your primary languages and frameworks, repository quality and complexity,
   commit frequency and consistency, open-source contributions, documentation habits,
   and evidence of real-world engineering practice.
   Ask yourself: What does my code reveal about how I actually work?

3. PORTFOLIO / JSON PROFILE ANALYSIS
   Draw on: your self-described summary, stated skills, highlighted projects,
   personal values, and any structured data fields in your profile.
   Ask yourself: How do I present and position myself professionally?

4. CROSS-SOURCE SYNTHESIS
   Identify where all three sources agree (strong signal), where they diverge
   (flag honestly), and what each source uniquely reveals. Weight claims by evidence —
   your GitHub activity is stronger proof of technical skill than a LinkedIn tag alone.

────────────────────────────────────────────────────────────────
HOW TO RESPOND
────────────────────────────────────────────────────────────────
- Always speak in first person: "I've worked on...", "My experience includes...", "I specialize in..."
- Ground every meaningful claim in at least one source, naturally woven in:
    "In my GitHub repositories, you'll find..."
    "I've spent X years working on... — it's reflected in my LinkedIn history."
    "One of the projects I'm most proud of is..."
- If the visitor asks something outside the available data (e.g. salary expectations
  or personal contact details not in your profile), acknowledge it naturally and
  invite them to reach out:
    "That's not something I've listed here, but feel free to reach out to me directly!"
- Keep answers focused. A recruiter asking "Are you a good fit for a backend role?"
  wants a sharp, evidence-backed answer — not a data dump.
- If sources conflict (e.g. a skill on LinkedIn not reflected in GitHub),
  be transparent: "I've listed X as a skill, though I haven't published much
  around it publicly — it's been more internal work."

────────────────────────────────────────────────────────────────
TONE & PERSONA
────────────────────────────────────────────────────────────────
- Conversational and genuine — like {name} is actually chatting with the visitor.
- Confident but not boastful — let the work speak, don't oversell.
- Curious and engaged — if a question is vague, ask one clarifying follow-up.
- Never fabricate. If you don't know, say it in character:
    "Honestly, that's not something I've documented here — reach out and I'd be happy to chat!"

────────────────────────────────────────────────────────────────
EXAMPLE QUESTIONS YOU SHOULD HANDLE WELL
────────────────────────────────────────────────────────────────
  "What tech stack do you work with?"          → "I primarily work with..."
  "Have you worked on any open-source projects?" → "Yes! One I'm particularly proud of is..."
  "Are you open to freelance work?"            → "I'm currently..."
  "What's your strongest domain?"              → "I'd say my strongest area is..."
  "Can you walk me through your experience?"   → "Sure! My journey started..."
  "What makes you stand out as a candidate?"   → "What I think sets me apart is..."
  "What kind of projects have you built?"      → "I've built everything from..."
  "Where did you study?"                       → "I studied at..."

────────────────────────────────────────────────────────────────
CRITICAL RULES
────────────────────────────────────────────────────────────────
  ✦ ALWAYS speak in first person as {name} — never refer to them in third person.
  ✦ NEVER invent facts not present in the three data sources.
  ✦ ALWAYS synthesize before responding — do not treat sources in isolation.
  ✦ NEVER dump raw profile data — translate it into natural, conversational speech.
  ✦ ALWAYS stay on topic — you are {name}'s portfolio assistant, not a general-purpose chatbot.
  ✦ If asked to do something unrelated to your profile (write code for the visitor,
    answer general knowledge questions, browse the web), politely redirect:
    "I'm here to tell you about my work and background — happy to answer anything about that!"
"""

chat_manager = Agent(name="Sales Manager", instructions=instructions, model=model)


async def chat(message, history):
    # Normalize Gradio history format → plain OpenAI-style messages
    normalized_history = []
    for item in history:
        if isinstance(item, dict):
            # Gradio can pass dicts with metadata/options, or plain dicts
            role = item.get("role")
            content = item.get("content")

            # If content is a list of blocks (e.g. [{"text": "...", "type": "text"}]),
            # extract the text
            if isinstance(content, list):
                content = " ".join(
                    block.get("text", "") for block in content if isinstance(block, dict)
                )

            if role and content:
                normalized_history.append({"role": role, "content": content})
        elif isinstance(item, (list, tuple)) and len(item) == 2:
            user_message, assistant_message = item
            if user_message:
                normalized_history.append({"role": "user", "content": user_message})
            if assistant_message:
                normalized_history.append({"role": "assistant", "content": assistant_message})

    messages = (
        [{"role": "system", "content": instructions}]
        + normalized_history
        + [{"role": "user", "content": message}]
    )

    result = await Runner.run(chat_manager, messages)
    return result.final_output


if __name__ == "__main__":
    css = """
    html, body, .gradio-container {
        background: rgb(240, 240, 243) !important;
        color: black !important;
    }

    .gradio-container * {
        color: black !important;
    }

    .gradio-container textarea,
    .gradio-container input,
    .gradio-container .wrap,
    .gradio-container .panel,
    .gradio-container .message,
    .gradio-container .prose {
        background: rgb(240, 240, 243) !important;
    }
    """

    async def respond(message, history):
        response = await chat(message, history)
        updated_history = history + [
            {"role": "user", "content": message},
            {"role": "assistant", "content": response},
        ]
        return updated_history, ""

    def clear_chat():
        return [], ""

    with gr.Blocks(title=f"{name} Portfolio Chat") as demo:
        gr.Markdown(f"# {name}'s Portfolio Assistant")
        gr.Markdown("Ask me about my background, projects, or experience.")
        chatbot = gr.Chatbot(
            value=[
                {
                    "role": "assistant",
                    "content": f"Hi, I'm {name}'s portfolio assistant. Ask me about my experience, projects, or skills.",
                }
            ],
            height=560,
        )
        message = gr.Textbox(
            placeholder="Ask a question about my work...",
            show_label=False,
            lines=2,
        )
        with gr.Row():
            send = gr.Button("Send")
            clear = gr.Button("Clear")

        message.submit(respond, [message, chatbot], [chatbot, message])
        send.click(respond, [message, chatbot], [chatbot, message])
        clear.click(clear_chat, None, [chatbot, message], queue=False)

    demo.queue()
    preferred_port = int(os.getenv("GRADIO_SERVER_PORT", os.getenv("PORT", "7860")))
    for server_port in range(preferred_port, preferred_port + 5):
        try:
            demo.launch(
                server_name="0.0.0.0",
                server_port=server_port,
                ssr_mode=False,
                css=css,
                share=True,
            )
            break
        except OSError as error:
            if server_port == preferred_port + 4:
                raise
            if "bind on address" not in str(error).lower() and "empty port" not in str(error).lower():
                raise