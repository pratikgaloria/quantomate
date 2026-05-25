
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Symbol
 * 
 */
export type Symbol = $Result.DefaultSelection<Prisma.$SymbolPayload>
/**
 * Model HistoricalPrice
 * 
 */
export type HistoricalPrice = $Result.DefaultSelection<Prisma.$HistoricalPricePayload>
/**
 * Model StrategySignal
 * 
 */
export type StrategySignal = $Result.DefaultSelection<Prisma.$StrategySignalPayload>
/**
 * Model FundamentalMetric
 * 
 */
export type FundamentalMetric = $Result.DefaultSelection<Prisma.$FundamentalMetricPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Symbols
 * const symbols = await prisma.symbol.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Symbols
   * const symbols = await prisma.symbol.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.symbol`: Exposes CRUD operations for the **Symbol** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Symbols
    * const symbols = await prisma.symbol.findMany()
    * ```
    */
  get symbol(): Prisma.SymbolDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.historicalPrice`: Exposes CRUD operations for the **HistoricalPrice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HistoricalPrices
    * const historicalPrices = await prisma.historicalPrice.findMany()
    * ```
    */
  get historicalPrice(): Prisma.HistoricalPriceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.strategySignal`: Exposes CRUD operations for the **StrategySignal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StrategySignals
    * const strategySignals = await prisma.strategySignal.findMany()
    * ```
    */
  get strategySignal(): Prisma.StrategySignalDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fundamentalMetric`: Exposes CRUD operations for the **FundamentalMetric** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FundamentalMetrics
    * const fundamentalMetrics = await prisma.fundamentalMetric.findMany()
    * ```
    */
  get fundamentalMetric(): Prisma.FundamentalMetricDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Symbol: 'Symbol',
    HistoricalPrice: 'HistoricalPrice',
    StrategySignal: 'StrategySignal',
    FundamentalMetric: 'FundamentalMetric'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "symbol" | "historicalPrice" | "strategySignal" | "fundamentalMetric"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Symbol: {
        payload: Prisma.$SymbolPayload<ExtArgs>
        fields: Prisma.SymbolFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SymbolFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SymbolFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload>
          }
          findFirst: {
            args: Prisma.SymbolFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SymbolFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload>
          }
          findMany: {
            args: Prisma.SymbolFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload>[]
          }
          create: {
            args: Prisma.SymbolCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload>
          }
          createMany: {
            args: Prisma.SymbolCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SymbolCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload>[]
          }
          delete: {
            args: Prisma.SymbolDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload>
          }
          update: {
            args: Prisma.SymbolUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload>
          }
          deleteMany: {
            args: Prisma.SymbolDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SymbolUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SymbolUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload>[]
          }
          upsert: {
            args: Prisma.SymbolUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload>
          }
          aggregate: {
            args: Prisma.SymbolAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSymbol>
          }
          groupBy: {
            args: Prisma.SymbolGroupByArgs<ExtArgs>
            result: $Utils.Optional<SymbolGroupByOutputType>[]
          }
          count: {
            args: Prisma.SymbolCountArgs<ExtArgs>
            result: $Utils.Optional<SymbolCountAggregateOutputType> | number
          }
        }
      }
      HistoricalPrice: {
        payload: Prisma.$HistoricalPricePayload<ExtArgs>
        fields: Prisma.HistoricalPriceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HistoricalPriceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricalPricePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HistoricalPriceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricalPricePayload>
          }
          findFirst: {
            args: Prisma.HistoricalPriceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricalPricePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HistoricalPriceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricalPricePayload>
          }
          findMany: {
            args: Prisma.HistoricalPriceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricalPricePayload>[]
          }
          create: {
            args: Prisma.HistoricalPriceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricalPricePayload>
          }
          createMany: {
            args: Prisma.HistoricalPriceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HistoricalPriceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricalPricePayload>[]
          }
          delete: {
            args: Prisma.HistoricalPriceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricalPricePayload>
          }
          update: {
            args: Prisma.HistoricalPriceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricalPricePayload>
          }
          deleteMany: {
            args: Prisma.HistoricalPriceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HistoricalPriceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.HistoricalPriceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricalPricePayload>[]
          }
          upsert: {
            args: Prisma.HistoricalPriceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricalPricePayload>
          }
          aggregate: {
            args: Prisma.HistoricalPriceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHistoricalPrice>
          }
          groupBy: {
            args: Prisma.HistoricalPriceGroupByArgs<ExtArgs>
            result: $Utils.Optional<HistoricalPriceGroupByOutputType>[]
          }
          count: {
            args: Prisma.HistoricalPriceCountArgs<ExtArgs>
            result: $Utils.Optional<HistoricalPriceCountAggregateOutputType> | number
          }
        }
      }
      StrategySignal: {
        payload: Prisma.$StrategySignalPayload<ExtArgs>
        fields: Prisma.StrategySignalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StrategySignalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategySignalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StrategySignalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategySignalPayload>
          }
          findFirst: {
            args: Prisma.StrategySignalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategySignalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StrategySignalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategySignalPayload>
          }
          findMany: {
            args: Prisma.StrategySignalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategySignalPayload>[]
          }
          create: {
            args: Prisma.StrategySignalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategySignalPayload>
          }
          createMany: {
            args: Prisma.StrategySignalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StrategySignalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategySignalPayload>[]
          }
          delete: {
            args: Prisma.StrategySignalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategySignalPayload>
          }
          update: {
            args: Prisma.StrategySignalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategySignalPayload>
          }
          deleteMany: {
            args: Prisma.StrategySignalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StrategySignalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StrategySignalUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategySignalPayload>[]
          }
          upsert: {
            args: Prisma.StrategySignalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StrategySignalPayload>
          }
          aggregate: {
            args: Prisma.StrategySignalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStrategySignal>
          }
          groupBy: {
            args: Prisma.StrategySignalGroupByArgs<ExtArgs>
            result: $Utils.Optional<StrategySignalGroupByOutputType>[]
          }
          count: {
            args: Prisma.StrategySignalCountArgs<ExtArgs>
            result: $Utils.Optional<StrategySignalCountAggregateOutputType> | number
          }
        }
      }
      FundamentalMetric: {
        payload: Prisma.$FundamentalMetricPayload<ExtArgs>
        fields: Prisma.FundamentalMetricFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FundamentalMetricFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FundamentalMetricPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FundamentalMetricFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FundamentalMetricPayload>
          }
          findFirst: {
            args: Prisma.FundamentalMetricFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FundamentalMetricPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FundamentalMetricFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FundamentalMetricPayload>
          }
          findMany: {
            args: Prisma.FundamentalMetricFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FundamentalMetricPayload>[]
          }
          create: {
            args: Prisma.FundamentalMetricCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FundamentalMetricPayload>
          }
          createMany: {
            args: Prisma.FundamentalMetricCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FundamentalMetricCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FundamentalMetricPayload>[]
          }
          delete: {
            args: Prisma.FundamentalMetricDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FundamentalMetricPayload>
          }
          update: {
            args: Prisma.FundamentalMetricUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FundamentalMetricPayload>
          }
          deleteMany: {
            args: Prisma.FundamentalMetricDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FundamentalMetricUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FundamentalMetricUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FundamentalMetricPayload>[]
          }
          upsert: {
            args: Prisma.FundamentalMetricUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FundamentalMetricPayload>
          }
          aggregate: {
            args: Prisma.FundamentalMetricAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFundamentalMetric>
          }
          groupBy: {
            args: Prisma.FundamentalMetricGroupByArgs<ExtArgs>
            result: $Utils.Optional<FundamentalMetricGroupByOutputType>[]
          }
          count: {
            args: Prisma.FundamentalMetricCountArgs<ExtArgs>
            result: $Utils.Optional<FundamentalMetricCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    symbol?: SymbolOmit
    historicalPrice?: HistoricalPriceOmit
    strategySignal?: StrategySignalOmit
    fundamentalMetric?: FundamentalMetricOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type SymbolCountOutputType
   */

  export type SymbolCountOutputType = {
    prices: number
    signals: number
  }

  export type SymbolCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prices?: boolean | SymbolCountOutputTypeCountPricesArgs
    signals?: boolean | SymbolCountOutputTypeCountSignalsArgs
  }

  // Custom InputTypes
  /**
   * SymbolCountOutputType without action
   */
  export type SymbolCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SymbolCountOutputType
     */
    select?: SymbolCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SymbolCountOutputType without action
   */
  export type SymbolCountOutputTypeCountPricesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HistoricalPriceWhereInput
  }

  /**
   * SymbolCountOutputType without action
   */
  export type SymbolCountOutputTypeCountSignalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StrategySignalWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Symbol
   */

  export type AggregateSymbol = {
    _count: SymbolCountAggregateOutputType | null
    _min: SymbolMinAggregateOutputType | null
    _max: SymbolMaxAggregateOutputType | null
  }

  export type SymbolMinAggregateOutputType = {
    id: string | null
    sector: string | null
    industry: string | null
    name: string | null
    updatedAt: Date | null
  }

  export type SymbolMaxAggregateOutputType = {
    id: string | null
    sector: string | null
    industry: string | null
    name: string | null
    updatedAt: Date | null
  }

  export type SymbolCountAggregateOutputType = {
    id: number
    sector: number
    industry: number
    name: number
    updatedAt: number
    _all: number
  }


  export type SymbolMinAggregateInputType = {
    id?: true
    sector?: true
    industry?: true
    name?: true
    updatedAt?: true
  }

  export type SymbolMaxAggregateInputType = {
    id?: true
    sector?: true
    industry?: true
    name?: true
    updatedAt?: true
  }

  export type SymbolCountAggregateInputType = {
    id?: true
    sector?: true
    industry?: true
    name?: true
    updatedAt?: true
    _all?: true
  }

  export type SymbolAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Symbol to aggregate.
     */
    where?: SymbolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Symbols to fetch.
     */
    orderBy?: SymbolOrderByWithRelationInput | SymbolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SymbolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Symbols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Symbols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Symbols
    **/
    _count?: true | SymbolCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SymbolMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SymbolMaxAggregateInputType
  }

  export type GetSymbolAggregateType<T extends SymbolAggregateArgs> = {
        [P in keyof T & keyof AggregateSymbol]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSymbol[P]>
      : GetScalarType<T[P], AggregateSymbol[P]>
  }




  export type SymbolGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SymbolWhereInput
    orderBy?: SymbolOrderByWithAggregationInput | SymbolOrderByWithAggregationInput[]
    by: SymbolScalarFieldEnum[] | SymbolScalarFieldEnum
    having?: SymbolScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SymbolCountAggregateInputType | true
    _min?: SymbolMinAggregateInputType
    _max?: SymbolMaxAggregateInputType
  }

  export type SymbolGroupByOutputType = {
    id: string
    sector: string | null
    industry: string | null
    name: string | null
    updatedAt: Date
    _count: SymbolCountAggregateOutputType | null
    _min: SymbolMinAggregateOutputType | null
    _max: SymbolMaxAggregateOutputType | null
  }

  type GetSymbolGroupByPayload<T extends SymbolGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SymbolGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SymbolGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SymbolGroupByOutputType[P]>
            : GetScalarType<T[P], SymbolGroupByOutputType[P]>
        }
      >
    >


  export type SymbolSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sector?: boolean
    industry?: boolean
    name?: boolean
    updatedAt?: boolean
    prices?: boolean | Symbol$pricesArgs<ExtArgs>
    signals?: boolean | Symbol$signalsArgs<ExtArgs>
    metrics?: boolean | Symbol$metricsArgs<ExtArgs>
    _count?: boolean | SymbolCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["symbol"]>

  export type SymbolSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sector?: boolean
    industry?: boolean
    name?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["symbol"]>

  export type SymbolSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sector?: boolean
    industry?: boolean
    name?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["symbol"]>

  export type SymbolSelectScalar = {
    id?: boolean
    sector?: boolean
    industry?: boolean
    name?: boolean
    updatedAt?: boolean
  }

  export type SymbolOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sector" | "industry" | "name" | "updatedAt", ExtArgs["result"]["symbol"]>
  export type SymbolInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prices?: boolean | Symbol$pricesArgs<ExtArgs>
    signals?: boolean | Symbol$signalsArgs<ExtArgs>
    metrics?: boolean | Symbol$metricsArgs<ExtArgs>
    _count?: boolean | SymbolCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SymbolIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SymbolIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SymbolPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Symbol"
    objects: {
      prices: Prisma.$HistoricalPricePayload<ExtArgs>[]
      signals: Prisma.$StrategySignalPayload<ExtArgs>[]
      metrics: Prisma.$FundamentalMetricPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sector: string | null
      industry: string | null
      name: string | null
      updatedAt: Date
    }, ExtArgs["result"]["symbol"]>
    composites: {}
  }

  type SymbolGetPayload<S extends boolean | null | undefined | SymbolDefaultArgs> = $Result.GetResult<Prisma.$SymbolPayload, S>

  type SymbolCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SymbolFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SymbolCountAggregateInputType | true
    }

  export interface SymbolDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Symbol'], meta: { name: 'Symbol' } }
    /**
     * Find zero or one Symbol that matches the filter.
     * @param {SymbolFindUniqueArgs} args - Arguments to find a Symbol
     * @example
     * // Get one Symbol
     * const symbol = await prisma.symbol.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SymbolFindUniqueArgs>(args: SelectSubset<T, SymbolFindUniqueArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Symbol that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SymbolFindUniqueOrThrowArgs} args - Arguments to find a Symbol
     * @example
     * // Get one Symbol
     * const symbol = await prisma.symbol.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SymbolFindUniqueOrThrowArgs>(args: SelectSubset<T, SymbolFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Symbol that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SymbolFindFirstArgs} args - Arguments to find a Symbol
     * @example
     * // Get one Symbol
     * const symbol = await prisma.symbol.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SymbolFindFirstArgs>(args?: SelectSubset<T, SymbolFindFirstArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Symbol that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SymbolFindFirstOrThrowArgs} args - Arguments to find a Symbol
     * @example
     * // Get one Symbol
     * const symbol = await prisma.symbol.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SymbolFindFirstOrThrowArgs>(args?: SelectSubset<T, SymbolFindFirstOrThrowArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Symbols that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SymbolFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Symbols
     * const symbols = await prisma.symbol.findMany()
     * 
     * // Get first 10 Symbols
     * const symbols = await prisma.symbol.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const symbolWithIdOnly = await prisma.symbol.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SymbolFindManyArgs>(args?: SelectSubset<T, SymbolFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Symbol.
     * @param {SymbolCreateArgs} args - Arguments to create a Symbol.
     * @example
     * // Create one Symbol
     * const Symbol = await prisma.symbol.create({
     *   data: {
     *     // ... data to create a Symbol
     *   }
     * })
     * 
     */
    create<T extends SymbolCreateArgs>(args: SelectSubset<T, SymbolCreateArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Symbols.
     * @param {SymbolCreateManyArgs} args - Arguments to create many Symbols.
     * @example
     * // Create many Symbols
     * const symbol = await prisma.symbol.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SymbolCreateManyArgs>(args?: SelectSubset<T, SymbolCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Symbols and returns the data saved in the database.
     * @param {SymbolCreateManyAndReturnArgs} args - Arguments to create many Symbols.
     * @example
     * // Create many Symbols
     * const symbol = await prisma.symbol.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Symbols and only return the `id`
     * const symbolWithIdOnly = await prisma.symbol.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SymbolCreateManyAndReturnArgs>(args?: SelectSubset<T, SymbolCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Symbol.
     * @param {SymbolDeleteArgs} args - Arguments to delete one Symbol.
     * @example
     * // Delete one Symbol
     * const Symbol = await prisma.symbol.delete({
     *   where: {
     *     // ... filter to delete one Symbol
     *   }
     * })
     * 
     */
    delete<T extends SymbolDeleteArgs>(args: SelectSubset<T, SymbolDeleteArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Symbol.
     * @param {SymbolUpdateArgs} args - Arguments to update one Symbol.
     * @example
     * // Update one Symbol
     * const symbol = await prisma.symbol.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SymbolUpdateArgs>(args: SelectSubset<T, SymbolUpdateArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Symbols.
     * @param {SymbolDeleteManyArgs} args - Arguments to filter Symbols to delete.
     * @example
     * // Delete a few Symbols
     * const { count } = await prisma.symbol.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SymbolDeleteManyArgs>(args?: SelectSubset<T, SymbolDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Symbols.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SymbolUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Symbols
     * const symbol = await prisma.symbol.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SymbolUpdateManyArgs>(args: SelectSubset<T, SymbolUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Symbols and returns the data updated in the database.
     * @param {SymbolUpdateManyAndReturnArgs} args - Arguments to update many Symbols.
     * @example
     * // Update many Symbols
     * const symbol = await prisma.symbol.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Symbols and only return the `id`
     * const symbolWithIdOnly = await prisma.symbol.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SymbolUpdateManyAndReturnArgs>(args: SelectSubset<T, SymbolUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Symbol.
     * @param {SymbolUpsertArgs} args - Arguments to update or create a Symbol.
     * @example
     * // Update or create a Symbol
     * const symbol = await prisma.symbol.upsert({
     *   create: {
     *     // ... data to create a Symbol
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Symbol we want to update
     *   }
     * })
     */
    upsert<T extends SymbolUpsertArgs>(args: SelectSubset<T, SymbolUpsertArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Symbols.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SymbolCountArgs} args - Arguments to filter Symbols to count.
     * @example
     * // Count the number of Symbols
     * const count = await prisma.symbol.count({
     *   where: {
     *     // ... the filter for the Symbols we want to count
     *   }
     * })
    **/
    count<T extends SymbolCountArgs>(
      args?: Subset<T, SymbolCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SymbolCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Symbol.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SymbolAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SymbolAggregateArgs>(args: Subset<T, SymbolAggregateArgs>): Prisma.PrismaPromise<GetSymbolAggregateType<T>>

    /**
     * Group by Symbol.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SymbolGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SymbolGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SymbolGroupByArgs['orderBy'] }
        : { orderBy?: SymbolGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SymbolGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSymbolGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Symbol model
   */
  readonly fields: SymbolFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Symbol.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SymbolClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    prices<T extends Symbol$pricesArgs<ExtArgs> = {}>(args?: Subset<T, Symbol$pricesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistoricalPricePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    signals<T extends Symbol$signalsArgs<ExtArgs> = {}>(args?: Subset<T, Symbol$signalsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StrategySignalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    metrics<T extends Symbol$metricsArgs<ExtArgs> = {}>(args?: Subset<T, Symbol$metricsArgs<ExtArgs>>): Prisma__FundamentalMetricClient<$Result.GetResult<Prisma.$FundamentalMetricPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Symbol model
   */
  interface SymbolFieldRefs {
    readonly id: FieldRef<"Symbol", 'String'>
    readonly sector: FieldRef<"Symbol", 'String'>
    readonly industry: FieldRef<"Symbol", 'String'>
    readonly name: FieldRef<"Symbol", 'String'>
    readonly updatedAt: FieldRef<"Symbol", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Symbol findUnique
   */
  export type SymbolFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Symbol
     */
    omit?: SymbolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * Filter, which Symbol to fetch.
     */
    where: SymbolWhereUniqueInput
  }

  /**
   * Symbol findUniqueOrThrow
   */
  export type SymbolFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Symbol
     */
    omit?: SymbolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * Filter, which Symbol to fetch.
     */
    where: SymbolWhereUniqueInput
  }

  /**
   * Symbol findFirst
   */
  export type SymbolFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Symbol
     */
    omit?: SymbolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * Filter, which Symbol to fetch.
     */
    where?: SymbolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Symbols to fetch.
     */
    orderBy?: SymbolOrderByWithRelationInput | SymbolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Symbols.
     */
    cursor?: SymbolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Symbols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Symbols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Symbols.
     */
    distinct?: SymbolScalarFieldEnum | SymbolScalarFieldEnum[]
  }

  /**
   * Symbol findFirstOrThrow
   */
  export type SymbolFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Symbol
     */
    omit?: SymbolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * Filter, which Symbol to fetch.
     */
    where?: SymbolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Symbols to fetch.
     */
    orderBy?: SymbolOrderByWithRelationInput | SymbolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Symbols.
     */
    cursor?: SymbolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Symbols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Symbols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Symbols.
     */
    distinct?: SymbolScalarFieldEnum | SymbolScalarFieldEnum[]
  }

  /**
   * Symbol findMany
   */
  export type SymbolFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Symbol
     */
    omit?: SymbolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * Filter, which Symbols to fetch.
     */
    where?: SymbolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Symbols to fetch.
     */
    orderBy?: SymbolOrderByWithRelationInput | SymbolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Symbols.
     */
    cursor?: SymbolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Symbols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Symbols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Symbols.
     */
    distinct?: SymbolScalarFieldEnum | SymbolScalarFieldEnum[]
  }

  /**
   * Symbol create
   */
  export type SymbolCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Symbol
     */
    omit?: SymbolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * The data needed to create a Symbol.
     */
    data: XOR<SymbolCreateInput, SymbolUncheckedCreateInput>
  }

  /**
   * Symbol createMany
   */
  export type SymbolCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Symbols.
     */
    data: SymbolCreateManyInput | SymbolCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Symbol createManyAndReturn
   */
  export type SymbolCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Symbol
     */
    omit?: SymbolOmit<ExtArgs> | null
    /**
     * The data used to create many Symbols.
     */
    data: SymbolCreateManyInput | SymbolCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Symbol update
   */
  export type SymbolUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Symbol
     */
    omit?: SymbolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * The data needed to update a Symbol.
     */
    data: XOR<SymbolUpdateInput, SymbolUncheckedUpdateInput>
    /**
     * Choose, which Symbol to update.
     */
    where: SymbolWhereUniqueInput
  }

  /**
   * Symbol updateMany
   */
  export type SymbolUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Symbols.
     */
    data: XOR<SymbolUpdateManyMutationInput, SymbolUncheckedUpdateManyInput>
    /**
     * Filter which Symbols to update
     */
    where?: SymbolWhereInput
    /**
     * Limit how many Symbols to update.
     */
    limit?: number
  }

  /**
   * Symbol updateManyAndReturn
   */
  export type SymbolUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Symbol
     */
    omit?: SymbolOmit<ExtArgs> | null
    /**
     * The data used to update Symbols.
     */
    data: XOR<SymbolUpdateManyMutationInput, SymbolUncheckedUpdateManyInput>
    /**
     * Filter which Symbols to update
     */
    where?: SymbolWhereInput
    /**
     * Limit how many Symbols to update.
     */
    limit?: number
  }

  /**
   * Symbol upsert
   */
  export type SymbolUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Symbol
     */
    omit?: SymbolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * The filter to search for the Symbol to update in case it exists.
     */
    where: SymbolWhereUniqueInput
    /**
     * In case the Symbol found by the `where` argument doesn't exist, create a new Symbol with this data.
     */
    create: XOR<SymbolCreateInput, SymbolUncheckedCreateInput>
    /**
     * In case the Symbol was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SymbolUpdateInput, SymbolUncheckedUpdateInput>
  }

  /**
   * Symbol delete
   */
  export type SymbolDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Symbol
     */
    omit?: SymbolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * Filter which Symbol to delete.
     */
    where: SymbolWhereUniqueInput
  }

  /**
   * Symbol deleteMany
   */
  export type SymbolDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Symbols to delete
     */
    where?: SymbolWhereInput
    /**
     * Limit how many Symbols to delete.
     */
    limit?: number
  }

  /**
   * Symbol.prices
   */
  export type Symbol$pricesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricalPrice
     */
    select?: HistoricalPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoricalPrice
     */
    omit?: HistoricalPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricalPriceInclude<ExtArgs> | null
    where?: HistoricalPriceWhereInput
    orderBy?: HistoricalPriceOrderByWithRelationInput | HistoricalPriceOrderByWithRelationInput[]
    cursor?: HistoricalPriceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HistoricalPriceScalarFieldEnum | HistoricalPriceScalarFieldEnum[]
  }

  /**
   * Symbol.signals
   */
  export type Symbol$signalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategySignal
     */
    select?: StrategySignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategySignal
     */
    omit?: StrategySignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategySignalInclude<ExtArgs> | null
    where?: StrategySignalWhereInput
    orderBy?: StrategySignalOrderByWithRelationInput | StrategySignalOrderByWithRelationInput[]
    cursor?: StrategySignalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StrategySignalScalarFieldEnum | StrategySignalScalarFieldEnum[]
  }

  /**
   * Symbol.metrics
   */
  export type Symbol$metricsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FundamentalMetric
     */
    select?: FundamentalMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FundamentalMetric
     */
    omit?: FundamentalMetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FundamentalMetricInclude<ExtArgs> | null
    where?: FundamentalMetricWhereInput
  }

  /**
   * Symbol without action
   */
  export type SymbolDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Symbol
     */
    omit?: SymbolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
  }


  /**
   * Model HistoricalPrice
   */

  export type AggregateHistoricalPrice = {
    _count: HistoricalPriceCountAggregateOutputType | null
    _avg: HistoricalPriceAvgAggregateOutputType | null
    _sum: HistoricalPriceSumAggregateOutputType | null
    _min: HistoricalPriceMinAggregateOutputType | null
    _max: HistoricalPriceMaxAggregateOutputType | null
  }

  export type HistoricalPriceAvgAggregateOutputType = {
    open: number | null
    high: number | null
    low: number | null
    close: number | null
    volume: number | null
  }

  export type HistoricalPriceSumAggregateOutputType = {
    open: number | null
    high: number | null
    low: number | null
    close: number | null
    volume: number | null
  }

  export type HistoricalPriceMinAggregateOutputType = {
    symbolId: string | null
    date: Date | null
    open: number | null
    high: number | null
    low: number | null
    close: number | null
    volume: number | null
  }

  export type HistoricalPriceMaxAggregateOutputType = {
    symbolId: string | null
    date: Date | null
    open: number | null
    high: number | null
    low: number | null
    close: number | null
    volume: number | null
  }

  export type HistoricalPriceCountAggregateOutputType = {
    symbolId: number
    date: number
    open: number
    high: number
    low: number
    close: number
    volume: number
    _all: number
  }


  export type HistoricalPriceAvgAggregateInputType = {
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
  }

  export type HistoricalPriceSumAggregateInputType = {
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
  }

  export type HistoricalPriceMinAggregateInputType = {
    symbolId?: true
    date?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
  }

  export type HistoricalPriceMaxAggregateInputType = {
    symbolId?: true
    date?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
  }

  export type HistoricalPriceCountAggregateInputType = {
    symbolId?: true
    date?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
    _all?: true
  }

  export type HistoricalPriceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HistoricalPrice to aggregate.
     */
    where?: HistoricalPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistoricalPrices to fetch.
     */
    orderBy?: HistoricalPriceOrderByWithRelationInput | HistoricalPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HistoricalPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistoricalPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistoricalPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HistoricalPrices
    **/
    _count?: true | HistoricalPriceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HistoricalPriceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HistoricalPriceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HistoricalPriceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HistoricalPriceMaxAggregateInputType
  }

  export type GetHistoricalPriceAggregateType<T extends HistoricalPriceAggregateArgs> = {
        [P in keyof T & keyof AggregateHistoricalPrice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHistoricalPrice[P]>
      : GetScalarType<T[P], AggregateHistoricalPrice[P]>
  }




  export type HistoricalPriceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HistoricalPriceWhereInput
    orderBy?: HistoricalPriceOrderByWithAggregationInput | HistoricalPriceOrderByWithAggregationInput[]
    by: HistoricalPriceScalarFieldEnum[] | HistoricalPriceScalarFieldEnum
    having?: HistoricalPriceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HistoricalPriceCountAggregateInputType | true
    _avg?: HistoricalPriceAvgAggregateInputType
    _sum?: HistoricalPriceSumAggregateInputType
    _min?: HistoricalPriceMinAggregateInputType
    _max?: HistoricalPriceMaxAggregateInputType
  }

  export type HistoricalPriceGroupByOutputType = {
    symbolId: string
    date: Date
    open: number
    high: number
    low: number
    close: number
    volume: number
    _count: HistoricalPriceCountAggregateOutputType | null
    _avg: HistoricalPriceAvgAggregateOutputType | null
    _sum: HistoricalPriceSumAggregateOutputType | null
    _min: HistoricalPriceMinAggregateOutputType | null
    _max: HistoricalPriceMaxAggregateOutputType | null
  }

  type GetHistoricalPriceGroupByPayload<T extends HistoricalPriceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HistoricalPriceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HistoricalPriceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HistoricalPriceGroupByOutputType[P]>
            : GetScalarType<T[P], HistoricalPriceGroupByOutputType[P]>
        }
      >
    >


  export type HistoricalPriceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    symbolId?: boolean
    date?: boolean
    open?: boolean
    high?: boolean
    low?: boolean
    close?: boolean
    volume?: boolean
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["historicalPrice"]>

  export type HistoricalPriceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    symbolId?: boolean
    date?: boolean
    open?: boolean
    high?: boolean
    low?: boolean
    close?: boolean
    volume?: boolean
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["historicalPrice"]>

  export type HistoricalPriceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    symbolId?: boolean
    date?: boolean
    open?: boolean
    high?: boolean
    low?: boolean
    close?: boolean
    volume?: boolean
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["historicalPrice"]>

  export type HistoricalPriceSelectScalar = {
    symbolId?: boolean
    date?: boolean
    open?: boolean
    high?: boolean
    low?: boolean
    close?: boolean
    volume?: boolean
  }

  export type HistoricalPriceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"symbolId" | "date" | "open" | "high" | "low" | "close" | "volume", ExtArgs["result"]["historicalPrice"]>
  export type HistoricalPriceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }
  export type HistoricalPriceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }
  export type HistoricalPriceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }

  export type $HistoricalPricePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HistoricalPrice"
    objects: {
      symbol: Prisma.$SymbolPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      symbolId: string
      date: Date
      open: number
      high: number
      low: number
      close: number
      volume: number
    }, ExtArgs["result"]["historicalPrice"]>
    composites: {}
  }

  type HistoricalPriceGetPayload<S extends boolean | null | undefined | HistoricalPriceDefaultArgs> = $Result.GetResult<Prisma.$HistoricalPricePayload, S>

  type HistoricalPriceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HistoricalPriceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HistoricalPriceCountAggregateInputType | true
    }

  export interface HistoricalPriceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HistoricalPrice'], meta: { name: 'HistoricalPrice' } }
    /**
     * Find zero or one HistoricalPrice that matches the filter.
     * @param {HistoricalPriceFindUniqueArgs} args - Arguments to find a HistoricalPrice
     * @example
     * // Get one HistoricalPrice
     * const historicalPrice = await prisma.historicalPrice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HistoricalPriceFindUniqueArgs>(args: SelectSubset<T, HistoricalPriceFindUniqueArgs<ExtArgs>>): Prisma__HistoricalPriceClient<$Result.GetResult<Prisma.$HistoricalPricePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one HistoricalPrice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HistoricalPriceFindUniqueOrThrowArgs} args - Arguments to find a HistoricalPrice
     * @example
     * // Get one HistoricalPrice
     * const historicalPrice = await prisma.historicalPrice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HistoricalPriceFindUniqueOrThrowArgs>(args: SelectSubset<T, HistoricalPriceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HistoricalPriceClient<$Result.GetResult<Prisma.$HistoricalPricePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HistoricalPrice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoricalPriceFindFirstArgs} args - Arguments to find a HistoricalPrice
     * @example
     * // Get one HistoricalPrice
     * const historicalPrice = await prisma.historicalPrice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HistoricalPriceFindFirstArgs>(args?: SelectSubset<T, HistoricalPriceFindFirstArgs<ExtArgs>>): Prisma__HistoricalPriceClient<$Result.GetResult<Prisma.$HistoricalPricePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HistoricalPrice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoricalPriceFindFirstOrThrowArgs} args - Arguments to find a HistoricalPrice
     * @example
     * // Get one HistoricalPrice
     * const historicalPrice = await prisma.historicalPrice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HistoricalPriceFindFirstOrThrowArgs>(args?: SelectSubset<T, HistoricalPriceFindFirstOrThrowArgs<ExtArgs>>): Prisma__HistoricalPriceClient<$Result.GetResult<Prisma.$HistoricalPricePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more HistoricalPrices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoricalPriceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HistoricalPrices
     * const historicalPrices = await prisma.historicalPrice.findMany()
     * 
     * // Get first 10 HistoricalPrices
     * const historicalPrices = await prisma.historicalPrice.findMany({ take: 10 })
     * 
     * // Only select the `symbolId`
     * const historicalPriceWithSymbolIdOnly = await prisma.historicalPrice.findMany({ select: { symbolId: true } })
     * 
     */
    findMany<T extends HistoricalPriceFindManyArgs>(args?: SelectSubset<T, HistoricalPriceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistoricalPricePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a HistoricalPrice.
     * @param {HistoricalPriceCreateArgs} args - Arguments to create a HistoricalPrice.
     * @example
     * // Create one HistoricalPrice
     * const HistoricalPrice = await prisma.historicalPrice.create({
     *   data: {
     *     // ... data to create a HistoricalPrice
     *   }
     * })
     * 
     */
    create<T extends HistoricalPriceCreateArgs>(args: SelectSubset<T, HistoricalPriceCreateArgs<ExtArgs>>): Prisma__HistoricalPriceClient<$Result.GetResult<Prisma.$HistoricalPricePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many HistoricalPrices.
     * @param {HistoricalPriceCreateManyArgs} args - Arguments to create many HistoricalPrices.
     * @example
     * // Create many HistoricalPrices
     * const historicalPrice = await prisma.historicalPrice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HistoricalPriceCreateManyArgs>(args?: SelectSubset<T, HistoricalPriceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HistoricalPrices and returns the data saved in the database.
     * @param {HistoricalPriceCreateManyAndReturnArgs} args - Arguments to create many HistoricalPrices.
     * @example
     * // Create many HistoricalPrices
     * const historicalPrice = await prisma.historicalPrice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HistoricalPrices and only return the `symbolId`
     * const historicalPriceWithSymbolIdOnly = await prisma.historicalPrice.createManyAndReturn({
     *   select: { symbolId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HistoricalPriceCreateManyAndReturnArgs>(args?: SelectSubset<T, HistoricalPriceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistoricalPricePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a HistoricalPrice.
     * @param {HistoricalPriceDeleteArgs} args - Arguments to delete one HistoricalPrice.
     * @example
     * // Delete one HistoricalPrice
     * const HistoricalPrice = await prisma.historicalPrice.delete({
     *   where: {
     *     // ... filter to delete one HistoricalPrice
     *   }
     * })
     * 
     */
    delete<T extends HistoricalPriceDeleteArgs>(args: SelectSubset<T, HistoricalPriceDeleteArgs<ExtArgs>>): Prisma__HistoricalPriceClient<$Result.GetResult<Prisma.$HistoricalPricePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one HistoricalPrice.
     * @param {HistoricalPriceUpdateArgs} args - Arguments to update one HistoricalPrice.
     * @example
     * // Update one HistoricalPrice
     * const historicalPrice = await prisma.historicalPrice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HistoricalPriceUpdateArgs>(args: SelectSubset<T, HistoricalPriceUpdateArgs<ExtArgs>>): Prisma__HistoricalPriceClient<$Result.GetResult<Prisma.$HistoricalPricePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more HistoricalPrices.
     * @param {HistoricalPriceDeleteManyArgs} args - Arguments to filter HistoricalPrices to delete.
     * @example
     * // Delete a few HistoricalPrices
     * const { count } = await prisma.historicalPrice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HistoricalPriceDeleteManyArgs>(args?: SelectSubset<T, HistoricalPriceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HistoricalPrices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoricalPriceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HistoricalPrices
     * const historicalPrice = await prisma.historicalPrice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HistoricalPriceUpdateManyArgs>(args: SelectSubset<T, HistoricalPriceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HistoricalPrices and returns the data updated in the database.
     * @param {HistoricalPriceUpdateManyAndReturnArgs} args - Arguments to update many HistoricalPrices.
     * @example
     * // Update many HistoricalPrices
     * const historicalPrice = await prisma.historicalPrice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more HistoricalPrices and only return the `symbolId`
     * const historicalPriceWithSymbolIdOnly = await prisma.historicalPrice.updateManyAndReturn({
     *   select: { symbolId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends HistoricalPriceUpdateManyAndReturnArgs>(args: SelectSubset<T, HistoricalPriceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistoricalPricePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one HistoricalPrice.
     * @param {HistoricalPriceUpsertArgs} args - Arguments to update or create a HistoricalPrice.
     * @example
     * // Update or create a HistoricalPrice
     * const historicalPrice = await prisma.historicalPrice.upsert({
     *   create: {
     *     // ... data to create a HistoricalPrice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HistoricalPrice we want to update
     *   }
     * })
     */
    upsert<T extends HistoricalPriceUpsertArgs>(args: SelectSubset<T, HistoricalPriceUpsertArgs<ExtArgs>>): Prisma__HistoricalPriceClient<$Result.GetResult<Prisma.$HistoricalPricePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of HistoricalPrices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoricalPriceCountArgs} args - Arguments to filter HistoricalPrices to count.
     * @example
     * // Count the number of HistoricalPrices
     * const count = await prisma.historicalPrice.count({
     *   where: {
     *     // ... the filter for the HistoricalPrices we want to count
     *   }
     * })
    **/
    count<T extends HistoricalPriceCountArgs>(
      args?: Subset<T, HistoricalPriceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HistoricalPriceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HistoricalPrice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoricalPriceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HistoricalPriceAggregateArgs>(args: Subset<T, HistoricalPriceAggregateArgs>): Prisma.PrismaPromise<GetHistoricalPriceAggregateType<T>>

    /**
     * Group by HistoricalPrice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoricalPriceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HistoricalPriceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HistoricalPriceGroupByArgs['orderBy'] }
        : { orderBy?: HistoricalPriceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HistoricalPriceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHistoricalPriceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HistoricalPrice model
   */
  readonly fields: HistoricalPriceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HistoricalPrice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HistoricalPriceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    symbol<T extends SymbolDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SymbolDefaultArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the HistoricalPrice model
   */
  interface HistoricalPriceFieldRefs {
    readonly symbolId: FieldRef<"HistoricalPrice", 'String'>
    readonly date: FieldRef<"HistoricalPrice", 'DateTime'>
    readonly open: FieldRef<"HistoricalPrice", 'Float'>
    readonly high: FieldRef<"HistoricalPrice", 'Float'>
    readonly low: FieldRef<"HistoricalPrice", 'Float'>
    readonly close: FieldRef<"HistoricalPrice", 'Float'>
    readonly volume: FieldRef<"HistoricalPrice", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * HistoricalPrice findUnique
   */
  export type HistoricalPriceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricalPrice
     */
    select?: HistoricalPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoricalPrice
     */
    omit?: HistoricalPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricalPriceInclude<ExtArgs> | null
    /**
     * Filter, which HistoricalPrice to fetch.
     */
    where: HistoricalPriceWhereUniqueInput
  }

  /**
   * HistoricalPrice findUniqueOrThrow
   */
  export type HistoricalPriceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricalPrice
     */
    select?: HistoricalPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoricalPrice
     */
    omit?: HistoricalPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricalPriceInclude<ExtArgs> | null
    /**
     * Filter, which HistoricalPrice to fetch.
     */
    where: HistoricalPriceWhereUniqueInput
  }

  /**
   * HistoricalPrice findFirst
   */
  export type HistoricalPriceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricalPrice
     */
    select?: HistoricalPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoricalPrice
     */
    omit?: HistoricalPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricalPriceInclude<ExtArgs> | null
    /**
     * Filter, which HistoricalPrice to fetch.
     */
    where?: HistoricalPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistoricalPrices to fetch.
     */
    orderBy?: HistoricalPriceOrderByWithRelationInput | HistoricalPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HistoricalPrices.
     */
    cursor?: HistoricalPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistoricalPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistoricalPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HistoricalPrices.
     */
    distinct?: HistoricalPriceScalarFieldEnum | HistoricalPriceScalarFieldEnum[]
  }

  /**
   * HistoricalPrice findFirstOrThrow
   */
  export type HistoricalPriceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricalPrice
     */
    select?: HistoricalPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoricalPrice
     */
    omit?: HistoricalPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricalPriceInclude<ExtArgs> | null
    /**
     * Filter, which HistoricalPrice to fetch.
     */
    where?: HistoricalPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistoricalPrices to fetch.
     */
    orderBy?: HistoricalPriceOrderByWithRelationInput | HistoricalPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HistoricalPrices.
     */
    cursor?: HistoricalPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistoricalPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistoricalPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HistoricalPrices.
     */
    distinct?: HistoricalPriceScalarFieldEnum | HistoricalPriceScalarFieldEnum[]
  }

  /**
   * HistoricalPrice findMany
   */
  export type HistoricalPriceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricalPrice
     */
    select?: HistoricalPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoricalPrice
     */
    omit?: HistoricalPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricalPriceInclude<ExtArgs> | null
    /**
     * Filter, which HistoricalPrices to fetch.
     */
    where?: HistoricalPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistoricalPrices to fetch.
     */
    orderBy?: HistoricalPriceOrderByWithRelationInput | HistoricalPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HistoricalPrices.
     */
    cursor?: HistoricalPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistoricalPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistoricalPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HistoricalPrices.
     */
    distinct?: HistoricalPriceScalarFieldEnum | HistoricalPriceScalarFieldEnum[]
  }

  /**
   * HistoricalPrice create
   */
  export type HistoricalPriceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricalPrice
     */
    select?: HistoricalPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoricalPrice
     */
    omit?: HistoricalPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricalPriceInclude<ExtArgs> | null
    /**
     * The data needed to create a HistoricalPrice.
     */
    data: XOR<HistoricalPriceCreateInput, HistoricalPriceUncheckedCreateInput>
  }

  /**
   * HistoricalPrice createMany
   */
  export type HistoricalPriceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HistoricalPrices.
     */
    data: HistoricalPriceCreateManyInput | HistoricalPriceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HistoricalPrice createManyAndReturn
   */
  export type HistoricalPriceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricalPrice
     */
    select?: HistoricalPriceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HistoricalPrice
     */
    omit?: HistoricalPriceOmit<ExtArgs> | null
    /**
     * The data used to create many HistoricalPrices.
     */
    data: HistoricalPriceCreateManyInput | HistoricalPriceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricalPriceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * HistoricalPrice update
   */
  export type HistoricalPriceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricalPrice
     */
    select?: HistoricalPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoricalPrice
     */
    omit?: HistoricalPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricalPriceInclude<ExtArgs> | null
    /**
     * The data needed to update a HistoricalPrice.
     */
    data: XOR<HistoricalPriceUpdateInput, HistoricalPriceUncheckedUpdateInput>
    /**
     * Choose, which HistoricalPrice to update.
     */
    where: HistoricalPriceWhereUniqueInput
  }

  /**
   * HistoricalPrice updateMany
   */
  export type HistoricalPriceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HistoricalPrices.
     */
    data: XOR<HistoricalPriceUpdateManyMutationInput, HistoricalPriceUncheckedUpdateManyInput>
    /**
     * Filter which HistoricalPrices to update
     */
    where?: HistoricalPriceWhereInput
    /**
     * Limit how many HistoricalPrices to update.
     */
    limit?: number
  }

  /**
   * HistoricalPrice updateManyAndReturn
   */
  export type HistoricalPriceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricalPrice
     */
    select?: HistoricalPriceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HistoricalPrice
     */
    omit?: HistoricalPriceOmit<ExtArgs> | null
    /**
     * The data used to update HistoricalPrices.
     */
    data: XOR<HistoricalPriceUpdateManyMutationInput, HistoricalPriceUncheckedUpdateManyInput>
    /**
     * Filter which HistoricalPrices to update
     */
    where?: HistoricalPriceWhereInput
    /**
     * Limit how many HistoricalPrices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricalPriceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * HistoricalPrice upsert
   */
  export type HistoricalPriceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricalPrice
     */
    select?: HistoricalPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoricalPrice
     */
    omit?: HistoricalPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricalPriceInclude<ExtArgs> | null
    /**
     * The filter to search for the HistoricalPrice to update in case it exists.
     */
    where: HistoricalPriceWhereUniqueInput
    /**
     * In case the HistoricalPrice found by the `where` argument doesn't exist, create a new HistoricalPrice with this data.
     */
    create: XOR<HistoricalPriceCreateInput, HistoricalPriceUncheckedCreateInput>
    /**
     * In case the HistoricalPrice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HistoricalPriceUpdateInput, HistoricalPriceUncheckedUpdateInput>
  }

  /**
   * HistoricalPrice delete
   */
  export type HistoricalPriceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricalPrice
     */
    select?: HistoricalPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoricalPrice
     */
    omit?: HistoricalPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricalPriceInclude<ExtArgs> | null
    /**
     * Filter which HistoricalPrice to delete.
     */
    where: HistoricalPriceWhereUniqueInput
  }

  /**
   * HistoricalPrice deleteMany
   */
  export type HistoricalPriceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HistoricalPrices to delete
     */
    where?: HistoricalPriceWhereInput
    /**
     * Limit how many HistoricalPrices to delete.
     */
    limit?: number
  }

  /**
   * HistoricalPrice without action
   */
  export type HistoricalPriceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricalPrice
     */
    select?: HistoricalPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoricalPrice
     */
    omit?: HistoricalPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricalPriceInclude<ExtArgs> | null
  }


  /**
   * Model StrategySignal
   */

  export type AggregateStrategySignal = {
    _count: StrategySignalCountAggregateOutputType | null
    _avg: StrategySignalAvgAggregateOutputType | null
    _sum: StrategySignalSumAggregateOutputType | null
    _min: StrategySignalMinAggregateOutputType | null
    _max: StrategySignalMaxAggregateOutputType | null
  }

  export type StrategySignalAvgAggregateOutputType = {
    price: number | null
  }

  export type StrategySignalSumAggregateOutputType = {
    price: number | null
  }

  export type StrategySignalMinAggregateOutputType = {
    id: string | null
    symbolId: string | null
    strategyId: string | null
    signalValue: string | null
    price: number | null
    triggeredAt: Date | null
    updatedAt: Date | null
  }

  export type StrategySignalMaxAggregateOutputType = {
    id: string | null
    symbolId: string | null
    strategyId: string | null
    signalValue: string | null
    price: number | null
    triggeredAt: Date | null
    updatedAt: Date | null
  }

  export type StrategySignalCountAggregateOutputType = {
    id: number
    symbolId: number
    strategyId: number
    signalValue: number
    price: number
    triggeredAt: number
    updatedAt: number
    _all: number
  }


  export type StrategySignalAvgAggregateInputType = {
    price?: true
  }

  export type StrategySignalSumAggregateInputType = {
    price?: true
  }

  export type StrategySignalMinAggregateInputType = {
    id?: true
    symbolId?: true
    strategyId?: true
    signalValue?: true
    price?: true
    triggeredAt?: true
    updatedAt?: true
  }

  export type StrategySignalMaxAggregateInputType = {
    id?: true
    symbolId?: true
    strategyId?: true
    signalValue?: true
    price?: true
    triggeredAt?: true
    updatedAt?: true
  }

  export type StrategySignalCountAggregateInputType = {
    id?: true
    symbolId?: true
    strategyId?: true
    signalValue?: true
    price?: true
    triggeredAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StrategySignalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StrategySignal to aggregate.
     */
    where?: StrategySignalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StrategySignals to fetch.
     */
    orderBy?: StrategySignalOrderByWithRelationInput | StrategySignalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StrategySignalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StrategySignals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StrategySignals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StrategySignals
    **/
    _count?: true | StrategySignalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StrategySignalAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StrategySignalSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StrategySignalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StrategySignalMaxAggregateInputType
  }

  export type GetStrategySignalAggregateType<T extends StrategySignalAggregateArgs> = {
        [P in keyof T & keyof AggregateStrategySignal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStrategySignal[P]>
      : GetScalarType<T[P], AggregateStrategySignal[P]>
  }




  export type StrategySignalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StrategySignalWhereInput
    orderBy?: StrategySignalOrderByWithAggregationInput | StrategySignalOrderByWithAggregationInput[]
    by: StrategySignalScalarFieldEnum[] | StrategySignalScalarFieldEnum
    having?: StrategySignalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StrategySignalCountAggregateInputType | true
    _avg?: StrategySignalAvgAggregateInputType
    _sum?: StrategySignalSumAggregateInputType
    _min?: StrategySignalMinAggregateInputType
    _max?: StrategySignalMaxAggregateInputType
  }

  export type StrategySignalGroupByOutputType = {
    id: string
    symbolId: string
    strategyId: string
    signalValue: string
    price: number
    triggeredAt: Date
    updatedAt: Date
    _count: StrategySignalCountAggregateOutputType | null
    _avg: StrategySignalAvgAggregateOutputType | null
    _sum: StrategySignalSumAggregateOutputType | null
    _min: StrategySignalMinAggregateOutputType | null
    _max: StrategySignalMaxAggregateOutputType | null
  }

  type GetStrategySignalGroupByPayload<T extends StrategySignalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StrategySignalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StrategySignalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StrategySignalGroupByOutputType[P]>
            : GetScalarType<T[P], StrategySignalGroupByOutputType[P]>
        }
      >
    >


  export type StrategySignalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    symbolId?: boolean
    strategyId?: boolean
    signalValue?: boolean
    price?: boolean
    triggeredAt?: boolean
    updatedAt?: boolean
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["strategySignal"]>

  export type StrategySignalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    symbolId?: boolean
    strategyId?: boolean
    signalValue?: boolean
    price?: boolean
    triggeredAt?: boolean
    updatedAt?: boolean
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["strategySignal"]>

  export type StrategySignalSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    symbolId?: boolean
    strategyId?: boolean
    signalValue?: boolean
    price?: boolean
    triggeredAt?: boolean
    updatedAt?: boolean
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["strategySignal"]>

  export type StrategySignalSelectScalar = {
    id?: boolean
    symbolId?: boolean
    strategyId?: boolean
    signalValue?: boolean
    price?: boolean
    triggeredAt?: boolean
    updatedAt?: boolean
  }

  export type StrategySignalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "symbolId" | "strategyId" | "signalValue" | "price" | "triggeredAt" | "updatedAt", ExtArgs["result"]["strategySignal"]>
  export type StrategySignalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }
  export type StrategySignalIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }
  export type StrategySignalIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }

  export type $StrategySignalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StrategySignal"
    objects: {
      symbol: Prisma.$SymbolPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      symbolId: string
      strategyId: string
      signalValue: string
      price: number
      triggeredAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["strategySignal"]>
    composites: {}
  }

  type StrategySignalGetPayload<S extends boolean | null | undefined | StrategySignalDefaultArgs> = $Result.GetResult<Prisma.$StrategySignalPayload, S>

  type StrategySignalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StrategySignalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StrategySignalCountAggregateInputType | true
    }

  export interface StrategySignalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StrategySignal'], meta: { name: 'StrategySignal' } }
    /**
     * Find zero or one StrategySignal that matches the filter.
     * @param {StrategySignalFindUniqueArgs} args - Arguments to find a StrategySignal
     * @example
     * // Get one StrategySignal
     * const strategySignal = await prisma.strategySignal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StrategySignalFindUniqueArgs>(args: SelectSubset<T, StrategySignalFindUniqueArgs<ExtArgs>>): Prisma__StrategySignalClient<$Result.GetResult<Prisma.$StrategySignalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StrategySignal that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StrategySignalFindUniqueOrThrowArgs} args - Arguments to find a StrategySignal
     * @example
     * // Get one StrategySignal
     * const strategySignal = await prisma.strategySignal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StrategySignalFindUniqueOrThrowArgs>(args: SelectSubset<T, StrategySignalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StrategySignalClient<$Result.GetResult<Prisma.$StrategySignalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StrategySignal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategySignalFindFirstArgs} args - Arguments to find a StrategySignal
     * @example
     * // Get one StrategySignal
     * const strategySignal = await prisma.strategySignal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StrategySignalFindFirstArgs>(args?: SelectSubset<T, StrategySignalFindFirstArgs<ExtArgs>>): Prisma__StrategySignalClient<$Result.GetResult<Prisma.$StrategySignalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StrategySignal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategySignalFindFirstOrThrowArgs} args - Arguments to find a StrategySignal
     * @example
     * // Get one StrategySignal
     * const strategySignal = await prisma.strategySignal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StrategySignalFindFirstOrThrowArgs>(args?: SelectSubset<T, StrategySignalFindFirstOrThrowArgs<ExtArgs>>): Prisma__StrategySignalClient<$Result.GetResult<Prisma.$StrategySignalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StrategySignals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategySignalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StrategySignals
     * const strategySignals = await prisma.strategySignal.findMany()
     * 
     * // Get first 10 StrategySignals
     * const strategySignals = await prisma.strategySignal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const strategySignalWithIdOnly = await prisma.strategySignal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StrategySignalFindManyArgs>(args?: SelectSubset<T, StrategySignalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StrategySignalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StrategySignal.
     * @param {StrategySignalCreateArgs} args - Arguments to create a StrategySignal.
     * @example
     * // Create one StrategySignal
     * const StrategySignal = await prisma.strategySignal.create({
     *   data: {
     *     // ... data to create a StrategySignal
     *   }
     * })
     * 
     */
    create<T extends StrategySignalCreateArgs>(args: SelectSubset<T, StrategySignalCreateArgs<ExtArgs>>): Prisma__StrategySignalClient<$Result.GetResult<Prisma.$StrategySignalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StrategySignals.
     * @param {StrategySignalCreateManyArgs} args - Arguments to create many StrategySignals.
     * @example
     * // Create many StrategySignals
     * const strategySignal = await prisma.strategySignal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StrategySignalCreateManyArgs>(args?: SelectSubset<T, StrategySignalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StrategySignals and returns the data saved in the database.
     * @param {StrategySignalCreateManyAndReturnArgs} args - Arguments to create many StrategySignals.
     * @example
     * // Create many StrategySignals
     * const strategySignal = await prisma.strategySignal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StrategySignals and only return the `id`
     * const strategySignalWithIdOnly = await prisma.strategySignal.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StrategySignalCreateManyAndReturnArgs>(args?: SelectSubset<T, StrategySignalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StrategySignalPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StrategySignal.
     * @param {StrategySignalDeleteArgs} args - Arguments to delete one StrategySignal.
     * @example
     * // Delete one StrategySignal
     * const StrategySignal = await prisma.strategySignal.delete({
     *   where: {
     *     // ... filter to delete one StrategySignal
     *   }
     * })
     * 
     */
    delete<T extends StrategySignalDeleteArgs>(args: SelectSubset<T, StrategySignalDeleteArgs<ExtArgs>>): Prisma__StrategySignalClient<$Result.GetResult<Prisma.$StrategySignalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StrategySignal.
     * @param {StrategySignalUpdateArgs} args - Arguments to update one StrategySignal.
     * @example
     * // Update one StrategySignal
     * const strategySignal = await prisma.strategySignal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StrategySignalUpdateArgs>(args: SelectSubset<T, StrategySignalUpdateArgs<ExtArgs>>): Prisma__StrategySignalClient<$Result.GetResult<Prisma.$StrategySignalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StrategySignals.
     * @param {StrategySignalDeleteManyArgs} args - Arguments to filter StrategySignals to delete.
     * @example
     * // Delete a few StrategySignals
     * const { count } = await prisma.strategySignal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StrategySignalDeleteManyArgs>(args?: SelectSubset<T, StrategySignalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StrategySignals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategySignalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StrategySignals
     * const strategySignal = await prisma.strategySignal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StrategySignalUpdateManyArgs>(args: SelectSubset<T, StrategySignalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StrategySignals and returns the data updated in the database.
     * @param {StrategySignalUpdateManyAndReturnArgs} args - Arguments to update many StrategySignals.
     * @example
     * // Update many StrategySignals
     * const strategySignal = await prisma.strategySignal.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StrategySignals and only return the `id`
     * const strategySignalWithIdOnly = await prisma.strategySignal.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StrategySignalUpdateManyAndReturnArgs>(args: SelectSubset<T, StrategySignalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StrategySignalPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StrategySignal.
     * @param {StrategySignalUpsertArgs} args - Arguments to update or create a StrategySignal.
     * @example
     * // Update or create a StrategySignal
     * const strategySignal = await prisma.strategySignal.upsert({
     *   create: {
     *     // ... data to create a StrategySignal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StrategySignal we want to update
     *   }
     * })
     */
    upsert<T extends StrategySignalUpsertArgs>(args: SelectSubset<T, StrategySignalUpsertArgs<ExtArgs>>): Prisma__StrategySignalClient<$Result.GetResult<Prisma.$StrategySignalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StrategySignals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategySignalCountArgs} args - Arguments to filter StrategySignals to count.
     * @example
     * // Count the number of StrategySignals
     * const count = await prisma.strategySignal.count({
     *   where: {
     *     // ... the filter for the StrategySignals we want to count
     *   }
     * })
    **/
    count<T extends StrategySignalCountArgs>(
      args?: Subset<T, StrategySignalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StrategySignalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StrategySignal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategySignalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StrategySignalAggregateArgs>(args: Subset<T, StrategySignalAggregateArgs>): Prisma.PrismaPromise<GetStrategySignalAggregateType<T>>

    /**
     * Group by StrategySignal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StrategySignalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StrategySignalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StrategySignalGroupByArgs['orderBy'] }
        : { orderBy?: StrategySignalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StrategySignalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStrategySignalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StrategySignal model
   */
  readonly fields: StrategySignalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StrategySignal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StrategySignalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    symbol<T extends SymbolDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SymbolDefaultArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StrategySignal model
   */
  interface StrategySignalFieldRefs {
    readonly id: FieldRef<"StrategySignal", 'String'>
    readonly symbolId: FieldRef<"StrategySignal", 'String'>
    readonly strategyId: FieldRef<"StrategySignal", 'String'>
    readonly signalValue: FieldRef<"StrategySignal", 'String'>
    readonly price: FieldRef<"StrategySignal", 'Float'>
    readonly triggeredAt: FieldRef<"StrategySignal", 'DateTime'>
    readonly updatedAt: FieldRef<"StrategySignal", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StrategySignal findUnique
   */
  export type StrategySignalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategySignal
     */
    select?: StrategySignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategySignal
     */
    omit?: StrategySignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategySignalInclude<ExtArgs> | null
    /**
     * Filter, which StrategySignal to fetch.
     */
    where: StrategySignalWhereUniqueInput
  }

  /**
   * StrategySignal findUniqueOrThrow
   */
  export type StrategySignalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategySignal
     */
    select?: StrategySignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategySignal
     */
    omit?: StrategySignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategySignalInclude<ExtArgs> | null
    /**
     * Filter, which StrategySignal to fetch.
     */
    where: StrategySignalWhereUniqueInput
  }

  /**
   * StrategySignal findFirst
   */
  export type StrategySignalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategySignal
     */
    select?: StrategySignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategySignal
     */
    omit?: StrategySignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategySignalInclude<ExtArgs> | null
    /**
     * Filter, which StrategySignal to fetch.
     */
    where?: StrategySignalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StrategySignals to fetch.
     */
    orderBy?: StrategySignalOrderByWithRelationInput | StrategySignalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StrategySignals.
     */
    cursor?: StrategySignalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StrategySignals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StrategySignals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StrategySignals.
     */
    distinct?: StrategySignalScalarFieldEnum | StrategySignalScalarFieldEnum[]
  }

  /**
   * StrategySignal findFirstOrThrow
   */
  export type StrategySignalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategySignal
     */
    select?: StrategySignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategySignal
     */
    omit?: StrategySignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategySignalInclude<ExtArgs> | null
    /**
     * Filter, which StrategySignal to fetch.
     */
    where?: StrategySignalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StrategySignals to fetch.
     */
    orderBy?: StrategySignalOrderByWithRelationInput | StrategySignalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StrategySignals.
     */
    cursor?: StrategySignalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StrategySignals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StrategySignals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StrategySignals.
     */
    distinct?: StrategySignalScalarFieldEnum | StrategySignalScalarFieldEnum[]
  }

  /**
   * StrategySignal findMany
   */
  export type StrategySignalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategySignal
     */
    select?: StrategySignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategySignal
     */
    omit?: StrategySignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategySignalInclude<ExtArgs> | null
    /**
     * Filter, which StrategySignals to fetch.
     */
    where?: StrategySignalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StrategySignals to fetch.
     */
    orderBy?: StrategySignalOrderByWithRelationInput | StrategySignalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StrategySignals.
     */
    cursor?: StrategySignalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StrategySignals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StrategySignals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StrategySignals.
     */
    distinct?: StrategySignalScalarFieldEnum | StrategySignalScalarFieldEnum[]
  }

  /**
   * StrategySignal create
   */
  export type StrategySignalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategySignal
     */
    select?: StrategySignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategySignal
     */
    omit?: StrategySignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategySignalInclude<ExtArgs> | null
    /**
     * The data needed to create a StrategySignal.
     */
    data: XOR<StrategySignalCreateInput, StrategySignalUncheckedCreateInput>
  }

  /**
   * StrategySignal createMany
   */
  export type StrategySignalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StrategySignals.
     */
    data: StrategySignalCreateManyInput | StrategySignalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StrategySignal createManyAndReturn
   */
  export type StrategySignalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategySignal
     */
    select?: StrategySignalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StrategySignal
     */
    omit?: StrategySignalOmit<ExtArgs> | null
    /**
     * The data used to create many StrategySignals.
     */
    data: StrategySignalCreateManyInput | StrategySignalCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategySignalIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StrategySignal update
   */
  export type StrategySignalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategySignal
     */
    select?: StrategySignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategySignal
     */
    omit?: StrategySignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategySignalInclude<ExtArgs> | null
    /**
     * The data needed to update a StrategySignal.
     */
    data: XOR<StrategySignalUpdateInput, StrategySignalUncheckedUpdateInput>
    /**
     * Choose, which StrategySignal to update.
     */
    where: StrategySignalWhereUniqueInput
  }

  /**
   * StrategySignal updateMany
   */
  export type StrategySignalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StrategySignals.
     */
    data: XOR<StrategySignalUpdateManyMutationInput, StrategySignalUncheckedUpdateManyInput>
    /**
     * Filter which StrategySignals to update
     */
    where?: StrategySignalWhereInput
    /**
     * Limit how many StrategySignals to update.
     */
    limit?: number
  }

  /**
   * StrategySignal updateManyAndReturn
   */
  export type StrategySignalUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategySignal
     */
    select?: StrategySignalSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StrategySignal
     */
    omit?: StrategySignalOmit<ExtArgs> | null
    /**
     * The data used to update StrategySignals.
     */
    data: XOR<StrategySignalUpdateManyMutationInput, StrategySignalUncheckedUpdateManyInput>
    /**
     * Filter which StrategySignals to update
     */
    where?: StrategySignalWhereInput
    /**
     * Limit how many StrategySignals to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategySignalIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StrategySignal upsert
   */
  export type StrategySignalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategySignal
     */
    select?: StrategySignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategySignal
     */
    omit?: StrategySignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategySignalInclude<ExtArgs> | null
    /**
     * The filter to search for the StrategySignal to update in case it exists.
     */
    where: StrategySignalWhereUniqueInput
    /**
     * In case the StrategySignal found by the `where` argument doesn't exist, create a new StrategySignal with this data.
     */
    create: XOR<StrategySignalCreateInput, StrategySignalUncheckedCreateInput>
    /**
     * In case the StrategySignal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StrategySignalUpdateInput, StrategySignalUncheckedUpdateInput>
  }

  /**
   * StrategySignal delete
   */
  export type StrategySignalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategySignal
     */
    select?: StrategySignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategySignal
     */
    omit?: StrategySignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategySignalInclude<ExtArgs> | null
    /**
     * Filter which StrategySignal to delete.
     */
    where: StrategySignalWhereUniqueInput
  }

  /**
   * StrategySignal deleteMany
   */
  export type StrategySignalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StrategySignals to delete
     */
    where?: StrategySignalWhereInput
    /**
     * Limit how many StrategySignals to delete.
     */
    limit?: number
  }

  /**
   * StrategySignal without action
   */
  export type StrategySignalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StrategySignal
     */
    select?: StrategySignalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StrategySignal
     */
    omit?: StrategySignalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StrategySignalInclude<ExtArgs> | null
  }


  /**
   * Model FundamentalMetric
   */

  export type AggregateFundamentalMetric = {
    _count: FundamentalMetricCountAggregateOutputType | null
    _avg: FundamentalMetricAvgAggregateOutputType | null
    _sum: FundamentalMetricSumAggregateOutputType | null
    _min: FundamentalMetricMinAggregateOutputType | null
    _max: FundamentalMetricMaxAggregateOutputType | null
  }

  export type FundamentalMetricAvgAggregateOutputType = {
    peRatio: number | null
    forwardPe: number | null
    priceToSales: number | null
    evToEbitda: number | null
    fcfYield: number | null
    revGrowth: number | null
    epsGrowth: number | null
  }

  export type FundamentalMetricSumAggregateOutputType = {
    peRatio: number | null
    forwardPe: number | null
    priceToSales: number | null
    evToEbitda: number | null
    fcfYield: number | null
    revGrowth: number | null
    epsGrowth: number | null
  }

  export type FundamentalMetricMinAggregateOutputType = {
    symbolId: string | null
    peRatio: number | null
    forwardPe: number | null
    priceToSales: number | null
    evToEbitda: number | null
    fcfYield: number | null
    revGrowth: number | null
    epsGrowth: number | null
    updatedAt: Date | null
  }

  export type FundamentalMetricMaxAggregateOutputType = {
    symbolId: string | null
    peRatio: number | null
    forwardPe: number | null
    priceToSales: number | null
    evToEbitda: number | null
    fcfYield: number | null
    revGrowth: number | null
    epsGrowth: number | null
    updatedAt: Date | null
  }

  export type FundamentalMetricCountAggregateOutputType = {
    symbolId: number
    peRatio: number
    forwardPe: number
    priceToSales: number
    evToEbitda: number
    fcfYield: number
    revGrowth: number
    epsGrowth: number
    updatedAt: number
    _all: number
  }


  export type FundamentalMetricAvgAggregateInputType = {
    peRatio?: true
    forwardPe?: true
    priceToSales?: true
    evToEbitda?: true
    fcfYield?: true
    revGrowth?: true
    epsGrowth?: true
  }

  export type FundamentalMetricSumAggregateInputType = {
    peRatio?: true
    forwardPe?: true
    priceToSales?: true
    evToEbitda?: true
    fcfYield?: true
    revGrowth?: true
    epsGrowth?: true
  }

  export type FundamentalMetricMinAggregateInputType = {
    symbolId?: true
    peRatio?: true
    forwardPe?: true
    priceToSales?: true
    evToEbitda?: true
    fcfYield?: true
    revGrowth?: true
    epsGrowth?: true
    updatedAt?: true
  }

  export type FundamentalMetricMaxAggregateInputType = {
    symbolId?: true
    peRatio?: true
    forwardPe?: true
    priceToSales?: true
    evToEbitda?: true
    fcfYield?: true
    revGrowth?: true
    epsGrowth?: true
    updatedAt?: true
  }

  export type FundamentalMetricCountAggregateInputType = {
    symbolId?: true
    peRatio?: true
    forwardPe?: true
    priceToSales?: true
    evToEbitda?: true
    fcfYield?: true
    revGrowth?: true
    epsGrowth?: true
    updatedAt?: true
    _all?: true
  }

  export type FundamentalMetricAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FundamentalMetric to aggregate.
     */
    where?: FundamentalMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FundamentalMetrics to fetch.
     */
    orderBy?: FundamentalMetricOrderByWithRelationInput | FundamentalMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FundamentalMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FundamentalMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FundamentalMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FundamentalMetrics
    **/
    _count?: true | FundamentalMetricCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FundamentalMetricAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FundamentalMetricSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FundamentalMetricMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FundamentalMetricMaxAggregateInputType
  }

  export type GetFundamentalMetricAggregateType<T extends FundamentalMetricAggregateArgs> = {
        [P in keyof T & keyof AggregateFundamentalMetric]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFundamentalMetric[P]>
      : GetScalarType<T[P], AggregateFundamentalMetric[P]>
  }




  export type FundamentalMetricGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FundamentalMetricWhereInput
    orderBy?: FundamentalMetricOrderByWithAggregationInput | FundamentalMetricOrderByWithAggregationInput[]
    by: FundamentalMetricScalarFieldEnum[] | FundamentalMetricScalarFieldEnum
    having?: FundamentalMetricScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FundamentalMetricCountAggregateInputType | true
    _avg?: FundamentalMetricAvgAggregateInputType
    _sum?: FundamentalMetricSumAggregateInputType
    _min?: FundamentalMetricMinAggregateInputType
    _max?: FundamentalMetricMaxAggregateInputType
  }

  export type FundamentalMetricGroupByOutputType = {
    symbolId: string
    peRatio: number | null
    forwardPe: number | null
    priceToSales: number | null
    evToEbitda: number | null
    fcfYield: number | null
    revGrowth: number | null
    epsGrowth: number | null
    updatedAt: Date
    _count: FundamentalMetricCountAggregateOutputType | null
    _avg: FundamentalMetricAvgAggregateOutputType | null
    _sum: FundamentalMetricSumAggregateOutputType | null
    _min: FundamentalMetricMinAggregateOutputType | null
    _max: FundamentalMetricMaxAggregateOutputType | null
  }

  type GetFundamentalMetricGroupByPayload<T extends FundamentalMetricGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FundamentalMetricGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FundamentalMetricGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FundamentalMetricGroupByOutputType[P]>
            : GetScalarType<T[P], FundamentalMetricGroupByOutputType[P]>
        }
      >
    >


  export type FundamentalMetricSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    symbolId?: boolean
    peRatio?: boolean
    forwardPe?: boolean
    priceToSales?: boolean
    evToEbitda?: boolean
    fcfYield?: boolean
    revGrowth?: boolean
    epsGrowth?: boolean
    updatedAt?: boolean
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fundamentalMetric"]>

  export type FundamentalMetricSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    symbolId?: boolean
    peRatio?: boolean
    forwardPe?: boolean
    priceToSales?: boolean
    evToEbitda?: boolean
    fcfYield?: boolean
    revGrowth?: boolean
    epsGrowth?: boolean
    updatedAt?: boolean
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fundamentalMetric"]>

  export type FundamentalMetricSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    symbolId?: boolean
    peRatio?: boolean
    forwardPe?: boolean
    priceToSales?: boolean
    evToEbitda?: boolean
    fcfYield?: boolean
    revGrowth?: boolean
    epsGrowth?: boolean
    updatedAt?: boolean
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fundamentalMetric"]>

  export type FundamentalMetricSelectScalar = {
    symbolId?: boolean
    peRatio?: boolean
    forwardPe?: boolean
    priceToSales?: boolean
    evToEbitda?: boolean
    fcfYield?: boolean
    revGrowth?: boolean
    epsGrowth?: boolean
    updatedAt?: boolean
  }

  export type FundamentalMetricOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"symbolId" | "peRatio" | "forwardPe" | "priceToSales" | "evToEbitda" | "fcfYield" | "revGrowth" | "epsGrowth" | "updatedAt", ExtArgs["result"]["fundamentalMetric"]>
  export type FundamentalMetricInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }
  export type FundamentalMetricIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }
  export type FundamentalMetricIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    symbol?: boolean | SymbolDefaultArgs<ExtArgs>
  }

  export type $FundamentalMetricPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FundamentalMetric"
    objects: {
      symbol: Prisma.$SymbolPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      symbolId: string
      peRatio: number | null
      forwardPe: number | null
      priceToSales: number | null
      evToEbitda: number | null
      fcfYield: number | null
      revGrowth: number | null
      epsGrowth: number | null
      updatedAt: Date
    }, ExtArgs["result"]["fundamentalMetric"]>
    composites: {}
  }

  type FundamentalMetricGetPayload<S extends boolean | null | undefined | FundamentalMetricDefaultArgs> = $Result.GetResult<Prisma.$FundamentalMetricPayload, S>

  type FundamentalMetricCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FundamentalMetricFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FundamentalMetricCountAggregateInputType | true
    }

  export interface FundamentalMetricDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FundamentalMetric'], meta: { name: 'FundamentalMetric' } }
    /**
     * Find zero or one FundamentalMetric that matches the filter.
     * @param {FundamentalMetricFindUniqueArgs} args - Arguments to find a FundamentalMetric
     * @example
     * // Get one FundamentalMetric
     * const fundamentalMetric = await prisma.fundamentalMetric.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FundamentalMetricFindUniqueArgs>(args: SelectSubset<T, FundamentalMetricFindUniqueArgs<ExtArgs>>): Prisma__FundamentalMetricClient<$Result.GetResult<Prisma.$FundamentalMetricPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FundamentalMetric that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FundamentalMetricFindUniqueOrThrowArgs} args - Arguments to find a FundamentalMetric
     * @example
     * // Get one FundamentalMetric
     * const fundamentalMetric = await prisma.fundamentalMetric.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FundamentalMetricFindUniqueOrThrowArgs>(args: SelectSubset<T, FundamentalMetricFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FundamentalMetricClient<$Result.GetResult<Prisma.$FundamentalMetricPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FundamentalMetric that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FundamentalMetricFindFirstArgs} args - Arguments to find a FundamentalMetric
     * @example
     * // Get one FundamentalMetric
     * const fundamentalMetric = await prisma.fundamentalMetric.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FundamentalMetricFindFirstArgs>(args?: SelectSubset<T, FundamentalMetricFindFirstArgs<ExtArgs>>): Prisma__FundamentalMetricClient<$Result.GetResult<Prisma.$FundamentalMetricPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FundamentalMetric that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FundamentalMetricFindFirstOrThrowArgs} args - Arguments to find a FundamentalMetric
     * @example
     * // Get one FundamentalMetric
     * const fundamentalMetric = await prisma.fundamentalMetric.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FundamentalMetricFindFirstOrThrowArgs>(args?: SelectSubset<T, FundamentalMetricFindFirstOrThrowArgs<ExtArgs>>): Prisma__FundamentalMetricClient<$Result.GetResult<Prisma.$FundamentalMetricPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FundamentalMetrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FundamentalMetricFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FundamentalMetrics
     * const fundamentalMetrics = await prisma.fundamentalMetric.findMany()
     * 
     * // Get first 10 FundamentalMetrics
     * const fundamentalMetrics = await prisma.fundamentalMetric.findMany({ take: 10 })
     * 
     * // Only select the `symbolId`
     * const fundamentalMetricWithSymbolIdOnly = await prisma.fundamentalMetric.findMany({ select: { symbolId: true } })
     * 
     */
    findMany<T extends FundamentalMetricFindManyArgs>(args?: SelectSubset<T, FundamentalMetricFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FundamentalMetricPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FundamentalMetric.
     * @param {FundamentalMetricCreateArgs} args - Arguments to create a FundamentalMetric.
     * @example
     * // Create one FundamentalMetric
     * const FundamentalMetric = await prisma.fundamentalMetric.create({
     *   data: {
     *     // ... data to create a FundamentalMetric
     *   }
     * })
     * 
     */
    create<T extends FundamentalMetricCreateArgs>(args: SelectSubset<T, FundamentalMetricCreateArgs<ExtArgs>>): Prisma__FundamentalMetricClient<$Result.GetResult<Prisma.$FundamentalMetricPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FundamentalMetrics.
     * @param {FundamentalMetricCreateManyArgs} args - Arguments to create many FundamentalMetrics.
     * @example
     * // Create many FundamentalMetrics
     * const fundamentalMetric = await prisma.fundamentalMetric.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FundamentalMetricCreateManyArgs>(args?: SelectSubset<T, FundamentalMetricCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FundamentalMetrics and returns the data saved in the database.
     * @param {FundamentalMetricCreateManyAndReturnArgs} args - Arguments to create many FundamentalMetrics.
     * @example
     * // Create many FundamentalMetrics
     * const fundamentalMetric = await prisma.fundamentalMetric.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FundamentalMetrics and only return the `symbolId`
     * const fundamentalMetricWithSymbolIdOnly = await prisma.fundamentalMetric.createManyAndReturn({
     *   select: { symbolId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FundamentalMetricCreateManyAndReturnArgs>(args?: SelectSubset<T, FundamentalMetricCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FundamentalMetricPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FundamentalMetric.
     * @param {FundamentalMetricDeleteArgs} args - Arguments to delete one FundamentalMetric.
     * @example
     * // Delete one FundamentalMetric
     * const FundamentalMetric = await prisma.fundamentalMetric.delete({
     *   where: {
     *     // ... filter to delete one FundamentalMetric
     *   }
     * })
     * 
     */
    delete<T extends FundamentalMetricDeleteArgs>(args: SelectSubset<T, FundamentalMetricDeleteArgs<ExtArgs>>): Prisma__FundamentalMetricClient<$Result.GetResult<Prisma.$FundamentalMetricPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FundamentalMetric.
     * @param {FundamentalMetricUpdateArgs} args - Arguments to update one FundamentalMetric.
     * @example
     * // Update one FundamentalMetric
     * const fundamentalMetric = await prisma.fundamentalMetric.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FundamentalMetricUpdateArgs>(args: SelectSubset<T, FundamentalMetricUpdateArgs<ExtArgs>>): Prisma__FundamentalMetricClient<$Result.GetResult<Prisma.$FundamentalMetricPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FundamentalMetrics.
     * @param {FundamentalMetricDeleteManyArgs} args - Arguments to filter FundamentalMetrics to delete.
     * @example
     * // Delete a few FundamentalMetrics
     * const { count } = await prisma.fundamentalMetric.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FundamentalMetricDeleteManyArgs>(args?: SelectSubset<T, FundamentalMetricDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FundamentalMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FundamentalMetricUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FundamentalMetrics
     * const fundamentalMetric = await prisma.fundamentalMetric.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FundamentalMetricUpdateManyArgs>(args: SelectSubset<T, FundamentalMetricUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FundamentalMetrics and returns the data updated in the database.
     * @param {FundamentalMetricUpdateManyAndReturnArgs} args - Arguments to update many FundamentalMetrics.
     * @example
     * // Update many FundamentalMetrics
     * const fundamentalMetric = await prisma.fundamentalMetric.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FundamentalMetrics and only return the `symbolId`
     * const fundamentalMetricWithSymbolIdOnly = await prisma.fundamentalMetric.updateManyAndReturn({
     *   select: { symbolId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FundamentalMetricUpdateManyAndReturnArgs>(args: SelectSubset<T, FundamentalMetricUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FundamentalMetricPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FundamentalMetric.
     * @param {FundamentalMetricUpsertArgs} args - Arguments to update or create a FundamentalMetric.
     * @example
     * // Update or create a FundamentalMetric
     * const fundamentalMetric = await prisma.fundamentalMetric.upsert({
     *   create: {
     *     // ... data to create a FundamentalMetric
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FundamentalMetric we want to update
     *   }
     * })
     */
    upsert<T extends FundamentalMetricUpsertArgs>(args: SelectSubset<T, FundamentalMetricUpsertArgs<ExtArgs>>): Prisma__FundamentalMetricClient<$Result.GetResult<Prisma.$FundamentalMetricPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FundamentalMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FundamentalMetricCountArgs} args - Arguments to filter FundamentalMetrics to count.
     * @example
     * // Count the number of FundamentalMetrics
     * const count = await prisma.fundamentalMetric.count({
     *   where: {
     *     // ... the filter for the FundamentalMetrics we want to count
     *   }
     * })
    **/
    count<T extends FundamentalMetricCountArgs>(
      args?: Subset<T, FundamentalMetricCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FundamentalMetricCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FundamentalMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FundamentalMetricAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FundamentalMetricAggregateArgs>(args: Subset<T, FundamentalMetricAggregateArgs>): Prisma.PrismaPromise<GetFundamentalMetricAggregateType<T>>

    /**
     * Group by FundamentalMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FundamentalMetricGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FundamentalMetricGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FundamentalMetricGroupByArgs['orderBy'] }
        : { orderBy?: FundamentalMetricGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FundamentalMetricGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFundamentalMetricGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FundamentalMetric model
   */
  readonly fields: FundamentalMetricFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FundamentalMetric.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FundamentalMetricClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    symbol<T extends SymbolDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SymbolDefaultArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FundamentalMetric model
   */
  interface FundamentalMetricFieldRefs {
    readonly symbolId: FieldRef<"FundamentalMetric", 'String'>
    readonly peRatio: FieldRef<"FundamentalMetric", 'Float'>
    readonly forwardPe: FieldRef<"FundamentalMetric", 'Float'>
    readonly priceToSales: FieldRef<"FundamentalMetric", 'Float'>
    readonly evToEbitda: FieldRef<"FundamentalMetric", 'Float'>
    readonly fcfYield: FieldRef<"FundamentalMetric", 'Float'>
    readonly revGrowth: FieldRef<"FundamentalMetric", 'Float'>
    readonly epsGrowth: FieldRef<"FundamentalMetric", 'Float'>
    readonly updatedAt: FieldRef<"FundamentalMetric", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FundamentalMetric findUnique
   */
  export type FundamentalMetricFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FundamentalMetric
     */
    select?: FundamentalMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FundamentalMetric
     */
    omit?: FundamentalMetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FundamentalMetricInclude<ExtArgs> | null
    /**
     * Filter, which FundamentalMetric to fetch.
     */
    where: FundamentalMetricWhereUniqueInput
  }

  /**
   * FundamentalMetric findUniqueOrThrow
   */
  export type FundamentalMetricFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FundamentalMetric
     */
    select?: FundamentalMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FundamentalMetric
     */
    omit?: FundamentalMetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FundamentalMetricInclude<ExtArgs> | null
    /**
     * Filter, which FundamentalMetric to fetch.
     */
    where: FundamentalMetricWhereUniqueInput
  }

  /**
   * FundamentalMetric findFirst
   */
  export type FundamentalMetricFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FundamentalMetric
     */
    select?: FundamentalMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FundamentalMetric
     */
    omit?: FundamentalMetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FundamentalMetricInclude<ExtArgs> | null
    /**
     * Filter, which FundamentalMetric to fetch.
     */
    where?: FundamentalMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FundamentalMetrics to fetch.
     */
    orderBy?: FundamentalMetricOrderByWithRelationInput | FundamentalMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FundamentalMetrics.
     */
    cursor?: FundamentalMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FundamentalMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FundamentalMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FundamentalMetrics.
     */
    distinct?: FundamentalMetricScalarFieldEnum | FundamentalMetricScalarFieldEnum[]
  }

  /**
   * FundamentalMetric findFirstOrThrow
   */
  export type FundamentalMetricFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FundamentalMetric
     */
    select?: FundamentalMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FundamentalMetric
     */
    omit?: FundamentalMetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FundamentalMetricInclude<ExtArgs> | null
    /**
     * Filter, which FundamentalMetric to fetch.
     */
    where?: FundamentalMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FundamentalMetrics to fetch.
     */
    orderBy?: FundamentalMetricOrderByWithRelationInput | FundamentalMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FundamentalMetrics.
     */
    cursor?: FundamentalMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FundamentalMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FundamentalMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FundamentalMetrics.
     */
    distinct?: FundamentalMetricScalarFieldEnum | FundamentalMetricScalarFieldEnum[]
  }

  /**
   * FundamentalMetric findMany
   */
  export type FundamentalMetricFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FundamentalMetric
     */
    select?: FundamentalMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FundamentalMetric
     */
    omit?: FundamentalMetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FundamentalMetricInclude<ExtArgs> | null
    /**
     * Filter, which FundamentalMetrics to fetch.
     */
    where?: FundamentalMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FundamentalMetrics to fetch.
     */
    orderBy?: FundamentalMetricOrderByWithRelationInput | FundamentalMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FundamentalMetrics.
     */
    cursor?: FundamentalMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FundamentalMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FundamentalMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FundamentalMetrics.
     */
    distinct?: FundamentalMetricScalarFieldEnum | FundamentalMetricScalarFieldEnum[]
  }

  /**
   * FundamentalMetric create
   */
  export type FundamentalMetricCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FundamentalMetric
     */
    select?: FundamentalMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FundamentalMetric
     */
    omit?: FundamentalMetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FundamentalMetricInclude<ExtArgs> | null
    /**
     * The data needed to create a FundamentalMetric.
     */
    data: XOR<FundamentalMetricCreateInput, FundamentalMetricUncheckedCreateInput>
  }

  /**
   * FundamentalMetric createMany
   */
  export type FundamentalMetricCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FundamentalMetrics.
     */
    data: FundamentalMetricCreateManyInput | FundamentalMetricCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FundamentalMetric createManyAndReturn
   */
  export type FundamentalMetricCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FundamentalMetric
     */
    select?: FundamentalMetricSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FundamentalMetric
     */
    omit?: FundamentalMetricOmit<ExtArgs> | null
    /**
     * The data used to create many FundamentalMetrics.
     */
    data: FundamentalMetricCreateManyInput | FundamentalMetricCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FundamentalMetricIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FundamentalMetric update
   */
  export type FundamentalMetricUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FundamentalMetric
     */
    select?: FundamentalMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FundamentalMetric
     */
    omit?: FundamentalMetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FundamentalMetricInclude<ExtArgs> | null
    /**
     * The data needed to update a FundamentalMetric.
     */
    data: XOR<FundamentalMetricUpdateInput, FundamentalMetricUncheckedUpdateInput>
    /**
     * Choose, which FundamentalMetric to update.
     */
    where: FundamentalMetricWhereUniqueInput
  }

  /**
   * FundamentalMetric updateMany
   */
  export type FundamentalMetricUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FundamentalMetrics.
     */
    data: XOR<FundamentalMetricUpdateManyMutationInput, FundamentalMetricUncheckedUpdateManyInput>
    /**
     * Filter which FundamentalMetrics to update
     */
    where?: FundamentalMetricWhereInput
    /**
     * Limit how many FundamentalMetrics to update.
     */
    limit?: number
  }

  /**
   * FundamentalMetric updateManyAndReturn
   */
  export type FundamentalMetricUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FundamentalMetric
     */
    select?: FundamentalMetricSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FundamentalMetric
     */
    omit?: FundamentalMetricOmit<ExtArgs> | null
    /**
     * The data used to update FundamentalMetrics.
     */
    data: XOR<FundamentalMetricUpdateManyMutationInput, FundamentalMetricUncheckedUpdateManyInput>
    /**
     * Filter which FundamentalMetrics to update
     */
    where?: FundamentalMetricWhereInput
    /**
     * Limit how many FundamentalMetrics to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FundamentalMetricIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FundamentalMetric upsert
   */
  export type FundamentalMetricUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FundamentalMetric
     */
    select?: FundamentalMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FundamentalMetric
     */
    omit?: FundamentalMetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FundamentalMetricInclude<ExtArgs> | null
    /**
     * The filter to search for the FundamentalMetric to update in case it exists.
     */
    where: FundamentalMetricWhereUniqueInput
    /**
     * In case the FundamentalMetric found by the `where` argument doesn't exist, create a new FundamentalMetric with this data.
     */
    create: XOR<FundamentalMetricCreateInput, FundamentalMetricUncheckedCreateInput>
    /**
     * In case the FundamentalMetric was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FundamentalMetricUpdateInput, FundamentalMetricUncheckedUpdateInput>
  }

  /**
   * FundamentalMetric delete
   */
  export type FundamentalMetricDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FundamentalMetric
     */
    select?: FundamentalMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FundamentalMetric
     */
    omit?: FundamentalMetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FundamentalMetricInclude<ExtArgs> | null
    /**
     * Filter which FundamentalMetric to delete.
     */
    where: FundamentalMetricWhereUniqueInput
  }

  /**
   * FundamentalMetric deleteMany
   */
  export type FundamentalMetricDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FundamentalMetrics to delete
     */
    where?: FundamentalMetricWhereInput
    /**
     * Limit how many FundamentalMetrics to delete.
     */
    limit?: number
  }

  /**
   * FundamentalMetric without action
   */
  export type FundamentalMetricDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FundamentalMetric
     */
    select?: FundamentalMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FundamentalMetric
     */
    omit?: FundamentalMetricOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FundamentalMetricInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SymbolScalarFieldEnum: {
    id: 'id',
    sector: 'sector',
    industry: 'industry',
    name: 'name',
    updatedAt: 'updatedAt'
  };

  export type SymbolScalarFieldEnum = (typeof SymbolScalarFieldEnum)[keyof typeof SymbolScalarFieldEnum]


  export const HistoricalPriceScalarFieldEnum: {
    symbolId: 'symbolId',
    date: 'date',
    open: 'open',
    high: 'high',
    low: 'low',
    close: 'close',
    volume: 'volume'
  };

  export type HistoricalPriceScalarFieldEnum = (typeof HistoricalPriceScalarFieldEnum)[keyof typeof HistoricalPriceScalarFieldEnum]


  export const StrategySignalScalarFieldEnum: {
    id: 'id',
    symbolId: 'symbolId',
    strategyId: 'strategyId',
    signalValue: 'signalValue',
    price: 'price',
    triggeredAt: 'triggeredAt',
    updatedAt: 'updatedAt'
  };

  export type StrategySignalScalarFieldEnum = (typeof StrategySignalScalarFieldEnum)[keyof typeof StrategySignalScalarFieldEnum]


  export const FundamentalMetricScalarFieldEnum: {
    symbolId: 'symbolId',
    peRatio: 'peRatio',
    forwardPe: 'forwardPe',
    priceToSales: 'priceToSales',
    evToEbitda: 'evToEbitda',
    fcfYield: 'fcfYield',
    revGrowth: 'revGrowth',
    epsGrowth: 'epsGrowth',
    updatedAt: 'updatedAt'
  };

  export type FundamentalMetricScalarFieldEnum = (typeof FundamentalMetricScalarFieldEnum)[keyof typeof FundamentalMetricScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type SymbolWhereInput = {
    AND?: SymbolWhereInput | SymbolWhereInput[]
    OR?: SymbolWhereInput[]
    NOT?: SymbolWhereInput | SymbolWhereInput[]
    id?: StringFilter<"Symbol"> | string
    sector?: StringNullableFilter<"Symbol"> | string | null
    industry?: StringNullableFilter<"Symbol"> | string | null
    name?: StringNullableFilter<"Symbol"> | string | null
    updatedAt?: DateTimeFilter<"Symbol"> | Date | string
    prices?: HistoricalPriceListRelationFilter
    signals?: StrategySignalListRelationFilter
    metrics?: XOR<FundamentalMetricNullableScalarRelationFilter, FundamentalMetricWhereInput> | null
  }

  export type SymbolOrderByWithRelationInput = {
    id?: SortOrder
    sector?: SortOrderInput | SortOrder
    industry?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    prices?: HistoricalPriceOrderByRelationAggregateInput
    signals?: StrategySignalOrderByRelationAggregateInput
    metrics?: FundamentalMetricOrderByWithRelationInput
  }

  export type SymbolWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SymbolWhereInput | SymbolWhereInput[]
    OR?: SymbolWhereInput[]
    NOT?: SymbolWhereInput | SymbolWhereInput[]
    sector?: StringNullableFilter<"Symbol"> | string | null
    industry?: StringNullableFilter<"Symbol"> | string | null
    name?: StringNullableFilter<"Symbol"> | string | null
    updatedAt?: DateTimeFilter<"Symbol"> | Date | string
    prices?: HistoricalPriceListRelationFilter
    signals?: StrategySignalListRelationFilter
    metrics?: XOR<FundamentalMetricNullableScalarRelationFilter, FundamentalMetricWhereInput> | null
  }, "id">

  export type SymbolOrderByWithAggregationInput = {
    id?: SortOrder
    sector?: SortOrderInput | SortOrder
    industry?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: SymbolCountOrderByAggregateInput
    _max?: SymbolMaxOrderByAggregateInput
    _min?: SymbolMinOrderByAggregateInput
  }

  export type SymbolScalarWhereWithAggregatesInput = {
    AND?: SymbolScalarWhereWithAggregatesInput | SymbolScalarWhereWithAggregatesInput[]
    OR?: SymbolScalarWhereWithAggregatesInput[]
    NOT?: SymbolScalarWhereWithAggregatesInput | SymbolScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Symbol"> | string
    sector?: StringNullableWithAggregatesFilter<"Symbol"> | string | null
    industry?: StringNullableWithAggregatesFilter<"Symbol"> | string | null
    name?: StringNullableWithAggregatesFilter<"Symbol"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"Symbol"> | Date | string
  }

  export type HistoricalPriceWhereInput = {
    AND?: HistoricalPriceWhereInput | HistoricalPriceWhereInput[]
    OR?: HistoricalPriceWhereInput[]
    NOT?: HistoricalPriceWhereInput | HistoricalPriceWhereInput[]
    symbolId?: StringFilter<"HistoricalPrice"> | string
    date?: DateTimeFilter<"HistoricalPrice"> | Date | string
    open?: FloatFilter<"HistoricalPrice"> | number
    high?: FloatFilter<"HistoricalPrice"> | number
    low?: FloatFilter<"HistoricalPrice"> | number
    close?: FloatFilter<"HistoricalPrice"> | number
    volume?: FloatFilter<"HistoricalPrice"> | number
    symbol?: XOR<SymbolScalarRelationFilter, SymbolWhereInput>
  }

  export type HistoricalPriceOrderByWithRelationInput = {
    symbolId?: SortOrder
    date?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    symbol?: SymbolOrderByWithRelationInput
  }

  export type HistoricalPriceWhereUniqueInput = Prisma.AtLeast<{
    symbolId_date?: HistoricalPriceSymbolIdDateCompoundUniqueInput
    AND?: HistoricalPriceWhereInput | HistoricalPriceWhereInput[]
    OR?: HistoricalPriceWhereInput[]
    NOT?: HistoricalPriceWhereInput | HistoricalPriceWhereInput[]
    symbolId?: StringFilter<"HistoricalPrice"> | string
    date?: DateTimeFilter<"HistoricalPrice"> | Date | string
    open?: FloatFilter<"HistoricalPrice"> | number
    high?: FloatFilter<"HistoricalPrice"> | number
    low?: FloatFilter<"HistoricalPrice"> | number
    close?: FloatFilter<"HistoricalPrice"> | number
    volume?: FloatFilter<"HistoricalPrice"> | number
    symbol?: XOR<SymbolScalarRelationFilter, SymbolWhereInput>
  }, "symbolId_date">

  export type HistoricalPriceOrderByWithAggregationInput = {
    symbolId?: SortOrder
    date?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    _count?: HistoricalPriceCountOrderByAggregateInput
    _avg?: HistoricalPriceAvgOrderByAggregateInput
    _max?: HistoricalPriceMaxOrderByAggregateInput
    _min?: HistoricalPriceMinOrderByAggregateInput
    _sum?: HistoricalPriceSumOrderByAggregateInput
  }

  export type HistoricalPriceScalarWhereWithAggregatesInput = {
    AND?: HistoricalPriceScalarWhereWithAggregatesInput | HistoricalPriceScalarWhereWithAggregatesInput[]
    OR?: HistoricalPriceScalarWhereWithAggregatesInput[]
    NOT?: HistoricalPriceScalarWhereWithAggregatesInput | HistoricalPriceScalarWhereWithAggregatesInput[]
    symbolId?: StringWithAggregatesFilter<"HistoricalPrice"> | string
    date?: DateTimeWithAggregatesFilter<"HistoricalPrice"> | Date | string
    open?: FloatWithAggregatesFilter<"HistoricalPrice"> | number
    high?: FloatWithAggregatesFilter<"HistoricalPrice"> | number
    low?: FloatWithAggregatesFilter<"HistoricalPrice"> | number
    close?: FloatWithAggregatesFilter<"HistoricalPrice"> | number
    volume?: FloatWithAggregatesFilter<"HistoricalPrice"> | number
  }

  export type StrategySignalWhereInput = {
    AND?: StrategySignalWhereInput | StrategySignalWhereInput[]
    OR?: StrategySignalWhereInput[]
    NOT?: StrategySignalWhereInput | StrategySignalWhereInput[]
    id?: StringFilter<"StrategySignal"> | string
    symbolId?: StringFilter<"StrategySignal"> | string
    strategyId?: StringFilter<"StrategySignal"> | string
    signalValue?: StringFilter<"StrategySignal"> | string
    price?: FloatFilter<"StrategySignal"> | number
    triggeredAt?: DateTimeFilter<"StrategySignal"> | Date | string
    updatedAt?: DateTimeFilter<"StrategySignal"> | Date | string
    symbol?: XOR<SymbolScalarRelationFilter, SymbolWhereInput>
  }

  export type StrategySignalOrderByWithRelationInput = {
    id?: SortOrder
    symbolId?: SortOrder
    strategyId?: SortOrder
    signalValue?: SortOrder
    price?: SortOrder
    triggeredAt?: SortOrder
    updatedAt?: SortOrder
    symbol?: SymbolOrderByWithRelationInput
  }

  export type StrategySignalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    symbolId_strategyId?: StrategySignalSymbolIdStrategyIdCompoundUniqueInput
    AND?: StrategySignalWhereInput | StrategySignalWhereInput[]
    OR?: StrategySignalWhereInput[]
    NOT?: StrategySignalWhereInput | StrategySignalWhereInput[]
    symbolId?: StringFilter<"StrategySignal"> | string
    strategyId?: StringFilter<"StrategySignal"> | string
    signalValue?: StringFilter<"StrategySignal"> | string
    price?: FloatFilter<"StrategySignal"> | number
    triggeredAt?: DateTimeFilter<"StrategySignal"> | Date | string
    updatedAt?: DateTimeFilter<"StrategySignal"> | Date | string
    symbol?: XOR<SymbolScalarRelationFilter, SymbolWhereInput>
  }, "id" | "symbolId_strategyId">

  export type StrategySignalOrderByWithAggregationInput = {
    id?: SortOrder
    symbolId?: SortOrder
    strategyId?: SortOrder
    signalValue?: SortOrder
    price?: SortOrder
    triggeredAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StrategySignalCountOrderByAggregateInput
    _avg?: StrategySignalAvgOrderByAggregateInput
    _max?: StrategySignalMaxOrderByAggregateInput
    _min?: StrategySignalMinOrderByAggregateInput
    _sum?: StrategySignalSumOrderByAggregateInput
  }

  export type StrategySignalScalarWhereWithAggregatesInput = {
    AND?: StrategySignalScalarWhereWithAggregatesInput | StrategySignalScalarWhereWithAggregatesInput[]
    OR?: StrategySignalScalarWhereWithAggregatesInput[]
    NOT?: StrategySignalScalarWhereWithAggregatesInput | StrategySignalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StrategySignal"> | string
    symbolId?: StringWithAggregatesFilter<"StrategySignal"> | string
    strategyId?: StringWithAggregatesFilter<"StrategySignal"> | string
    signalValue?: StringWithAggregatesFilter<"StrategySignal"> | string
    price?: FloatWithAggregatesFilter<"StrategySignal"> | number
    triggeredAt?: DateTimeWithAggregatesFilter<"StrategySignal"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"StrategySignal"> | Date | string
  }

  export type FundamentalMetricWhereInput = {
    AND?: FundamentalMetricWhereInput | FundamentalMetricWhereInput[]
    OR?: FundamentalMetricWhereInput[]
    NOT?: FundamentalMetricWhereInput | FundamentalMetricWhereInput[]
    symbolId?: StringFilter<"FundamentalMetric"> | string
    peRatio?: FloatNullableFilter<"FundamentalMetric"> | number | null
    forwardPe?: FloatNullableFilter<"FundamentalMetric"> | number | null
    priceToSales?: FloatNullableFilter<"FundamentalMetric"> | number | null
    evToEbitda?: FloatNullableFilter<"FundamentalMetric"> | number | null
    fcfYield?: FloatNullableFilter<"FundamentalMetric"> | number | null
    revGrowth?: FloatNullableFilter<"FundamentalMetric"> | number | null
    epsGrowth?: FloatNullableFilter<"FundamentalMetric"> | number | null
    updatedAt?: DateTimeFilter<"FundamentalMetric"> | Date | string
    symbol?: XOR<SymbolScalarRelationFilter, SymbolWhereInput>
  }

  export type FundamentalMetricOrderByWithRelationInput = {
    symbolId?: SortOrder
    peRatio?: SortOrderInput | SortOrder
    forwardPe?: SortOrderInput | SortOrder
    priceToSales?: SortOrderInput | SortOrder
    evToEbitda?: SortOrderInput | SortOrder
    fcfYield?: SortOrderInput | SortOrder
    revGrowth?: SortOrderInput | SortOrder
    epsGrowth?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    symbol?: SymbolOrderByWithRelationInput
  }

  export type FundamentalMetricWhereUniqueInput = Prisma.AtLeast<{
    symbolId?: string
    AND?: FundamentalMetricWhereInput | FundamentalMetricWhereInput[]
    OR?: FundamentalMetricWhereInput[]
    NOT?: FundamentalMetricWhereInput | FundamentalMetricWhereInput[]
    peRatio?: FloatNullableFilter<"FundamentalMetric"> | number | null
    forwardPe?: FloatNullableFilter<"FundamentalMetric"> | number | null
    priceToSales?: FloatNullableFilter<"FundamentalMetric"> | number | null
    evToEbitda?: FloatNullableFilter<"FundamentalMetric"> | number | null
    fcfYield?: FloatNullableFilter<"FundamentalMetric"> | number | null
    revGrowth?: FloatNullableFilter<"FundamentalMetric"> | number | null
    epsGrowth?: FloatNullableFilter<"FundamentalMetric"> | number | null
    updatedAt?: DateTimeFilter<"FundamentalMetric"> | Date | string
    symbol?: XOR<SymbolScalarRelationFilter, SymbolWhereInput>
  }, "symbolId">

  export type FundamentalMetricOrderByWithAggregationInput = {
    symbolId?: SortOrder
    peRatio?: SortOrderInput | SortOrder
    forwardPe?: SortOrderInput | SortOrder
    priceToSales?: SortOrderInput | SortOrder
    evToEbitda?: SortOrderInput | SortOrder
    fcfYield?: SortOrderInput | SortOrder
    revGrowth?: SortOrderInput | SortOrder
    epsGrowth?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: FundamentalMetricCountOrderByAggregateInput
    _avg?: FundamentalMetricAvgOrderByAggregateInput
    _max?: FundamentalMetricMaxOrderByAggregateInput
    _min?: FundamentalMetricMinOrderByAggregateInput
    _sum?: FundamentalMetricSumOrderByAggregateInput
  }

  export type FundamentalMetricScalarWhereWithAggregatesInput = {
    AND?: FundamentalMetricScalarWhereWithAggregatesInput | FundamentalMetricScalarWhereWithAggregatesInput[]
    OR?: FundamentalMetricScalarWhereWithAggregatesInput[]
    NOT?: FundamentalMetricScalarWhereWithAggregatesInput | FundamentalMetricScalarWhereWithAggregatesInput[]
    symbolId?: StringWithAggregatesFilter<"FundamentalMetric"> | string
    peRatio?: FloatNullableWithAggregatesFilter<"FundamentalMetric"> | number | null
    forwardPe?: FloatNullableWithAggregatesFilter<"FundamentalMetric"> | number | null
    priceToSales?: FloatNullableWithAggregatesFilter<"FundamentalMetric"> | number | null
    evToEbitda?: FloatNullableWithAggregatesFilter<"FundamentalMetric"> | number | null
    fcfYield?: FloatNullableWithAggregatesFilter<"FundamentalMetric"> | number | null
    revGrowth?: FloatNullableWithAggregatesFilter<"FundamentalMetric"> | number | null
    epsGrowth?: FloatNullableWithAggregatesFilter<"FundamentalMetric"> | number | null
    updatedAt?: DateTimeWithAggregatesFilter<"FundamentalMetric"> | Date | string
  }

  export type SymbolCreateInput = {
    id: string
    sector?: string | null
    industry?: string | null
    name?: string | null
    updatedAt?: Date | string
    prices?: HistoricalPriceCreateNestedManyWithoutSymbolInput
    signals?: StrategySignalCreateNestedManyWithoutSymbolInput
    metrics?: FundamentalMetricCreateNestedOneWithoutSymbolInput
  }

  export type SymbolUncheckedCreateInput = {
    id: string
    sector?: string | null
    industry?: string | null
    name?: string | null
    updatedAt?: Date | string
    prices?: HistoricalPriceUncheckedCreateNestedManyWithoutSymbolInput
    signals?: StrategySignalUncheckedCreateNestedManyWithoutSymbolInput
    metrics?: FundamentalMetricUncheckedCreateNestedOneWithoutSymbolInput
  }

  export type SymbolUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prices?: HistoricalPriceUpdateManyWithoutSymbolNestedInput
    signals?: StrategySignalUpdateManyWithoutSymbolNestedInput
    metrics?: FundamentalMetricUpdateOneWithoutSymbolNestedInput
  }

  export type SymbolUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prices?: HistoricalPriceUncheckedUpdateManyWithoutSymbolNestedInput
    signals?: StrategySignalUncheckedUpdateManyWithoutSymbolNestedInput
    metrics?: FundamentalMetricUncheckedUpdateOneWithoutSymbolNestedInput
  }

  export type SymbolCreateManyInput = {
    id: string
    sector?: string | null
    industry?: string | null
    name?: string | null
    updatedAt?: Date | string
  }

  export type SymbolUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SymbolUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistoricalPriceCreateInput = {
    date: Date | string
    open: number
    high: number
    low: number
    close: number
    volume: number
    symbol: SymbolCreateNestedOneWithoutPricesInput
  }

  export type HistoricalPriceUncheckedCreateInput = {
    symbolId: string
    date: Date | string
    open: number
    high: number
    low: number
    close: number
    volume: number
  }

  export type HistoricalPriceUpdateInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: FloatFieldUpdateOperationsInput | number
    high?: FloatFieldUpdateOperationsInput | number
    low?: FloatFieldUpdateOperationsInput | number
    close?: FloatFieldUpdateOperationsInput | number
    volume?: FloatFieldUpdateOperationsInput | number
    symbol?: SymbolUpdateOneRequiredWithoutPricesNestedInput
  }

  export type HistoricalPriceUncheckedUpdateInput = {
    symbolId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: FloatFieldUpdateOperationsInput | number
    high?: FloatFieldUpdateOperationsInput | number
    low?: FloatFieldUpdateOperationsInput | number
    close?: FloatFieldUpdateOperationsInput | number
    volume?: FloatFieldUpdateOperationsInput | number
  }

  export type HistoricalPriceCreateManyInput = {
    symbolId: string
    date: Date | string
    open: number
    high: number
    low: number
    close: number
    volume: number
  }

  export type HistoricalPriceUpdateManyMutationInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: FloatFieldUpdateOperationsInput | number
    high?: FloatFieldUpdateOperationsInput | number
    low?: FloatFieldUpdateOperationsInput | number
    close?: FloatFieldUpdateOperationsInput | number
    volume?: FloatFieldUpdateOperationsInput | number
  }

  export type HistoricalPriceUncheckedUpdateManyInput = {
    symbolId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: FloatFieldUpdateOperationsInput | number
    high?: FloatFieldUpdateOperationsInput | number
    low?: FloatFieldUpdateOperationsInput | number
    close?: FloatFieldUpdateOperationsInput | number
    volume?: FloatFieldUpdateOperationsInput | number
  }

  export type StrategySignalCreateInput = {
    id?: string
    strategyId: string
    signalValue: string
    price: number
    triggeredAt: Date | string
    updatedAt?: Date | string
    symbol: SymbolCreateNestedOneWithoutSignalsInput
  }

  export type StrategySignalUncheckedCreateInput = {
    id?: string
    symbolId: string
    strategyId: string
    signalValue: string
    price: number
    triggeredAt: Date | string
    updatedAt?: Date | string
  }

  export type StrategySignalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    strategyId?: StringFieldUpdateOperationsInput | string
    signalValue?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    triggeredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: SymbolUpdateOneRequiredWithoutSignalsNestedInput
  }

  export type StrategySignalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbolId?: StringFieldUpdateOperationsInput | string
    strategyId?: StringFieldUpdateOperationsInput | string
    signalValue?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    triggeredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StrategySignalCreateManyInput = {
    id?: string
    symbolId: string
    strategyId: string
    signalValue: string
    price: number
    triggeredAt: Date | string
    updatedAt?: Date | string
  }

  export type StrategySignalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    strategyId?: StringFieldUpdateOperationsInput | string
    signalValue?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    triggeredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StrategySignalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbolId?: StringFieldUpdateOperationsInput | string
    strategyId?: StringFieldUpdateOperationsInput | string
    signalValue?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    triggeredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FundamentalMetricCreateInput = {
    peRatio?: number | null
    forwardPe?: number | null
    priceToSales?: number | null
    evToEbitda?: number | null
    fcfYield?: number | null
    revGrowth?: number | null
    epsGrowth?: number | null
    updatedAt?: Date | string
    symbol: SymbolCreateNestedOneWithoutMetricsInput
  }

  export type FundamentalMetricUncheckedCreateInput = {
    symbolId: string
    peRatio?: number | null
    forwardPe?: number | null
    priceToSales?: number | null
    evToEbitda?: number | null
    fcfYield?: number | null
    revGrowth?: number | null
    epsGrowth?: number | null
    updatedAt?: Date | string
  }

  export type FundamentalMetricUpdateInput = {
    peRatio?: NullableFloatFieldUpdateOperationsInput | number | null
    forwardPe?: NullableFloatFieldUpdateOperationsInput | number | null
    priceToSales?: NullableFloatFieldUpdateOperationsInput | number | null
    evToEbitda?: NullableFloatFieldUpdateOperationsInput | number | null
    fcfYield?: NullableFloatFieldUpdateOperationsInput | number | null
    revGrowth?: NullableFloatFieldUpdateOperationsInput | number | null
    epsGrowth?: NullableFloatFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: SymbolUpdateOneRequiredWithoutMetricsNestedInput
  }

  export type FundamentalMetricUncheckedUpdateInput = {
    symbolId?: StringFieldUpdateOperationsInput | string
    peRatio?: NullableFloatFieldUpdateOperationsInput | number | null
    forwardPe?: NullableFloatFieldUpdateOperationsInput | number | null
    priceToSales?: NullableFloatFieldUpdateOperationsInput | number | null
    evToEbitda?: NullableFloatFieldUpdateOperationsInput | number | null
    fcfYield?: NullableFloatFieldUpdateOperationsInput | number | null
    revGrowth?: NullableFloatFieldUpdateOperationsInput | number | null
    epsGrowth?: NullableFloatFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FundamentalMetricCreateManyInput = {
    symbolId: string
    peRatio?: number | null
    forwardPe?: number | null
    priceToSales?: number | null
    evToEbitda?: number | null
    fcfYield?: number | null
    revGrowth?: number | null
    epsGrowth?: number | null
    updatedAt?: Date | string
  }

  export type FundamentalMetricUpdateManyMutationInput = {
    peRatio?: NullableFloatFieldUpdateOperationsInput | number | null
    forwardPe?: NullableFloatFieldUpdateOperationsInput | number | null
    priceToSales?: NullableFloatFieldUpdateOperationsInput | number | null
    evToEbitda?: NullableFloatFieldUpdateOperationsInput | number | null
    fcfYield?: NullableFloatFieldUpdateOperationsInput | number | null
    revGrowth?: NullableFloatFieldUpdateOperationsInput | number | null
    epsGrowth?: NullableFloatFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FundamentalMetricUncheckedUpdateManyInput = {
    symbolId?: StringFieldUpdateOperationsInput | string
    peRatio?: NullableFloatFieldUpdateOperationsInput | number | null
    forwardPe?: NullableFloatFieldUpdateOperationsInput | number | null
    priceToSales?: NullableFloatFieldUpdateOperationsInput | number | null
    evToEbitda?: NullableFloatFieldUpdateOperationsInput | number | null
    fcfYield?: NullableFloatFieldUpdateOperationsInput | number | null
    revGrowth?: NullableFloatFieldUpdateOperationsInput | number | null
    epsGrowth?: NullableFloatFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type HistoricalPriceListRelationFilter = {
    every?: HistoricalPriceWhereInput
    some?: HistoricalPriceWhereInput
    none?: HistoricalPriceWhereInput
  }

  export type StrategySignalListRelationFilter = {
    every?: StrategySignalWhereInput
    some?: StrategySignalWhereInput
    none?: StrategySignalWhereInput
  }

  export type FundamentalMetricNullableScalarRelationFilter = {
    is?: FundamentalMetricWhereInput | null
    isNot?: FundamentalMetricWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type HistoricalPriceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StrategySignalOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SymbolCountOrderByAggregateInput = {
    id?: SortOrder
    sector?: SortOrder
    industry?: SortOrder
    name?: SortOrder
    updatedAt?: SortOrder
  }

  export type SymbolMaxOrderByAggregateInput = {
    id?: SortOrder
    sector?: SortOrder
    industry?: SortOrder
    name?: SortOrder
    updatedAt?: SortOrder
  }

  export type SymbolMinOrderByAggregateInput = {
    id?: SortOrder
    sector?: SortOrder
    industry?: SortOrder
    name?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type SymbolScalarRelationFilter = {
    is?: SymbolWhereInput
    isNot?: SymbolWhereInput
  }

  export type HistoricalPriceSymbolIdDateCompoundUniqueInput = {
    symbolId: string
    date: Date | string
  }

  export type HistoricalPriceCountOrderByAggregateInput = {
    symbolId?: SortOrder
    date?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
  }

  export type HistoricalPriceAvgOrderByAggregateInput = {
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
  }

  export type HistoricalPriceMaxOrderByAggregateInput = {
    symbolId?: SortOrder
    date?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
  }

  export type HistoricalPriceMinOrderByAggregateInput = {
    symbolId?: SortOrder
    date?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
  }

  export type HistoricalPriceSumOrderByAggregateInput = {
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type StrategySignalSymbolIdStrategyIdCompoundUniqueInput = {
    symbolId: string
    strategyId: string
  }

  export type StrategySignalCountOrderByAggregateInput = {
    id?: SortOrder
    symbolId?: SortOrder
    strategyId?: SortOrder
    signalValue?: SortOrder
    price?: SortOrder
    triggeredAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StrategySignalAvgOrderByAggregateInput = {
    price?: SortOrder
  }

  export type StrategySignalMaxOrderByAggregateInput = {
    id?: SortOrder
    symbolId?: SortOrder
    strategyId?: SortOrder
    signalValue?: SortOrder
    price?: SortOrder
    triggeredAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StrategySignalMinOrderByAggregateInput = {
    id?: SortOrder
    symbolId?: SortOrder
    strategyId?: SortOrder
    signalValue?: SortOrder
    price?: SortOrder
    triggeredAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StrategySignalSumOrderByAggregateInput = {
    price?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type FundamentalMetricCountOrderByAggregateInput = {
    symbolId?: SortOrder
    peRatio?: SortOrder
    forwardPe?: SortOrder
    priceToSales?: SortOrder
    evToEbitda?: SortOrder
    fcfYield?: SortOrder
    revGrowth?: SortOrder
    epsGrowth?: SortOrder
    updatedAt?: SortOrder
  }

  export type FundamentalMetricAvgOrderByAggregateInput = {
    peRatio?: SortOrder
    forwardPe?: SortOrder
    priceToSales?: SortOrder
    evToEbitda?: SortOrder
    fcfYield?: SortOrder
    revGrowth?: SortOrder
    epsGrowth?: SortOrder
  }

  export type FundamentalMetricMaxOrderByAggregateInput = {
    symbolId?: SortOrder
    peRatio?: SortOrder
    forwardPe?: SortOrder
    priceToSales?: SortOrder
    evToEbitda?: SortOrder
    fcfYield?: SortOrder
    revGrowth?: SortOrder
    epsGrowth?: SortOrder
    updatedAt?: SortOrder
  }

  export type FundamentalMetricMinOrderByAggregateInput = {
    symbolId?: SortOrder
    peRatio?: SortOrder
    forwardPe?: SortOrder
    priceToSales?: SortOrder
    evToEbitda?: SortOrder
    fcfYield?: SortOrder
    revGrowth?: SortOrder
    epsGrowth?: SortOrder
    updatedAt?: SortOrder
  }

  export type FundamentalMetricSumOrderByAggregateInput = {
    peRatio?: SortOrder
    forwardPe?: SortOrder
    priceToSales?: SortOrder
    evToEbitda?: SortOrder
    fcfYield?: SortOrder
    revGrowth?: SortOrder
    epsGrowth?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type HistoricalPriceCreateNestedManyWithoutSymbolInput = {
    create?: XOR<HistoricalPriceCreateWithoutSymbolInput, HistoricalPriceUncheckedCreateWithoutSymbolInput> | HistoricalPriceCreateWithoutSymbolInput[] | HistoricalPriceUncheckedCreateWithoutSymbolInput[]
    connectOrCreate?: HistoricalPriceCreateOrConnectWithoutSymbolInput | HistoricalPriceCreateOrConnectWithoutSymbolInput[]
    createMany?: HistoricalPriceCreateManySymbolInputEnvelope
    connect?: HistoricalPriceWhereUniqueInput | HistoricalPriceWhereUniqueInput[]
  }

  export type StrategySignalCreateNestedManyWithoutSymbolInput = {
    create?: XOR<StrategySignalCreateWithoutSymbolInput, StrategySignalUncheckedCreateWithoutSymbolInput> | StrategySignalCreateWithoutSymbolInput[] | StrategySignalUncheckedCreateWithoutSymbolInput[]
    connectOrCreate?: StrategySignalCreateOrConnectWithoutSymbolInput | StrategySignalCreateOrConnectWithoutSymbolInput[]
    createMany?: StrategySignalCreateManySymbolInputEnvelope
    connect?: StrategySignalWhereUniqueInput | StrategySignalWhereUniqueInput[]
  }

  export type FundamentalMetricCreateNestedOneWithoutSymbolInput = {
    create?: XOR<FundamentalMetricCreateWithoutSymbolInput, FundamentalMetricUncheckedCreateWithoutSymbolInput>
    connectOrCreate?: FundamentalMetricCreateOrConnectWithoutSymbolInput
    connect?: FundamentalMetricWhereUniqueInput
  }

  export type HistoricalPriceUncheckedCreateNestedManyWithoutSymbolInput = {
    create?: XOR<HistoricalPriceCreateWithoutSymbolInput, HistoricalPriceUncheckedCreateWithoutSymbolInput> | HistoricalPriceCreateWithoutSymbolInput[] | HistoricalPriceUncheckedCreateWithoutSymbolInput[]
    connectOrCreate?: HistoricalPriceCreateOrConnectWithoutSymbolInput | HistoricalPriceCreateOrConnectWithoutSymbolInput[]
    createMany?: HistoricalPriceCreateManySymbolInputEnvelope
    connect?: HistoricalPriceWhereUniqueInput | HistoricalPriceWhereUniqueInput[]
  }

  export type StrategySignalUncheckedCreateNestedManyWithoutSymbolInput = {
    create?: XOR<StrategySignalCreateWithoutSymbolInput, StrategySignalUncheckedCreateWithoutSymbolInput> | StrategySignalCreateWithoutSymbolInput[] | StrategySignalUncheckedCreateWithoutSymbolInput[]
    connectOrCreate?: StrategySignalCreateOrConnectWithoutSymbolInput | StrategySignalCreateOrConnectWithoutSymbolInput[]
    createMany?: StrategySignalCreateManySymbolInputEnvelope
    connect?: StrategySignalWhereUniqueInput | StrategySignalWhereUniqueInput[]
  }

  export type FundamentalMetricUncheckedCreateNestedOneWithoutSymbolInput = {
    create?: XOR<FundamentalMetricCreateWithoutSymbolInput, FundamentalMetricUncheckedCreateWithoutSymbolInput>
    connectOrCreate?: FundamentalMetricCreateOrConnectWithoutSymbolInput
    connect?: FundamentalMetricWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type HistoricalPriceUpdateManyWithoutSymbolNestedInput = {
    create?: XOR<HistoricalPriceCreateWithoutSymbolInput, HistoricalPriceUncheckedCreateWithoutSymbolInput> | HistoricalPriceCreateWithoutSymbolInput[] | HistoricalPriceUncheckedCreateWithoutSymbolInput[]
    connectOrCreate?: HistoricalPriceCreateOrConnectWithoutSymbolInput | HistoricalPriceCreateOrConnectWithoutSymbolInput[]
    upsert?: HistoricalPriceUpsertWithWhereUniqueWithoutSymbolInput | HistoricalPriceUpsertWithWhereUniqueWithoutSymbolInput[]
    createMany?: HistoricalPriceCreateManySymbolInputEnvelope
    set?: HistoricalPriceWhereUniqueInput | HistoricalPriceWhereUniqueInput[]
    disconnect?: HistoricalPriceWhereUniqueInput | HistoricalPriceWhereUniqueInput[]
    delete?: HistoricalPriceWhereUniqueInput | HistoricalPriceWhereUniqueInput[]
    connect?: HistoricalPriceWhereUniqueInput | HistoricalPriceWhereUniqueInput[]
    update?: HistoricalPriceUpdateWithWhereUniqueWithoutSymbolInput | HistoricalPriceUpdateWithWhereUniqueWithoutSymbolInput[]
    updateMany?: HistoricalPriceUpdateManyWithWhereWithoutSymbolInput | HistoricalPriceUpdateManyWithWhereWithoutSymbolInput[]
    deleteMany?: HistoricalPriceScalarWhereInput | HistoricalPriceScalarWhereInput[]
  }

  export type StrategySignalUpdateManyWithoutSymbolNestedInput = {
    create?: XOR<StrategySignalCreateWithoutSymbolInput, StrategySignalUncheckedCreateWithoutSymbolInput> | StrategySignalCreateWithoutSymbolInput[] | StrategySignalUncheckedCreateWithoutSymbolInput[]
    connectOrCreate?: StrategySignalCreateOrConnectWithoutSymbolInput | StrategySignalCreateOrConnectWithoutSymbolInput[]
    upsert?: StrategySignalUpsertWithWhereUniqueWithoutSymbolInput | StrategySignalUpsertWithWhereUniqueWithoutSymbolInput[]
    createMany?: StrategySignalCreateManySymbolInputEnvelope
    set?: StrategySignalWhereUniqueInput | StrategySignalWhereUniqueInput[]
    disconnect?: StrategySignalWhereUniqueInput | StrategySignalWhereUniqueInput[]
    delete?: StrategySignalWhereUniqueInput | StrategySignalWhereUniqueInput[]
    connect?: StrategySignalWhereUniqueInput | StrategySignalWhereUniqueInput[]
    update?: StrategySignalUpdateWithWhereUniqueWithoutSymbolInput | StrategySignalUpdateWithWhereUniqueWithoutSymbolInput[]
    updateMany?: StrategySignalUpdateManyWithWhereWithoutSymbolInput | StrategySignalUpdateManyWithWhereWithoutSymbolInput[]
    deleteMany?: StrategySignalScalarWhereInput | StrategySignalScalarWhereInput[]
  }

  export type FundamentalMetricUpdateOneWithoutSymbolNestedInput = {
    create?: XOR<FundamentalMetricCreateWithoutSymbolInput, FundamentalMetricUncheckedCreateWithoutSymbolInput>
    connectOrCreate?: FundamentalMetricCreateOrConnectWithoutSymbolInput
    upsert?: FundamentalMetricUpsertWithoutSymbolInput
    disconnect?: FundamentalMetricWhereInput | boolean
    delete?: FundamentalMetricWhereInput | boolean
    connect?: FundamentalMetricWhereUniqueInput
    update?: XOR<XOR<FundamentalMetricUpdateToOneWithWhereWithoutSymbolInput, FundamentalMetricUpdateWithoutSymbolInput>, FundamentalMetricUncheckedUpdateWithoutSymbolInput>
  }

  export type HistoricalPriceUncheckedUpdateManyWithoutSymbolNestedInput = {
    create?: XOR<HistoricalPriceCreateWithoutSymbolInput, HistoricalPriceUncheckedCreateWithoutSymbolInput> | HistoricalPriceCreateWithoutSymbolInput[] | HistoricalPriceUncheckedCreateWithoutSymbolInput[]
    connectOrCreate?: HistoricalPriceCreateOrConnectWithoutSymbolInput | HistoricalPriceCreateOrConnectWithoutSymbolInput[]
    upsert?: HistoricalPriceUpsertWithWhereUniqueWithoutSymbolInput | HistoricalPriceUpsertWithWhereUniqueWithoutSymbolInput[]
    createMany?: HistoricalPriceCreateManySymbolInputEnvelope
    set?: HistoricalPriceWhereUniqueInput | HistoricalPriceWhereUniqueInput[]
    disconnect?: HistoricalPriceWhereUniqueInput | HistoricalPriceWhereUniqueInput[]
    delete?: HistoricalPriceWhereUniqueInput | HistoricalPriceWhereUniqueInput[]
    connect?: HistoricalPriceWhereUniqueInput | HistoricalPriceWhereUniqueInput[]
    update?: HistoricalPriceUpdateWithWhereUniqueWithoutSymbolInput | HistoricalPriceUpdateWithWhereUniqueWithoutSymbolInput[]
    updateMany?: HistoricalPriceUpdateManyWithWhereWithoutSymbolInput | HistoricalPriceUpdateManyWithWhereWithoutSymbolInput[]
    deleteMany?: HistoricalPriceScalarWhereInput | HistoricalPriceScalarWhereInput[]
  }

  export type StrategySignalUncheckedUpdateManyWithoutSymbolNestedInput = {
    create?: XOR<StrategySignalCreateWithoutSymbolInput, StrategySignalUncheckedCreateWithoutSymbolInput> | StrategySignalCreateWithoutSymbolInput[] | StrategySignalUncheckedCreateWithoutSymbolInput[]
    connectOrCreate?: StrategySignalCreateOrConnectWithoutSymbolInput | StrategySignalCreateOrConnectWithoutSymbolInput[]
    upsert?: StrategySignalUpsertWithWhereUniqueWithoutSymbolInput | StrategySignalUpsertWithWhereUniqueWithoutSymbolInput[]
    createMany?: StrategySignalCreateManySymbolInputEnvelope
    set?: StrategySignalWhereUniqueInput | StrategySignalWhereUniqueInput[]
    disconnect?: StrategySignalWhereUniqueInput | StrategySignalWhereUniqueInput[]
    delete?: StrategySignalWhereUniqueInput | StrategySignalWhereUniqueInput[]
    connect?: StrategySignalWhereUniqueInput | StrategySignalWhereUniqueInput[]
    update?: StrategySignalUpdateWithWhereUniqueWithoutSymbolInput | StrategySignalUpdateWithWhereUniqueWithoutSymbolInput[]
    updateMany?: StrategySignalUpdateManyWithWhereWithoutSymbolInput | StrategySignalUpdateManyWithWhereWithoutSymbolInput[]
    deleteMany?: StrategySignalScalarWhereInput | StrategySignalScalarWhereInput[]
  }

  export type FundamentalMetricUncheckedUpdateOneWithoutSymbolNestedInput = {
    create?: XOR<FundamentalMetricCreateWithoutSymbolInput, FundamentalMetricUncheckedCreateWithoutSymbolInput>
    connectOrCreate?: FundamentalMetricCreateOrConnectWithoutSymbolInput
    upsert?: FundamentalMetricUpsertWithoutSymbolInput
    disconnect?: FundamentalMetricWhereInput | boolean
    delete?: FundamentalMetricWhereInput | boolean
    connect?: FundamentalMetricWhereUniqueInput
    update?: XOR<XOR<FundamentalMetricUpdateToOneWithWhereWithoutSymbolInput, FundamentalMetricUpdateWithoutSymbolInput>, FundamentalMetricUncheckedUpdateWithoutSymbolInput>
  }

  export type SymbolCreateNestedOneWithoutPricesInput = {
    create?: XOR<SymbolCreateWithoutPricesInput, SymbolUncheckedCreateWithoutPricesInput>
    connectOrCreate?: SymbolCreateOrConnectWithoutPricesInput
    connect?: SymbolWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SymbolUpdateOneRequiredWithoutPricesNestedInput = {
    create?: XOR<SymbolCreateWithoutPricesInput, SymbolUncheckedCreateWithoutPricesInput>
    connectOrCreate?: SymbolCreateOrConnectWithoutPricesInput
    upsert?: SymbolUpsertWithoutPricesInput
    connect?: SymbolWhereUniqueInput
    update?: XOR<XOR<SymbolUpdateToOneWithWhereWithoutPricesInput, SymbolUpdateWithoutPricesInput>, SymbolUncheckedUpdateWithoutPricesInput>
  }

  export type SymbolCreateNestedOneWithoutSignalsInput = {
    create?: XOR<SymbolCreateWithoutSignalsInput, SymbolUncheckedCreateWithoutSignalsInput>
    connectOrCreate?: SymbolCreateOrConnectWithoutSignalsInput
    connect?: SymbolWhereUniqueInput
  }

  export type SymbolUpdateOneRequiredWithoutSignalsNestedInput = {
    create?: XOR<SymbolCreateWithoutSignalsInput, SymbolUncheckedCreateWithoutSignalsInput>
    connectOrCreate?: SymbolCreateOrConnectWithoutSignalsInput
    upsert?: SymbolUpsertWithoutSignalsInput
    connect?: SymbolWhereUniqueInput
    update?: XOR<XOR<SymbolUpdateToOneWithWhereWithoutSignalsInput, SymbolUpdateWithoutSignalsInput>, SymbolUncheckedUpdateWithoutSignalsInput>
  }

  export type SymbolCreateNestedOneWithoutMetricsInput = {
    create?: XOR<SymbolCreateWithoutMetricsInput, SymbolUncheckedCreateWithoutMetricsInput>
    connectOrCreate?: SymbolCreateOrConnectWithoutMetricsInput
    connect?: SymbolWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SymbolUpdateOneRequiredWithoutMetricsNestedInput = {
    create?: XOR<SymbolCreateWithoutMetricsInput, SymbolUncheckedCreateWithoutMetricsInput>
    connectOrCreate?: SymbolCreateOrConnectWithoutMetricsInput
    upsert?: SymbolUpsertWithoutMetricsInput
    connect?: SymbolWhereUniqueInput
    update?: XOR<XOR<SymbolUpdateToOneWithWhereWithoutMetricsInput, SymbolUpdateWithoutMetricsInput>, SymbolUncheckedUpdateWithoutMetricsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type HistoricalPriceCreateWithoutSymbolInput = {
    date: Date | string
    open: number
    high: number
    low: number
    close: number
    volume: number
  }

  export type HistoricalPriceUncheckedCreateWithoutSymbolInput = {
    date: Date | string
    open: number
    high: number
    low: number
    close: number
    volume: number
  }

  export type HistoricalPriceCreateOrConnectWithoutSymbolInput = {
    where: HistoricalPriceWhereUniqueInput
    create: XOR<HistoricalPriceCreateWithoutSymbolInput, HistoricalPriceUncheckedCreateWithoutSymbolInput>
  }

  export type HistoricalPriceCreateManySymbolInputEnvelope = {
    data: HistoricalPriceCreateManySymbolInput | HistoricalPriceCreateManySymbolInput[]
    skipDuplicates?: boolean
  }

  export type StrategySignalCreateWithoutSymbolInput = {
    id?: string
    strategyId: string
    signalValue: string
    price: number
    triggeredAt: Date | string
    updatedAt?: Date | string
  }

  export type StrategySignalUncheckedCreateWithoutSymbolInput = {
    id?: string
    strategyId: string
    signalValue: string
    price: number
    triggeredAt: Date | string
    updatedAt?: Date | string
  }

  export type StrategySignalCreateOrConnectWithoutSymbolInput = {
    where: StrategySignalWhereUniqueInput
    create: XOR<StrategySignalCreateWithoutSymbolInput, StrategySignalUncheckedCreateWithoutSymbolInput>
  }

  export type StrategySignalCreateManySymbolInputEnvelope = {
    data: StrategySignalCreateManySymbolInput | StrategySignalCreateManySymbolInput[]
    skipDuplicates?: boolean
  }

  export type FundamentalMetricCreateWithoutSymbolInput = {
    peRatio?: number | null
    forwardPe?: number | null
    priceToSales?: number | null
    evToEbitda?: number | null
    fcfYield?: number | null
    revGrowth?: number | null
    epsGrowth?: number | null
    updatedAt?: Date | string
  }

  export type FundamentalMetricUncheckedCreateWithoutSymbolInput = {
    peRatio?: number | null
    forwardPe?: number | null
    priceToSales?: number | null
    evToEbitda?: number | null
    fcfYield?: number | null
    revGrowth?: number | null
    epsGrowth?: number | null
    updatedAt?: Date | string
  }

  export type FundamentalMetricCreateOrConnectWithoutSymbolInput = {
    where: FundamentalMetricWhereUniqueInput
    create: XOR<FundamentalMetricCreateWithoutSymbolInput, FundamentalMetricUncheckedCreateWithoutSymbolInput>
  }

  export type HistoricalPriceUpsertWithWhereUniqueWithoutSymbolInput = {
    where: HistoricalPriceWhereUniqueInput
    update: XOR<HistoricalPriceUpdateWithoutSymbolInput, HistoricalPriceUncheckedUpdateWithoutSymbolInput>
    create: XOR<HistoricalPriceCreateWithoutSymbolInput, HistoricalPriceUncheckedCreateWithoutSymbolInput>
  }

  export type HistoricalPriceUpdateWithWhereUniqueWithoutSymbolInput = {
    where: HistoricalPriceWhereUniqueInput
    data: XOR<HistoricalPriceUpdateWithoutSymbolInput, HistoricalPriceUncheckedUpdateWithoutSymbolInput>
  }

  export type HistoricalPriceUpdateManyWithWhereWithoutSymbolInput = {
    where: HistoricalPriceScalarWhereInput
    data: XOR<HistoricalPriceUpdateManyMutationInput, HistoricalPriceUncheckedUpdateManyWithoutSymbolInput>
  }

  export type HistoricalPriceScalarWhereInput = {
    AND?: HistoricalPriceScalarWhereInput | HistoricalPriceScalarWhereInput[]
    OR?: HistoricalPriceScalarWhereInput[]
    NOT?: HistoricalPriceScalarWhereInput | HistoricalPriceScalarWhereInput[]
    symbolId?: StringFilter<"HistoricalPrice"> | string
    date?: DateTimeFilter<"HistoricalPrice"> | Date | string
    open?: FloatFilter<"HistoricalPrice"> | number
    high?: FloatFilter<"HistoricalPrice"> | number
    low?: FloatFilter<"HistoricalPrice"> | number
    close?: FloatFilter<"HistoricalPrice"> | number
    volume?: FloatFilter<"HistoricalPrice"> | number
  }

  export type StrategySignalUpsertWithWhereUniqueWithoutSymbolInput = {
    where: StrategySignalWhereUniqueInput
    update: XOR<StrategySignalUpdateWithoutSymbolInput, StrategySignalUncheckedUpdateWithoutSymbolInput>
    create: XOR<StrategySignalCreateWithoutSymbolInput, StrategySignalUncheckedCreateWithoutSymbolInput>
  }

  export type StrategySignalUpdateWithWhereUniqueWithoutSymbolInput = {
    where: StrategySignalWhereUniqueInput
    data: XOR<StrategySignalUpdateWithoutSymbolInput, StrategySignalUncheckedUpdateWithoutSymbolInput>
  }

  export type StrategySignalUpdateManyWithWhereWithoutSymbolInput = {
    where: StrategySignalScalarWhereInput
    data: XOR<StrategySignalUpdateManyMutationInput, StrategySignalUncheckedUpdateManyWithoutSymbolInput>
  }

  export type StrategySignalScalarWhereInput = {
    AND?: StrategySignalScalarWhereInput | StrategySignalScalarWhereInput[]
    OR?: StrategySignalScalarWhereInput[]
    NOT?: StrategySignalScalarWhereInput | StrategySignalScalarWhereInput[]
    id?: StringFilter<"StrategySignal"> | string
    symbolId?: StringFilter<"StrategySignal"> | string
    strategyId?: StringFilter<"StrategySignal"> | string
    signalValue?: StringFilter<"StrategySignal"> | string
    price?: FloatFilter<"StrategySignal"> | number
    triggeredAt?: DateTimeFilter<"StrategySignal"> | Date | string
    updatedAt?: DateTimeFilter<"StrategySignal"> | Date | string
  }

  export type FundamentalMetricUpsertWithoutSymbolInput = {
    update: XOR<FundamentalMetricUpdateWithoutSymbolInput, FundamentalMetricUncheckedUpdateWithoutSymbolInput>
    create: XOR<FundamentalMetricCreateWithoutSymbolInput, FundamentalMetricUncheckedCreateWithoutSymbolInput>
    where?: FundamentalMetricWhereInput
  }

  export type FundamentalMetricUpdateToOneWithWhereWithoutSymbolInput = {
    where?: FundamentalMetricWhereInput
    data: XOR<FundamentalMetricUpdateWithoutSymbolInput, FundamentalMetricUncheckedUpdateWithoutSymbolInput>
  }

  export type FundamentalMetricUpdateWithoutSymbolInput = {
    peRatio?: NullableFloatFieldUpdateOperationsInput | number | null
    forwardPe?: NullableFloatFieldUpdateOperationsInput | number | null
    priceToSales?: NullableFloatFieldUpdateOperationsInput | number | null
    evToEbitda?: NullableFloatFieldUpdateOperationsInput | number | null
    fcfYield?: NullableFloatFieldUpdateOperationsInput | number | null
    revGrowth?: NullableFloatFieldUpdateOperationsInput | number | null
    epsGrowth?: NullableFloatFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FundamentalMetricUncheckedUpdateWithoutSymbolInput = {
    peRatio?: NullableFloatFieldUpdateOperationsInput | number | null
    forwardPe?: NullableFloatFieldUpdateOperationsInput | number | null
    priceToSales?: NullableFloatFieldUpdateOperationsInput | number | null
    evToEbitda?: NullableFloatFieldUpdateOperationsInput | number | null
    fcfYield?: NullableFloatFieldUpdateOperationsInput | number | null
    revGrowth?: NullableFloatFieldUpdateOperationsInput | number | null
    epsGrowth?: NullableFloatFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SymbolCreateWithoutPricesInput = {
    id: string
    sector?: string | null
    industry?: string | null
    name?: string | null
    updatedAt?: Date | string
    signals?: StrategySignalCreateNestedManyWithoutSymbolInput
    metrics?: FundamentalMetricCreateNestedOneWithoutSymbolInput
  }

  export type SymbolUncheckedCreateWithoutPricesInput = {
    id: string
    sector?: string | null
    industry?: string | null
    name?: string | null
    updatedAt?: Date | string
    signals?: StrategySignalUncheckedCreateNestedManyWithoutSymbolInput
    metrics?: FundamentalMetricUncheckedCreateNestedOneWithoutSymbolInput
  }

  export type SymbolCreateOrConnectWithoutPricesInput = {
    where: SymbolWhereUniqueInput
    create: XOR<SymbolCreateWithoutPricesInput, SymbolUncheckedCreateWithoutPricesInput>
  }

  export type SymbolUpsertWithoutPricesInput = {
    update: XOR<SymbolUpdateWithoutPricesInput, SymbolUncheckedUpdateWithoutPricesInput>
    create: XOR<SymbolCreateWithoutPricesInput, SymbolUncheckedCreateWithoutPricesInput>
    where?: SymbolWhereInput
  }

  export type SymbolUpdateToOneWithWhereWithoutPricesInput = {
    where?: SymbolWhereInput
    data: XOR<SymbolUpdateWithoutPricesInput, SymbolUncheckedUpdateWithoutPricesInput>
  }

  export type SymbolUpdateWithoutPricesInput = {
    id?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signals?: StrategySignalUpdateManyWithoutSymbolNestedInput
    metrics?: FundamentalMetricUpdateOneWithoutSymbolNestedInput
  }

  export type SymbolUncheckedUpdateWithoutPricesInput = {
    id?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    signals?: StrategySignalUncheckedUpdateManyWithoutSymbolNestedInput
    metrics?: FundamentalMetricUncheckedUpdateOneWithoutSymbolNestedInput
  }

  export type SymbolCreateWithoutSignalsInput = {
    id: string
    sector?: string | null
    industry?: string | null
    name?: string | null
    updatedAt?: Date | string
    prices?: HistoricalPriceCreateNestedManyWithoutSymbolInput
    metrics?: FundamentalMetricCreateNestedOneWithoutSymbolInput
  }

  export type SymbolUncheckedCreateWithoutSignalsInput = {
    id: string
    sector?: string | null
    industry?: string | null
    name?: string | null
    updatedAt?: Date | string
    prices?: HistoricalPriceUncheckedCreateNestedManyWithoutSymbolInput
    metrics?: FundamentalMetricUncheckedCreateNestedOneWithoutSymbolInput
  }

  export type SymbolCreateOrConnectWithoutSignalsInput = {
    where: SymbolWhereUniqueInput
    create: XOR<SymbolCreateWithoutSignalsInput, SymbolUncheckedCreateWithoutSignalsInput>
  }

  export type SymbolUpsertWithoutSignalsInput = {
    update: XOR<SymbolUpdateWithoutSignalsInput, SymbolUncheckedUpdateWithoutSignalsInput>
    create: XOR<SymbolCreateWithoutSignalsInput, SymbolUncheckedCreateWithoutSignalsInput>
    where?: SymbolWhereInput
  }

  export type SymbolUpdateToOneWithWhereWithoutSignalsInput = {
    where?: SymbolWhereInput
    data: XOR<SymbolUpdateWithoutSignalsInput, SymbolUncheckedUpdateWithoutSignalsInput>
  }

  export type SymbolUpdateWithoutSignalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prices?: HistoricalPriceUpdateManyWithoutSymbolNestedInput
    metrics?: FundamentalMetricUpdateOneWithoutSymbolNestedInput
  }

  export type SymbolUncheckedUpdateWithoutSignalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prices?: HistoricalPriceUncheckedUpdateManyWithoutSymbolNestedInput
    metrics?: FundamentalMetricUncheckedUpdateOneWithoutSymbolNestedInput
  }

  export type SymbolCreateWithoutMetricsInput = {
    id: string
    sector?: string | null
    industry?: string | null
    name?: string | null
    updatedAt?: Date | string
    prices?: HistoricalPriceCreateNestedManyWithoutSymbolInput
    signals?: StrategySignalCreateNestedManyWithoutSymbolInput
  }

  export type SymbolUncheckedCreateWithoutMetricsInput = {
    id: string
    sector?: string | null
    industry?: string | null
    name?: string | null
    updatedAt?: Date | string
    prices?: HistoricalPriceUncheckedCreateNestedManyWithoutSymbolInput
    signals?: StrategySignalUncheckedCreateNestedManyWithoutSymbolInput
  }

  export type SymbolCreateOrConnectWithoutMetricsInput = {
    where: SymbolWhereUniqueInput
    create: XOR<SymbolCreateWithoutMetricsInput, SymbolUncheckedCreateWithoutMetricsInput>
  }

  export type SymbolUpsertWithoutMetricsInput = {
    update: XOR<SymbolUpdateWithoutMetricsInput, SymbolUncheckedUpdateWithoutMetricsInput>
    create: XOR<SymbolCreateWithoutMetricsInput, SymbolUncheckedCreateWithoutMetricsInput>
    where?: SymbolWhereInput
  }

  export type SymbolUpdateToOneWithWhereWithoutMetricsInput = {
    where?: SymbolWhereInput
    data: XOR<SymbolUpdateWithoutMetricsInput, SymbolUncheckedUpdateWithoutMetricsInput>
  }

  export type SymbolUpdateWithoutMetricsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prices?: HistoricalPriceUpdateManyWithoutSymbolNestedInput
    signals?: StrategySignalUpdateManyWithoutSymbolNestedInput
  }

  export type SymbolUncheckedUpdateWithoutMetricsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sector?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prices?: HistoricalPriceUncheckedUpdateManyWithoutSymbolNestedInput
    signals?: StrategySignalUncheckedUpdateManyWithoutSymbolNestedInput
  }

  export type HistoricalPriceCreateManySymbolInput = {
    date: Date | string
    open: number
    high: number
    low: number
    close: number
    volume: number
  }

  export type StrategySignalCreateManySymbolInput = {
    id?: string
    strategyId: string
    signalValue: string
    price: number
    triggeredAt: Date | string
    updatedAt?: Date | string
  }

  export type HistoricalPriceUpdateWithoutSymbolInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: FloatFieldUpdateOperationsInput | number
    high?: FloatFieldUpdateOperationsInput | number
    low?: FloatFieldUpdateOperationsInput | number
    close?: FloatFieldUpdateOperationsInput | number
    volume?: FloatFieldUpdateOperationsInput | number
  }

  export type HistoricalPriceUncheckedUpdateWithoutSymbolInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: FloatFieldUpdateOperationsInput | number
    high?: FloatFieldUpdateOperationsInput | number
    low?: FloatFieldUpdateOperationsInput | number
    close?: FloatFieldUpdateOperationsInput | number
    volume?: FloatFieldUpdateOperationsInput | number
  }

  export type HistoricalPriceUncheckedUpdateManyWithoutSymbolInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: FloatFieldUpdateOperationsInput | number
    high?: FloatFieldUpdateOperationsInput | number
    low?: FloatFieldUpdateOperationsInput | number
    close?: FloatFieldUpdateOperationsInput | number
    volume?: FloatFieldUpdateOperationsInput | number
  }

  export type StrategySignalUpdateWithoutSymbolInput = {
    id?: StringFieldUpdateOperationsInput | string
    strategyId?: StringFieldUpdateOperationsInput | string
    signalValue?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    triggeredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StrategySignalUncheckedUpdateWithoutSymbolInput = {
    id?: StringFieldUpdateOperationsInput | string
    strategyId?: StringFieldUpdateOperationsInput | string
    signalValue?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    triggeredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StrategySignalUncheckedUpdateManyWithoutSymbolInput = {
    id?: StringFieldUpdateOperationsInput | string
    strategyId?: StringFieldUpdateOperationsInput | string
    signalValue?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    triggeredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}