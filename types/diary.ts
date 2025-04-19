
export interface DiaryEntry {
  id: string;
  date: Date;
  highlight: string;
  content: string;
  mood?: string;
  createdAt: Date;
  updatedAt?: Date;
}
