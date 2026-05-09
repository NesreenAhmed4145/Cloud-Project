import React from 'react'; // السطر ده هو اللي ناقص وموقف الدنيا!
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user } = useAuth();

  // 1. لو اليوزر مش عامل Login أصلاً، اطرده لصفحة الـ Login
  if (!user) {
    // ضفنا كلمة replace عشان زرار "الرجوع" في المتصفح ميعلقش
    return <Navigate to="/login" replace />; 
  }

  // 2. لو اليوزر موجود بس الـ Role بتاعه مش مطابق للي إحنا طالبينه
    if (roleRequired && user.type !== roleRequired) {
    // الأفضل نوجهه للصفحة الرئيسية بدل اللوجين، لأنه بالفعل مسجل دخول بس ملوش صلاحية
    return <Navigate to="/" replace />; 
  }

  // 3. لو كل حاجة تمام، عدي يا باشا
  return children;
};

export default ProtectedRoute;