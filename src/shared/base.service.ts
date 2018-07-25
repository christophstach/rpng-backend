import { Model } from 'mongoose';
import { BaseModel } from './base.model';

export abstract class BaseService<T extends BaseModel> {

  protected model: Model<T>;

  async findAll(filter: Partial<T> = {}): Promise<T[]> {
    return this.model.find(filter);
  }

  async findOne(filter: Partial<T> = {}): Promise<T> {
    return this.model.findOne(filter);
  }

  async findById(id: string): Promise<T> {
    return this.model.findById(id);
  }

  async create(item: Partial<T>): Promise<T> {
    return this.model.create(item);
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    return this.model.findByIdAndUpdate(id, item);
  }

  async delete(id: string): Promise<T> {
    return this.model.findByIdAndDelete(id);
  }

  async clearAll() {
    return this.model.remove();
  }

  async count(filter: Partial<T> = {}): Promise<number> {
    return this.model.countDocuments(filter);
  }
}