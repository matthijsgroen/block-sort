const USERNAME_KEY = "study-username";
const USER_KEY_KEY = "study-user-key";

export const normalizeUserKey = (username: string) =>
  username
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 64);

export const loadStoredUser = () => {
  const username = localStorage.getItem(USERNAME_KEY) ?? "";
  const storedUserKey = localStorage.getItem(USER_KEY_KEY) ?? "";
  const userKey = storedUserKey || normalizeUserKey(username);
  return { username, userKey };
};

export const persistUser = (username: string) => {
  const userKey = normalizeUserKey(username);
  localStorage.setItem(USERNAME_KEY, username);
  localStorage.setItem(USER_KEY_KEY, userKey);
  return userKey;
};
