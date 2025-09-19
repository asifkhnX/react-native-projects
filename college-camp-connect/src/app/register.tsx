import React from 'react';

import { RegisterForm } from '@/components/register-form';
import { FocusAwareStatusBar } from '@/components/ui';

export default function Register() {
  return (
    <>
      <FocusAwareStatusBar />
      <RegisterForm />
    </>
  );
}
