import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. هنعمل الـ Context (المكان اللي هنخزن فيه الداتا)
const AuthContext = createContext();

// 2. ده الـ Provider اللي "بيغلف" المشروع كله عشان يوزع البيانات
export const AuthProvider = ({ children }) => {
  
  // التعديل الأول: أول ما الموقع يفتح، هندور على اليوزر في المتصفح الأول
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // دالة تسجيل الدخول
const login = (userData, token) => {
  setUser(userData);
  localStorage.setItem('token', token); // بنحفظ التوكن اللي جاي مباشرة
  localStorage.setItem('user', JSON.stringify(userData)); // بنحفظ اليوزر
};
  // دالة تسجيل الخروج
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // التعديل التالت: نمسح اليوزر من المتصفح
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. دالة سهلة عشان نستخدم الـ Context في أي صفحة
export const useAuth = () => useContext(AuthContext);