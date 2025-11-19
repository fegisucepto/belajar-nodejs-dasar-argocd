const mockUser = {
  _id: 'some-id',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedpassword',
  save: jest.fn().mockResolvedValue(this),
  toObject: jest.fn().mockReturnThis()
};

// Mock static methods
mockUser.find = jest.fn().mockReturnThis();
mockUser.findById = jest.fn().mockResolvedValue(mockUser);
mockUser.findOne = jest.fn().mockResolvedValue(mockUser);
mockUser.create = jest.fn().mockResolvedValue(mockUser);
mockUser.deleteOne = jest.fn().mockResolvedValue(true);
mockUser.deleteMany = jest.fn().mockResolvedValue(true);
mockUser.exec = jest.fn().mockResolvedValue([mockUser]);

// Mock query builder methods
mockUser.select = jest.fn().mockReturnThis();
mockUser.lean = jest.fn().mockReturnThis();
mockUser.sort = jest.fn().mockReturnThis();
mockUser.limit = jest.fn().mockReturnThis();
mockUser.skip = jest.fn().mockReturnThis();

module.exports = jest.fn().mockImplementation(() => mockUser);