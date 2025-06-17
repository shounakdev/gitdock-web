
"use client"

import { useState } from 'react';
import { auth, db } from '@/firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

export default function AccountSetup() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [orgName, setOrgName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [existingOrgId, setExistingOrgId] = useState("");
  const [role, setRole] = useState("developer");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!user) return;
    try {
      const uid = user.uid;
      let orgId = "";

      if (isJoining) {
        const orgDoc = await getDoc(doc(db, "organizations", existingOrgId));
        if (!orgDoc.exists()) {
          setError("Organization does not exist");
          return;
        }
        orgId = existingOrgId;
      } else {
        orgId = orgName.toLowerCase().replace(/\s+/g, "-");
        await setDoc(doc(db, "organizations", orgId), {
          name: orgName,
          createdBy: uid,
        });
      }

      await setDoc(doc(db, "users", uid), {
        name: user.displayName || user.email,
        email: user.email,
        role,
        orgId,
      });

      router.push("/dashboard/repos");
    } catch (err) {
      setError("Failed to setup account. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 text-white space-y-6">
      <h2 className="text-2xl font-bold">Setup Your GitDock Account</h2>

      <div className="space-y-3">
        <label className="flex items-center space-x-3">
          <input type="checkbox" checked={isJoining} onChange={() => setIsJoining(!isJoining)} />
          <span>Join existing organization</span>
        </label>

        {isJoining ? (
          <input
            type="text"
            placeholder="Organization ID"
            value={existingOrgId}
            onChange={(e) => setExistingOrgId(e.target.value)}
            className="w-full px-3 py-2 text-black rounded"
          />
        ) : (
          <input
            type="text"
            placeholder="Organization Name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="w-full px-3 py-2 text-black rounded"
          />
        )}

        <select
          className="w-full px-3 py-2 text-black rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="developer">Developer</option>
          <option value="viewer">Viewer</option>
        </select>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold"
        >
          Submit
        </button>

        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>
    </div>
  );
}
