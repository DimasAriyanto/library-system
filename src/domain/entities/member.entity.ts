import { z } from 'zod';

export const MemberSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(1, 'Member code is required.'),
  name: z.string().min(1, 'Member name is required.'),
  borrowedBooks: z.array(z.string()).default([]),
  penaltyExpiry: z.date().nullable().default(null),
});

export type Member = z.infer<typeof MemberSchema>;

export class MemberEntity {
  private member: Member;

  constructor(member: Member) {
    const parsed = MemberSchema.parse(member);
    this.member = parsed;
  }

  get data() {
    return this.member;
  }

  canBorrowBook(): boolean {
    if (this.member.penaltyExpiry && new Date() < this.member.penaltyExpiry) {
      return false;
    }
    return this.member.borrowedBooks.length < 2;
  }

  addBorrowedBook(bookCode: string): void {
    if (!this.canBorrowBook()) {
      throw new Error(
        'Member cannot borrow more than 2 books or is under penalty.',
      );
    }
    this.member.borrowedBooks.push(bookCode);
  }

  removeBorrowedBook(bookCode: string): void {
    this.member.borrowedBooks = this.member.borrowedBooks.filter(
      (code) => code !== bookCode,
    );
  }

  applyPenalty(days: number): void {
    const now = new Date();
    now.setDate(now.getDate() + days);
    this.member.penaltyExpiry = now;
  }
}
