export interface Message {
  id: string;
  from: "admin" | "user";
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  preview: string;
  date: string;
}
