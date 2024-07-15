import AWS from "aws-sdk";
import { randomUUID } from "crypto";

const dbClient = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://0.0.0.0:8000",
  accessKeyId: "MockAccessKeyId",
  secretAccessKey: "MockSecretAccessKey",
});

class DynOrm {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async find<T>(key: string): Promise<GenericRecord & T> {
    const params = {
      TableName: this.name,
      Key: {
        id: key,
      },
    };

    const result = await dbClient.get(params).promise();
    return result.Item as GenericRecord & T;
  }

  async create<T>(record: T ): Promise<GenericRecord & T> {
    const recordId = randomUUID();
    const params = {
      TableName: this.name,
      Item: {
        id: recordId,
        ...record,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
    };

    await dbClient.put(params).promise();
    const item = await this.find<T>(recordId);
    return item;
  }

  async update<T>(
    key: string,
    updateData: { [key: string]: string }
  ): Promise<GenericRecord & T> {
    delete updateData.id;
    delete updateData.updated_at;
    delete updateData.created_at;

    updateData = {
      ...updateData,
      updated_at: new Date().toISOString(),
    }
    
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

    const params = {
      TableName: this.name,
      Key: { ["id"]: key },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    };
    await dbClient.update(params).promise();
    const item = await this.find<T>(key);
    return item;
  }

  async delete(key: string): Promise<{ success: boolean }> {
    const params = {
      TableName: this.name,
      Key: {
        id: key,
      },
    };

    return dbClient
      .delete(params)
      .promise()
      .then(() => ({ success: true }))
      .catch(() => ({ success: false }));
  }
}

export default DynOrm;
