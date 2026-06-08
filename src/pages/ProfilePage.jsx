import { useAuth } from "../contexts/AuthContext";

function ProfilePage() {
  const { token, user } = useAuth();

  return (
    <div>
      <h1>Profile</h1>

      <p>User: {user?.name}</p>
      <p>Token: {token}</p>
    </div>
  );
}

export default ProfilePage;