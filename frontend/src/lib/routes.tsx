import { createBrowserRouter } from 'react-router-dom';
import ChatUI from '../pages/chat/ChatUI';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ChatUI />
  }
]);
