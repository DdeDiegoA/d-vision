// ChatUI.tsx
import React, { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import type { Message } from '../../types/chat.types';
import { chatApi } from '../../lib/api';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatUI: React.FC = () => {
  // ? Estado de almacenamiento para mensajes
  const [messages, setMessages] = useState<Message[]>([]);
  // ? Estado de carga
  const [loading, setLoading] = useState<boolean>(false);
  // ? Estado de imágenes pendientes
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  // ? Estado de mensaje en streaming
  const [streamingMessage, setStreamingMessage] = useState<string>('');

  const handleAddImage = (imageData: string) => {
    setPendingImages((prev) => [...prev, imageData]);
  };

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      role: 'user',
      content,
      ...(pendingImages.length > 0 && { image_data: pendingImages })
    };

    try {
      setLoading(true);
      setPendingImages([]);
      setMessages((prev) => [...prev, newMessage]);
      setStreamingMessage('');

      //todo: llamar al api
      await chatApi.sendMessage([...messages, newMessage], (chunk) => {
        if (chunk.status === 'streaming' && chunk.content) {
          setStreamingMessage(chunk.content);
        } else if (chunk.status === 'generating_image') {
          setStreamingMessage('Generando imagen...');
        } else if (chunk.status === 'done' && chunk.content) {
          const assistantMessage: Message = {
            role: 'assistant',
            content: chunk.content
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setStreamingMessage('');
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
      setPendingImages([]);
    }
  };
  console.log(messages);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        margin: 'auto',
        bgcolor: 'background.default',
        color: 'text.primary',
        justifyContent: 'center'
      }}
    >
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          textAlign: 'center',
          bgcolor: 'background.paper'
        }}
      >
        <Typography variant="h6">D-Vision</Typography>
      </Paper>

      {/* Messages */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          width: { lg: '50%', md: '80%', xs: '100%' },
          alignSelf: 'center',
          p: 2
        }}
      >
        <MessageList messages={messages} streamingMessage={streamingMessage} />
      </Box>

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onAddImage={handleAddImage}
        pendingImages={pendingImages}
        isLoading={loading}
      />
    </Box>
  );
};

export default ChatUI;
