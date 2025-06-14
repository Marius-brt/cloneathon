import { PasswordInput } from "@/components/password";
import { SettingsField } from "@/components/settings-field";
import { getUserSettings } from "@/lib/server/repositories/user.repository";
import { Form } from "./_ui/form";

export default async function SettingsPage() {
  const settings = await getUserSettings();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 pt-20">
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
    </div>
  );
}
