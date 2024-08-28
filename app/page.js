"use client";
import { TextField, Box, Stack, Button, Switch, Typography } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I am the LOVA AI Professor support assistant. How can I help you today?",
    }
  ]);

  const [message, setMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false); // new state for dark mode

  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" }
    ]);
    setMessage('');

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };

  const handleDarkModeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: darkMode ? "#333" : "#f7f7f7",
        padding: 2,
      }}
    >
      <Stack
        direction="column"
        width={{ xs: "90%", sm: "500px" }} // Adjust width for mobile screens
        height="700px"
        border="1px solid #ddd"
        borderRadius={4}
        p={2}
        spacing={3}
        sx={{
          boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
          backgroundColor: darkMode ? "#444" : "#f7f7f7",
        }}
      >
        {/* Header with app name */}
        <Typography variant="subtitle2" color={darkMode ? "#fff" : "#000"} textAlign="center">
          LOVA AI PROFESSOR
        </Typography>

        {/* Messages container */}
        <Stack direction="column" spacing={2} flexGrow={1} overflow="auto" maxHeight="100vh">
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
              className={index === messages.length - 1 ? "show" : ""}
            >
              <Box
                bgcolor={
                  message.role === "assistant"
                    ? darkMode ? "#666" : "#1976d2"
                    : darkMode ? "#777" : "#9c27b0"
                }
                color={darkMode ? "#fff" : "white"}
                borderRadius={16}
                p={2}
                sx={{
                  maxWidth: '70%'
                }}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>

        {/* Input area with text field, send button, and dark mode switch */}
        <Stack direction="row" spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            sx={{
              '& ,MuiInputBase-input': {
                padding: '10px',
              },
              backgroundColor: darkMode ? "#444" : "#f7f7f7",
              color: darkMode ? "#fff" : "black",
            }}
          />
          <Button variant="contained" onClick={sendMessage} sx={{ height: 55 }} className="send-button">
            Send
          </Button>
          <Switch checked={darkMode} onChange={handleDarkModeChange} />
        </Stack>
      </Stack>
    </Box>
  );
}
