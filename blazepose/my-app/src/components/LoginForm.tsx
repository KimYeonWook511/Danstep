import React from 'react';

const LoginForm: React.FC = () => {
  return (
    <div className="absolute top-16 right-4 bg-white p-4 rounded shadow-lg z-50">
      <form>
        <div className="mb-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">사용자 이름</label>
          <input
            type="text"
            id="username"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md">로그인</button>
      </form>
    </div>
  );
};

export default LoginForm;
