
import asyncio
from agents import Agent, Runner, set_default_openai_key

set_default_openai_key("OPEnAI-API-KEY", True)

spanish_agent = Agent(
    name="Spanish agent",
    instructions="You only speak Spanish.",
    model="gpt-4o-mini",
)

english_agent = Agent(
    name="English agent",
    instructions="You only speak English",
    model="gpt-4o-mini",
)

triage_agent = Agent(
    name="Triage agent",
    instructions="Handoff to the appropriate agent based on the language of the request.",
    handoffs=[spanish_agent, english_agent],
    model="gpt-4o-mini",
)


async def main():
    result = await Runner.run(triage_agent, input="hello, how are you?")
    print(result.final_output)

if __name__ == "__main__":
    asyncio.run(main())
