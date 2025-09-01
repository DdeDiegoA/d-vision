import {
  IconButton,
  Paper,
  TextField,
  Box,
  CircularProgress
} from '@mui/material';
import React, { useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';

interface ChatInputProps {
  onSendMessage: (content: string, imageData?: string) => Promise<void>;
  onAddImage: (imageData: string) => void;
  pendingImages: string[];
  isLoading: boolean;
}
export default function ChatInput({
  onSendMessage,
  onAddImage,
  pendingImages,
  isLoading
}: ChatInputProps) {
  const [message, setMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onAddImage(base64String);
        setMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      sx={{
        alignSelf: 'center',
        width: { lg: '50%', md: '80%', xs: '100%' }
      }}
    >
      {/* Previsualización de imágenes pendientes */}
      {pendingImages.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            px: 2,
            pt: 2,
            overflowX: 'auto'
          }}
        >
          {pendingImages.map((imageData, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                minWidth: 100,
                height: 100
              }}
            >
              <Box
                component="img"
                src={`data:image/jpeg;base64,${imageData}`}
                alt={`Preview ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 2
                }}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Formulario principal de chat */}
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1.5,
          mt: 2,
          bgcolor: 'background.paper',
          borderRadius: 5,
          mb: 2
        }}
      >
        {/* Input oculto para cargar imágenes */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Botón para seleccionar imagen */}
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          sx={{
            p: 1.2,
            borderRadius: 5,
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <ImageIcon />
        </IconButton>

        {/* Campo de entrada de texto */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Escribe un mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (message.trim()) {
                onSendMessage(message);
                setMessage('');
              }
            }
          }}
        />

        {/* Botón de envío con estado de carga */}
        <IconButton
          type="submit"
          color="primary"
          disabled={!message.trim() || isLoading}
          sx={{
            p: 1.2,
            borderRadius: 2
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Paper>
    </Box>
  );
}
