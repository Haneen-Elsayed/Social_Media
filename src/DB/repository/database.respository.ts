import{
    PopulateOptions,
    ProjectionType,
    QueryFilter,
    QueryOptions,
  } from "mongoose";
import { CreateOptions, HydratedDocument } from "mongoose";
import { Model } from "mongoose";

 export  abstract class DatabaseRepository<TDocument> {
  constructor (protected readonly model: Model<Document>) {}

      // create document
    async create({
     data,
     options,
}:{
   data: Partial<TDocument>[];
   options?: CreateOptions;
 }): Promise<HydratedDocument<TDocument>[] | undefined>{
  return await this.model.create(data as any, options);
}

   
async findOne ({
    filter,
    select,
    options,

}:{
    filter?: QueryFilter<TDocument>;
    select?: ProjectionType<TDocument> | null;
    options?: QueryOptions<TDocument> | null;
}){
   const doc = this.model.findOne(filter).select(select || "");
     if (options?.populate) {
   doc.populate(options.populate as PopulateOptions[]);
}
     return await doc.exec();
 } 

async updateOne ({
    filter,
    update,
    options,

}:{
    filter: QueryFilter<TDocument>;
    update: UpdateQuery<TDocument>;
    options?: mongooseUpdateQueryOptions<TDocument>| null;
}){
   return await this.model.updateOne(
    filter,
     {...update,$inc:  {_v: 1}}, 
     options);    
}


}




