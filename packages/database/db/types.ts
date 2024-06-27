import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from 'drizzle-orm';
import * as schema from './schema';
import { db } from './db';

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  'one' | 'many',
  boolean,
  TSchema,
  TSchema[TableName]
>['with'];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

type DB = typeof db;
type DbSchemas = NonNullable<DB['_']['schema']>;

export type SchemaRelations<
  TTableName extends keyof DbSchemas,
  TExcludeRelations extends keyof NonNullable<
    DbSchemas[TTableName]['relations']
  > = never,
> = Exclude<
  keyof NonNullable<DbSchemas[TTableName]['relations']>,
  TExcludeRelations
>;

export type SchemaWithRelations<
  TTableName extends keyof DbSchemas,
  TInclude extends SchemaRelations<TTableName> = never,
> = BuildQueryResult<
  DbSchemas,
  DbSchemas[TTableName],
  { with: { [Key in TInclude]: true } }
>;
