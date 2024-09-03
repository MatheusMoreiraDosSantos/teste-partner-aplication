export interface IPartner {
  createdAt: string;
  name: string;
  description: string;
  repositoryGit: string;
  urlDoc: string;
  clients: (string | number)[];
  projects: (string | number)[];
  id: string;
}
