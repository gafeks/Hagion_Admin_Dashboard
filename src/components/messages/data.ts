export interface Message {
  id: string;
  from: "admin" | "user";
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  preview: string;
  date: string;
  unread: number;
  email: string;
  messages: Message[];
}

export const conversations: Conversation[] = [
  {
    id: "1",
    name: "Prosper Ikiriko",
    initials: "PI",
    avatarColor: "#2D2555",
    preview: "Understood. I also noticed RFQ-2026-008 from NileHealth has been in 'Revi…",
    date: "Apr 1",
    unread: 0,
    email: "prosper.ikiriko@financecore.com",
    messages: [
      {
        id: "m1",
        from: "admin",
        text: "Prosper, welcome to the team! I've added you to the admin portal. Your first task is to review all open RFQs and update their statuses in the system.",
        time: "5:33 AM",
      },
      {
        id: "m2",
        from: "user",
        text: "Thank you! I've logged in and can see the dashboard. I'll go through the open RFQs right away. Should I assign them to team members or leave that to you?",
        time: "5:33 AM",
      },
      {
        id: "m3",
        from: "admin",
        text: "For now, just update the statuses. I'll handle the assignments. Also, make sure you read through the client notes for each RFQ — context is everything in sales.",
        time: "5:33 AM",
      },
      {
        id: "m4",
        from: "user",
        text: "Understood. I also noticed RFQ-2026-008 from NileHealth has been in 'Reviewing' status for over 3 weeks with no update. Should I escalate it?",
        time: "5:33 AM",
      },
      {
        id: "m5",
        from: "admin",
        text: "Good catch! Yes, flag it as high priority and I'll personally reach out to the NileHealth contact today. This is exactly the kind of attention to detail we need.",
        time: "5:33 AM",
      },
      {
        id: "m6",
        from: "user",
        text: "Done! I've also drafted a brief summary of all open RFQs with recommended next steps. Should I send it to you via email or is there a shared document I should use?",
        time: "5:33 AM",
      },
      {
        id: "m7",
        from: "admin",
        text: "Send it via email for now and cc the operations team. We'll set up a shared workspace for the team next week — it's in the pipeline.",
        time: "5:33 AM",
      },
    ],
  },
  {
    id: "2",
    name: "Oshor Blessing",
    initials: "OB",
    avatarColor: "#2D2555",
    preview: "Hi, I wanted to check in on the IT infrastructure audit we discussed last…",
    date: "Apr 1",
    unread: 1,
    email: "oshor.blessing@medtechlabs.com",
    messages: [
      {
        id: "m1",
        from: "user",
        text: "Hi, I wanted to check in on the IT infrastructure audit we discussed last week. Has your team had a chance to review the scope document I sent over?",
        time: "4:10 AM",
      },
    ],
  },
  {
    id: "3",
    name: "Afekemor Gift",
    initials: "AG",
    avatarColor: "#068653",
    preview: "Hey, I just reviewed the March analytics report. Our RFQ conversion rat…",
    date: "Apr 1",
    unread: 1,
    email: "afekemor.gift@retailpulse.com",
    messages: [
      {
        id: "m1",
        from: "user",
        text: "Hey, I just reviewed the March analytics report. Our RFQ conversion rate dropped by 12% compared to February. Do you have any insight into what drove that?",
        time: "3:55 AM",
      },
    ],
  },
];
