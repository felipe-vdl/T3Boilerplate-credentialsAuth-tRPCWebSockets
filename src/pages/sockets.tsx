import Head from "next/head";
import { api } from "@/utils/api";
import { useState } from "react";

interface FormType {
  message: string;
}

export default function Home() {
  const [hookData, setHookData] = useState<string>("");

  const [form, setForm] = useState<FormType>({
    message: "",
  });

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setForm((st) => ({
      ...st,
      [evt.target.name]: evt.target.value,
    }));
  };

  api.target.webhookSubscription.useSubscription(undefined, {
    onData: (data) => {
      setHookData(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate, isLoading } = api.target.setData.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    mutate(form);
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex-1">
        <pre className="bg-stone-700 p-4 text-white">{hookData}</pre>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-2 p-2"
        >
          <input
            className="border border-slate-800 px-2 py-1"
            placeholder="Message"
            name="message"
            value={form.message}
            onChange={handleChange}
          />
          <button
            disabled={isLoading}
            className="rounded bg-green-500 px-2 py-1 text-white"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}
