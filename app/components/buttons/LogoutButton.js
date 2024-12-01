'use client';

import { GrLogout } from "react-icons/gr";
import {signOut} from "next-auth/react";

export default function LogoutButton({
  className = 'flex items-center gap-2 border p-2 px-4 shadow',
  iconLeft = false,
  iconClasses = '',
}) {
  return (
    <button
      className={className}
      onClick={() => signOut()}>
      {/* {iconLeft && (
        <FontAwesomeIcon icon={faRightFromBracket} className={iconClasses} />
      )} */}
      <span>Logout</span>
      {!iconLeft && (
        <GrLogout className={iconClasses} />
      )}
    </button>
  );
}