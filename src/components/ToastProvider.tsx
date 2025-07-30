import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastProvider = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      style={{
        fontSize: '14px',
        fontFamily: 'Inter, system-ui',
      }}
      toastStyle={{
        backgroundColor: 'var(--background-dark)',
        color: 'var(--text-primary)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-lg)',
      }}
    />
  );
};