import "aws-sdk-client-mock-jest";
import { UserService } from "./user.service";
import { randomUUID } from "crypto";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

describe("UserService", () => {
  const userService = new UserService();
  const ddbMock = mockClient(DynamoDBDocumentClient);
  const userId = randomUUID();

  beforeEach(() => {
    ddbMock.reset();
  });

  it("#find calls DynamoDB and returns item", async () => {
    ddbMock.on(GetCommand).resolves({
      Item: { id: userId, name: "John", email: "john@example.com" },
    });

    const response = await userService.find(userId);
    expect(ddbMock).toHaveReceivedCommandWith(GetCommand, {
      TableName: "users",
      Key: {
        id: userId,
      },
    });

    expect(response.id).toBe(userId);
  });

  it("#create calls DynamoDB and returns new item with timestamps", async () => {
    const newUser = {
      name: "Lilly",
      email: "lilly@example.com",
      dob: new Date().toISOString(),
    };

    ddbMock.on(GetCommand).resolves({
      Item: newUser,
    });
    const response = await userService.create(newUser);
    expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
      TableName: "users",
      Item: {
        id: expect.any(String),
        name: newUser.name,
        email: newUser.email,
        dob: newUser.dob,
        updated_at: expect.any(String),
        created_at: expect.any(String),
      },
    });

    expect(response.name).toBe("Lilly");
  });

  it("#update calls DynamoDB, updates record and the updated_at timestamp", async () => {
    const updateUser = {
      name: "Kyle",
      email: "kyle@salmon.com",
      dob: new Date().toISOString(),
    };

    ddbMock.on(GetCommand).resolves({
      Item: updateUser,
    });
    const response = await userService.update(userId, updateUser);
    expect(ddbMock).toHaveReceivedCommandWith(UpdateCommand, {
      TableName: "users",
      Key: { ["id"]: userId },
      UpdateExpression:
        "set #name = :name, #email = :email, #dob = :dob, #updated_at = :updated_at",
    });

    expect(response.name).toBe(updateUser.name);
  });

  it("#delete calls DynamoDB, removes record and returns a success status", async () => {
    const response = await userService.delete(userId);
    expect(ddbMock).toHaveReceivedCommandWith(DeleteCommand, {
      TableName: "users",
      Key: {
        id: userId,
      },
    });

    expect(response.success).toBe(true);
  });
});
