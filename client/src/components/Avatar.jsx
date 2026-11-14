import { useState } from 'react';
import { PROFILE } from '../config';

// صورتك الدائرية. إن لم يوجد الملف يظهر رمز بديل.
export default function Avatar() {
  const [failed, setFailed] = useState(false);
  return (
    <div className="avatar">
      {failed ? '👩‍💻' : <img src={PROFILE.avatar} alt="" onError={() => setFailed(true)} />}
    </div>
  );
}
