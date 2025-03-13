export interface Attachment {
  name: string;
  url: string;
}

export interface EmailTemplate {
  id: string;
  subject: string;
  body: string;
  attachments: Attachment[];
  category: string; // Add a category field
}