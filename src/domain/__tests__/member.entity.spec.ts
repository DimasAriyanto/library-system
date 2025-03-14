import { MemberEntity } from '../entities/member.entity';
import { v4 as uuidv4 } from 'uuid';

describe('MemberEntity', () => {
  let member: MemberEntity;

  beforeEach(() => {
    member = new MemberEntity({
      id: uuidv4(),
      code: 'M001',
      name: 'Angga',
      borrowedBooks: [],
      penaltyExpiry: null,
    });
  });

  it('should allow borrowing if member has less than 2 borrowed books and no penalty', () => {
    expect(member.canBorrowBook()).toBe(true);
  });

  it('should not allow borrowing if member has already borrowed 2 books', () => {
    member.addBorrowedBook('JK-45');
    member.addBorrowedBook('SHR-1');

    expect(() => member.addBorrowedBook('TW-11')).toThrowError(
      'Member cannot borrow more than 2 books or is under penalty.',
    );
  });

  it('should not allow borrowing if member is under penalty', () => {
    member.applyPenalty(3);

    expect(() => member.addBorrowedBook('JK-45')).toThrowError(
      'Member cannot borrow more than 2 books or is under penalty.',
    );
  });

  it('should add a book to borrowedBooks list', () => {
    member.addBorrowedBook('JK-45');

    expect(member.data.borrowedBooks).toContain('JK-45');
  });

  it('should remove a book from borrowedBooks list', () => {
    member.addBorrowedBook('JK-45');
    member.removeBorrowedBook('JK-45');

    expect(member.data.borrowedBooks).not.toContain('JK-45');
  });

  it('should set penalty expiry date correctly', () => {
    const now = new Date();
    member.applyPenalty(3);

    const penaltyExpiry = member.data.penaltyExpiry!;
    const expectedExpiry = new Date(now);
    expectedExpiry.setDate(now.getDate() + 3);

    expect(penaltyExpiry.toDateString()).toEqual(expectedExpiry.toDateString());
  });
});
