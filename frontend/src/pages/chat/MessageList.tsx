import { Box, List, ListItem, Paper } from '@mui/material';
import { useEffect, useRef } from 'react';
import type { Message } from '../../types/chat.types';
import ReactMarkdown from 'react-markdown';

interface MessageListProps {
  messages: Message[];
  streamingMessage?: string;
}
export default function MessageList({
  messages,
  streamingMessage
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  return (
    <List>
      {messages.map((msg, index) => (
        <ListItem
          key={index}
          sx={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}
        >
          <Paper
            sx={{
              p: 1.5,
              maxWidth: '70%',
              bgcolor:
                msg.role === 'user' ? 'primary.main' : 'background.paper',
              color:
                msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
              borderRadius: 3
            }}
          >
            <ReactMarkdown
              components={{
                p: (props) => (
                  <Box
                    component={'p'}
                    sx={{ m: 0, mb: 0, lineHeight: 1.4 }}
                    {...props}
                  />
                ),
                strong: (props) => (
                  <Box
                    component="strong"
                    sx={{ fontWeight: 'bold' }}
                    {...props}
                  />
                ),
                em: ({ ...props }) => (
                  <Box component="em" sx={{ fontStyle: 'italic' }} {...props} />
                ),
                code: ({
                  inline,
                  className,
                  ...props
                }: React.ClassAttributes<HTMLElement> &
                  React.HTMLAttributes<HTMLElement> & {
                    inline?: boolean;
                    className?: string;
                  }) =>
                  inline ? (
                    <Box
                      component="code"
                      sx={{
                        bgcolor: 'action.hover',
                        px: 0.5,
                        borderRadius: 1,
                        fontFamily: 'monospace'
                      }}
                      className={className}
                      {...props}
                    />
                  ) : (
                    <Box
                      component="pre"
                      sx={{
                        bgcolor: 'grey.900',
                        color: 'grey.100',
                        p: 1.5,
                        borderRadius: 2,
                        overflowX: 'auto',
                        fontFamily: 'monospace'
                      }}
                    >
                      <code {...props} />
                    </Box>
                  ),
                img: ({ ...props }) => (
                  <Box
                    component="img"
                    sx={{
                      borderRadius: 2,
                      maxWidth: '100%',
                      my: 1.5
                    }}
                    {...props}
                  />
                )
              }}
            >
              {msg.content}
            </ReactMarkdown>
            {msg.image_data && (
              <Box>
                {Array.isArray(msg.image_data) ? (
                  msg.image_data.map((imgData, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={`data:image/jpeg;base64,${imgData}`}
                      alt={`Image ${imgIndex}`}
                      width={300}
                      style={{
                        marginTop: '10px',
                        borderRadius: 5,
                        objectFit: 'contain'
                      }}
                    />
                  ))
                ) : (
                  <img
                    src={`data:image/jpeg;base64,${msg.image_data}`}
                    alt="Uploaded image"
                    width={300}
                    style={{
                      marginTop: '10px',
                      borderRadius: 5,
                      objectFit: 'contain'
                    }}
                  />
                )}
              </Box>
            )}
          </Paper>
        </ListItem>
      ))}

      {streamingMessage && (
        <ListItem
          sx={{
            display: 'flex',
            justifyContent: 'flex-start'
          }}
        >
          <Paper
            sx={{
              p: 1.5,
              maxWidth: '70%',
              bgcolor: 'background.paper',
              color: 'text.primary',
              borderRadius: 3
            }}
          >
            <ReactMarkdown>{streamingMessage}</ReactMarkdown>
          </Paper>
        </ListItem>
      )}
    </List>
  );
}
