import { PasswordInput } from "@/components/password";
import { SettingsField } from "@/components/settings-field";
import { AgentRepository } from "@/lib/server/repositories/agent.repository";
import { getUserSettings } from "@/lib/server/repositories/user.repository";
import { Agents } from "./_ui/agents";
import { Form } from "./_ui/form";

export default async function SettingsPage() {
  const settings = await getUserSettings();
  const agents = await AgentRepository.getAgents();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 pt-20">
      <h1 className="font-bold text-2xl">Settings</h1>
      <Form>
        <SettingsField
          name="OpenRouter API Key"
          description={
            <>
              OpenRouter is used to generate responses. Get your API key{" "}
              <a
                href="https://openrouter.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                here
              </a>
              .
            </>
          }
        >
          <PasswordInput
            id="apiKey"
            name="apiKey"
            placeholder="OpenRouter API Key"
            defaultValue={settings?.apiKey ?? ""}
          />
        </SettingsField>
      </Form>
      <SettingsField
        className="mt-4"
        name="Agents"
        description="Agents are used to generate responses. You can create multiple agents with different instructions."
      >
        <Agents agents={agents} />
      </SettingsField>
    </div>
  );
}
