import React, { useState, useEffect } from "react";
import { Input, Button, List, Card } from "antd";
import { SendOutlined } from "@ant-design/icons";

const ChatboxAI: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    JSON.parse(localStorage.getItem("chat_messages") || "[]")
  );
  const [input, setInput] = useState("");

  useEffect(() => { 
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "User", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const aiResponse = {
        sender: "AI",
        text: `Bạn vừa nói: "${input}". Tôi có thể giúp gì nữa không?`,
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <Card title="Chatbox AI" style={{ width: 400, margin: "20px auto" }}>
      <List
        size="small"
        bordered
        style={{ height: 300, overflowY: "auto", marginBottom: 10 }}
        dataSource={messages}
        renderItem={(msg) => (
          <List.Item
            style={{ textAlign: msg.sender === "AI" ? "left" : "right" }}
          >
            <b>{msg.sender}:</b> {msg.text}
          </List.Item>
        )}
      />
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onPressEnter={handleSend}
        placeholder="Nhập tin nhắn..."
        addonAfter={<Button icon={<SendOutlined />} onClick={handleSend} />}
      />
    </Card>
  );
};

export default ChatboxAI;
