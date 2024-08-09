import React, { useState } from 'react';
import {login} from '../api/login'

interface LoginFormProps {
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // 초기화

    try {
      await login({ username, password });
      // 로그인 성공 후 필요한 로직 (예: 페이지 리다이렉트)
      console.log('Login successful');
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };


  return (
    <div className="absolute top-16 right-4 bg-white p-4 rounded shadow-lg z-50">
      <form onSubmit={handleLogin}>
        <div className="mb-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">사용자 이름</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {error && <div className="mb-2 text-red-500 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md">로그인</button>
      </form>
    </div>
  );
};



export default LoginForm;
