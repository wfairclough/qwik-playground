
export interface User {
  name_id: string;
  email?: string;
  given_name?: string;
  name?: string;
  upn?: string;
  common_name?: string;
  group?: string;
  role?: string;
  surname?: string;
  ppid?: string;
  authentication_method?: string;
  deny_only_group_sid?: string;
  deny_only_primary_sid?: string;
  deny_only_primary_group_sid?: string;
  group_sid?: string;
  primary_group_sid?: string;
  primary_sid?: string;
  windows_account_name?: string;
  session_index?: string | undefined;
  session_not_on_or_after?: string | undefined;
  attributes?: { [attr: string]: string | string[] } | undefined;
}

const sessions = new Map<string, User>();

export const addSession = (user: User) => {
  const session = user;
  sessions.set(user?.attributes?.sessionId as string, session);
  return session;
};

export const getSession = (sessionId: string) => {
  const value = sessions.get(sessionId);
  if (!value) return null;
  const { session_not_on_or_after: notAfter } = value;
  if (notAfter && new Date(notAfter) < new Date()) {
    sessions.delete(sessionId);
    return null;
  }
  return value;
};

