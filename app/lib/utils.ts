import { Types } from 'mongoose';

interface BaseDocument {
  _id?: any;
  [key: string]: any;
}

export function serializeMongoDoc<T extends BaseDocument>(doc: T | null): any {
  if (!doc) return null;

  const processValue = (value: any): any => {
    if (!value) return value;

    // Handle ObjectId
    if (Types.ObjectId.isValid(value) && typeof value.toString === 'function') {
      return value.toString();
    }

    // Handle Date objects
    if (value instanceof Date) {
      return value.toISOString();
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.map(processValue);
    }

    // Handle nested objects
    if (typeof value === 'object') {
      return serializeObject(value);
    }

    return value;
  };

  const serializeObject = (obj: any): any => {
    if (!obj) return obj;

    const serialized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === '_id') {
        serialized.id = processValue(value);
        continue;
      }
      serialized[key] = processValue(value);
    }
    return serialized;
  };

  // Handle Mongoose document
  if (typeof doc.toObject === 'function') {
    return serializeObject(doc.toObject());
  }

  // Handle plain object
  return serializeObject(doc);
}
