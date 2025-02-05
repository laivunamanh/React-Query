import React, { useState, useEffect } from "react";
import { Input, Button, List, Card } from "antd";
import { SendOutlined } from "@ant-design/icons";

const Chatbox: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    JSON.parse(localStorage.getItem("chat_messages") || "[]")
  );
  const [input, setInput] = useState("");
  const [userType, setUserType] = useState<"User" | "Admin">("User");

  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = { sender: userType, text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <Card title="Chatbox" style={{ width: 500, margin: "20px auto" }}>
      <List
        size="small"
        bordered
        style={{ height: 300, overflowY: "auto", marginBottom: 10 }}
        dataSource={messages}
        renderItem={(msg) => (
          <List.Item
            style={{ textAlign: msg.sender === "User" ? "right" : "left" }}
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
      <Button
        onClick={() => setUserType(userType === "User" ? "Admin" : "User")}
        style={{ marginTop: 10 }}
      >
        Chuyển sang {userType === "User" ? "Admin" : "User"}
      </Button>
    </Card>
  );
};

const ChatBox: React.FC = () => {
  return (
    <div>
      <Chatbox />
    </div>
  );
};

export default ChatBox;
