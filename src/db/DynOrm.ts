import { randomUUID } from "crypto";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
});

const docClient = DynamoDBDocumentClient.from(client);

class DynOrm {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async find<T>(key: string): Promise<GenericRecord & T> {
    const command = new GetCommand({
      TableName: this.name,
      Key: {
        id: key,
      },
    });

    const { Item } = await docClient.send(command);

    if (!Item) {
      throw {
        status: 404,
        data: {
          errors: ["Item does not exist`"],
        },
      };
    }

    return Item as GenericRecord & T;
  }

  async create<T>(record: T): Promise<GenericRecord & T> {
    const recordId = randomUUID();
    const command = new PutCommand({
      TableName: this.name,
      Item: {
        id: recordId,
        ...record,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
    });

    await docClient.send(command);
    const item = await this.find<T>(recordId);
    return item;
  }

  async update<T>(
    key: string,
    updateData: { [key: string]: string }
  ): Promise<GenericRecord & T> {
    const existingItem = await this.find<T>(key);

    delete updateData.id;
    delete updateData.updated_at;
    delete updateData.created_at;

    updateData = {
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    const keys = Object.keys(updateData);
    const keyNameExpressions = keys.map((name) => `#${name}`);
    const keyValueExpressions = keys.map((value) => `:${value}`);
    const UpdateExpression =
      "set " +
      keyNameExpressions
        .map((nameExpr, idx) => `${nameExpr} = ${keyValueExpressions[idx]}`)
        .join(", ");
    const ExpressionAttributeNames = keyNameExpressions.reduce(
      (exprs, nameExpr, idx) => ({ ...exprs, [nameExpr]: keys[idx] }),
      {}
    );
    const ExpressionAttributeValues = keyValueExpressions.reduce(
      (exprs, valueExpr, idx) => ({
        ...exprs,
        [valueExpr]: updateData[keys[idx]],
      }),
      {}
    );

    const command = new UpdateCommand({
      TableName: this.name,
      Key: { ["id"]: existingItem.id },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    });

    await docClient.send(command);
    const item = await this.find<T>(key);
    return item;
  }

  async delete<T>(key: string): Promise<{ success: boolean}> {
    const existingItem = await this.find<T>(key);
    const command = new DeleteCommand({
      TableName: this.name,
      Key: {
        id: existingItem.id,
      },
    });

    try {
      await docClient.send(command);
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }
}

export default DynOrm;
