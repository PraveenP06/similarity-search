import React, { useRef, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [value, setValue] = React.useState("");
  const [conversation, setConversation] = React.useState([]);
  const inputRef = useRef(null);

  const handleInput = React.useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      const chatHistory = [...conversation, { role: "user", content: value }];
      const response = await fetch("/api/openAIChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await response.json();
      setValue("");
      setConversation([
        ...chatHistory,
        { role: "assistant", content: data.result.choices[0].message.content },
      ]);
    }
  };

  const handleRefresh = () => {
    inputRef.current?.focus();
    setValue("");
    setConversation([]);
  };

  useEffect(() => {
    if (value) {
      createEmbedding(value);
    }
  }, [value]);


  const createEmbedding = async (value) => {
    console.log("Creating embedding...")
    const params = {
      queries: [value],
    };
  
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/engines/davinci/calculate_embeddings",
        params,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
  
      console.log(response.data.results[0].embedding);
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center w-2/3 mx-auto mt-40 text-center">
        <h1 className="text-6xl">Hi there, I am AVA</h1>
        <div className="my-12">
          <p className="mb-6 font-bold">Please type your prompt</p>
          <input
            placeholder="Type here"
            className="w-full max-w-xs input input-bordered input-secondary"
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
          <button
            className="mt-6 btn btn-primary btn-xs"
            onClick={handleRefresh}
          >
            Start New Conversation
          </button>
        </div>
        <div className="textarea">
          {conversation.map((item, index) => (
            <React.Fragment key={index}>
              <br />
              {item.role === "assistant" ? (
                <div className="chat chat-end">
                  <div className="chat-bubble chat-bubble-secondary">
                    <strong className="badge badge-primary">AVA</strong>
                    <br />
                    {item.content}
                  </div>
                </div>
              ) : (
                <div className="chat chat-start">
                  <div className="chat-bubble chat-bubble-primary">
                    <strong className="badge badge-secondary">User</strong>
                    <br />
                    {item.content}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
