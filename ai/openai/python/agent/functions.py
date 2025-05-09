
import asyncio
from agents import Agent, Runner, function_tool, set_default_openai_key

set_default_openai_key("OPENAI-API-KEY", True)

@function_tool
def get_weather(city: str) -> str:
    return f"The weather in {city} is sunny."


agent = Agent(
    name="Hello world",
    instructions="You are a helpful agent.",
    tools=[get_weather],
    model="gpt-4o-mini",
)


async def main():
    result = await Runner.run(agent, input="What's the weather in Sydney?")
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
