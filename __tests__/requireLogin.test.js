
import { jest } from "@jest/globals";
import { requireLogin } from "../middleware/requireLogin.js";

test("requireLogin rejects a user who is not logged in", () => {
  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  requireLogin(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({
    error: "not logged in",
  });
  expect(next).not.toHaveBeenCalled();
});

test("requireLogin allows a logged-in user", () => {
  const req = {
    user: {
      id: "user-123",
      role: "member",
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  requireLogin(req, res, next);

  expect(next).toHaveBeenCalledTimes(1);
  expect(res.status).not.toHaveBeenCalled();
});
