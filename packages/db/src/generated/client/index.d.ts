
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
 * Model TradingSession
 * 
 */
export type TradingSession = $Result.DefaultSelection<Prisma.$TradingSessionPayload>
/**
 * Model TradingAccount
 * 
 */
export type TradingAccount = $Result.DefaultSelection<Prisma.$TradingAccountPayload>
/**
 * Model TradingOrder
 * 
 */
export type TradingOrder = $Result.DefaultSelection<Prisma.$TradingOrderPayload>
/**
 * Model TradingPosition
 * 
 */
export type TradingPosition = $Result.DefaultSelection<Prisma.$TradingPositionPayload>
/**
 * Model SystemSetting
 * 
 */
export type SystemSetting = $Result.DefaultSelection<Prisma.$SystemSettingPayload>
/**
 * Model CustomStrategy
 * 
 */
export type CustomStrategy = $Result.DefaultSelection<Prisma.$CustomStrategyPayload>
/**
 * Model TradingBot
 * 
 */
export type TradingBot = $Result.DefaultSelection<Prisma.$TradingBotPayload>
/**
 * Model AllocationSession
 * 
 */
export type AllocationSession = $Result.DefaultSelection<Prisma.$AllocationSessionPayload>

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

  /**
   * `prisma.tradingSession`: Exposes CRUD operations for the **TradingSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TradingSessions
    * const tradingSessions = await prisma.tradingSession.findMany()
    * ```
    */
  get tradingSession(): Prisma.TradingSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tradingAccount`: Exposes CRUD operations for the **TradingAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TradingAccounts
    * const tradingAccounts = await prisma.tradingAccount.findMany()
    * ```
    */
  get tradingAccount(): Prisma.TradingAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tradingOrder`: Exposes CRUD operations for the **TradingOrder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TradingOrders
    * const tradingOrders = await prisma.tradingOrder.findMany()
    * ```
    */
  get tradingOrder(): Prisma.TradingOrderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tradingPosition`: Exposes CRUD operations for the **TradingPosition** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TradingPositions
    * const tradingPositions = await prisma.tradingPosition.findMany()
    * ```
    */
  get tradingPosition(): Prisma.TradingPositionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.systemSetting`: Exposes CRUD operations for the **SystemSetting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SystemSettings
    * const systemSettings = await prisma.systemSetting.findMany()
    * ```
    */
  get systemSetting(): Prisma.SystemSettingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.customStrategy`: Exposes CRUD operations for the **CustomStrategy** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CustomStrategies
    * const customStrategies = await prisma.customStrategy.findMany()
    * ```
    */
  get customStrategy(): Prisma.CustomStrategyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tradingBot`: Exposes CRUD operations for the **TradingBot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TradingBots
    * const tradingBots = await prisma.tradingBot.findMany()
    * ```
    */
  get tradingBot(): Prisma.TradingBotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.allocationSession`: Exposes CRUD operations for the **AllocationSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AllocationSessions
    * const allocationSessions = await prisma.allocationSession.findMany()
    * ```
    */
  get allocationSession(): Prisma.AllocationSessionDelegate<ExtArgs, ClientOptions>;
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
    FundamentalMetric: 'FundamentalMetric',
    TradingSession: 'TradingSession',
    TradingAccount: 'TradingAccount',
    TradingOrder: 'TradingOrder',
    TradingPosition: 'TradingPosition',
    SystemSetting: 'SystemSetting',
    CustomStrategy: 'CustomStrategy',
    TradingBot: 'TradingBot',
    AllocationSession: 'AllocationSession'
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
      modelProps: "symbol" | "historicalPrice" | "strategySignal" | "fundamentalMetric" | "tradingSession" | "tradingAccount" | "tradingOrder" | "tradingPosition" | "systemSetting" | "customStrategy" | "tradingBot" | "allocationSession"
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
      TradingSession: {
        payload: Prisma.$TradingSessionPayload<ExtArgs>
        fields: Prisma.TradingSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TradingSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TradingSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingSessionPayload>
          }
          findFirst: {
            args: Prisma.TradingSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TradingSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingSessionPayload>
          }
          findMany: {
            args: Prisma.TradingSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingSessionPayload>[]
          }
          create: {
            args: Prisma.TradingSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingSessionPayload>
          }
          createMany: {
            args: Prisma.TradingSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TradingSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingSessionPayload>[]
          }
          delete: {
            args: Prisma.TradingSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingSessionPayload>
          }
          update: {
            args: Prisma.TradingSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingSessionPayload>
          }
          deleteMany: {
            args: Prisma.TradingSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TradingSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TradingSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingSessionPayload>[]
          }
          upsert: {
            args: Prisma.TradingSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingSessionPayload>
          }
          aggregate: {
            args: Prisma.TradingSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTradingSession>
          }
          groupBy: {
            args: Prisma.TradingSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TradingSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TradingSessionCountArgs<ExtArgs>
            result: $Utils.Optional<TradingSessionCountAggregateOutputType> | number
          }
        }
      }
      TradingAccount: {
        payload: Prisma.$TradingAccountPayload<ExtArgs>
        fields: Prisma.TradingAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TradingAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TradingAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload>
          }
          findFirst: {
            args: Prisma.TradingAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TradingAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload>
          }
          findMany: {
            args: Prisma.TradingAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload>[]
          }
          create: {
            args: Prisma.TradingAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload>
          }
          createMany: {
            args: Prisma.TradingAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TradingAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload>[]
          }
          delete: {
            args: Prisma.TradingAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload>
          }
          update: {
            args: Prisma.TradingAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload>
          }
          deleteMany: {
            args: Prisma.TradingAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TradingAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TradingAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload>[]
          }
          upsert: {
            args: Prisma.TradingAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingAccountPayload>
          }
          aggregate: {
            args: Prisma.TradingAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTradingAccount>
          }
          groupBy: {
            args: Prisma.TradingAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<TradingAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.TradingAccountCountArgs<ExtArgs>
            result: $Utils.Optional<TradingAccountCountAggregateOutputType> | number
          }
        }
      }
      TradingOrder: {
        payload: Prisma.$TradingOrderPayload<ExtArgs>
        fields: Prisma.TradingOrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TradingOrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingOrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TradingOrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingOrderPayload>
          }
          findFirst: {
            args: Prisma.TradingOrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingOrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TradingOrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingOrderPayload>
          }
          findMany: {
            args: Prisma.TradingOrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingOrderPayload>[]
          }
          create: {
            args: Prisma.TradingOrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingOrderPayload>
          }
          createMany: {
            args: Prisma.TradingOrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TradingOrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingOrderPayload>[]
          }
          delete: {
            args: Prisma.TradingOrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingOrderPayload>
          }
          update: {
            args: Prisma.TradingOrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingOrderPayload>
          }
          deleteMany: {
            args: Prisma.TradingOrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TradingOrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TradingOrderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingOrderPayload>[]
          }
          upsert: {
            args: Prisma.TradingOrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingOrderPayload>
          }
          aggregate: {
            args: Prisma.TradingOrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTradingOrder>
          }
          groupBy: {
            args: Prisma.TradingOrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<TradingOrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.TradingOrderCountArgs<ExtArgs>
            result: $Utils.Optional<TradingOrderCountAggregateOutputType> | number
          }
        }
      }
      TradingPosition: {
        payload: Prisma.$TradingPositionPayload<ExtArgs>
        fields: Prisma.TradingPositionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TradingPositionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TradingPositionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>
          }
          findFirst: {
            args: Prisma.TradingPositionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TradingPositionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>
          }
          findMany: {
            args: Prisma.TradingPositionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>[]
          }
          create: {
            args: Prisma.TradingPositionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>
          }
          createMany: {
            args: Prisma.TradingPositionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TradingPositionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>[]
          }
          delete: {
            args: Prisma.TradingPositionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>
          }
          update: {
            args: Prisma.TradingPositionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>
          }
          deleteMany: {
            args: Prisma.TradingPositionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TradingPositionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TradingPositionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>[]
          }
          upsert: {
            args: Prisma.TradingPositionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>
          }
          aggregate: {
            args: Prisma.TradingPositionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTradingPosition>
          }
          groupBy: {
            args: Prisma.TradingPositionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TradingPositionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TradingPositionCountArgs<ExtArgs>
            result: $Utils.Optional<TradingPositionCountAggregateOutputType> | number
          }
        }
      }
      SystemSetting: {
        payload: Prisma.$SystemSettingPayload<ExtArgs>
        fields: Prisma.SystemSettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SystemSettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SystemSettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload>
          }
          findFirst: {
            args: Prisma.SystemSettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SystemSettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload>
          }
          findMany: {
            args: Prisma.SystemSettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload>[]
          }
          create: {
            args: Prisma.SystemSettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload>
          }
          createMany: {
            args: Prisma.SystemSettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SystemSettingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload>[]
          }
          delete: {
            args: Prisma.SystemSettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload>
          }
          update: {
            args: Prisma.SystemSettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload>
          }
          deleteMany: {
            args: Prisma.SystemSettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SystemSettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SystemSettingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload>[]
          }
          upsert: {
            args: Prisma.SystemSettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingPayload>
          }
          aggregate: {
            args: Prisma.SystemSettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystemSetting>
          }
          groupBy: {
            args: Prisma.SystemSettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<SystemSettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.SystemSettingCountArgs<ExtArgs>
            result: $Utils.Optional<SystemSettingCountAggregateOutputType> | number
          }
        }
      }
      CustomStrategy: {
        payload: Prisma.$CustomStrategyPayload<ExtArgs>
        fields: Prisma.CustomStrategyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomStrategyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomStrategyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomStrategyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomStrategyPayload>
          }
          findFirst: {
            args: Prisma.CustomStrategyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomStrategyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomStrategyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomStrategyPayload>
          }
          findMany: {
            args: Prisma.CustomStrategyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomStrategyPayload>[]
          }
          create: {
            args: Prisma.CustomStrategyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomStrategyPayload>
          }
          createMany: {
            args: Prisma.CustomStrategyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomStrategyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomStrategyPayload>[]
          }
          delete: {
            args: Prisma.CustomStrategyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomStrategyPayload>
          }
          update: {
            args: Prisma.CustomStrategyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomStrategyPayload>
          }
          deleteMany: {
            args: Prisma.CustomStrategyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomStrategyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CustomStrategyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomStrategyPayload>[]
          }
          upsert: {
            args: Prisma.CustomStrategyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomStrategyPayload>
          }
          aggregate: {
            args: Prisma.CustomStrategyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomStrategy>
          }
          groupBy: {
            args: Prisma.CustomStrategyGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomStrategyGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomStrategyCountArgs<ExtArgs>
            result: $Utils.Optional<CustomStrategyCountAggregateOutputType> | number
          }
        }
      }
      TradingBot: {
        payload: Prisma.$TradingBotPayload<ExtArgs>
        fields: Prisma.TradingBotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TradingBotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingBotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TradingBotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingBotPayload>
          }
          findFirst: {
            args: Prisma.TradingBotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingBotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TradingBotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingBotPayload>
          }
          findMany: {
            args: Prisma.TradingBotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingBotPayload>[]
          }
          create: {
            args: Prisma.TradingBotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingBotPayload>
          }
          createMany: {
            args: Prisma.TradingBotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TradingBotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingBotPayload>[]
          }
          delete: {
            args: Prisma.TradingBotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingBotPayload>
          }
          update: {
            args: Prisma.TradingBotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingBotPayload>
          }
          deleteMany: {
            args: Prisma.TradingBotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TradingBotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TradingBotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingBotPayload>[]
          }
          upsert: {
            args: Prisma.TradingBotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingBotPayload>
          }
          aggregate: {
            args: Prisma.TradingBotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTradingBot>
          }
          groupBy: {
            args: Prisma.TradingBotGroupByArgs<ExtArgs>
            result: $Utils.Optional<TradingBotGroupByOutputType>[]
          }
          count: {
            args: Prisma.TradingBotCountArgs<ExtArgs>
            result: $Utils.Optional<TradingBotCountAggregateOutputType> | number
          }
        }
      }
      AllocationSession: {
        payload: Prisma.$AllocationSessionPayload<ExtArgs>
        fields: Prisma.AllocationSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AllocationSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllocationSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AllocationSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllocationSessionPayload>
          }
          findFirst: {
            args: Prisma.AllocationSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllocationSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AllocationSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllocationSessionPayload>
          }
          findMany: {
            args: Prisma.AllocationSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllocationSessionPayload>[]
          }
          create: {
            args: Prisma.AllocationSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllocationSessionPayload>
          }
          createMany: {
            args: Prisma.AllocationSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AllocationSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllocationSessionPayload>[]
          }
          delete: {
            args: Prisma.AllocationSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllocationSessionPayload>
          }
          update: {
            args: Prisma.AllocationSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllocationSessionPayload>
          }
          deleteMany: {
            args: Prisma.AllocationSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AllocationSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AllocationSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllocationSessionPayload>[]
          }
          upsert: {
            args: Prisma.AllocationSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllocationSessionPayload>
          }
          aggregate: {
            args: Prisma.AllocationSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAllocationSession>
          }
          groupBy: {
            args: Prisma.AllocationSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<AllocationSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.AllocationSessionCountArgs<ExtArgs>
            result: $Utils.Optional<AllocationSessionCountAggregateOutputType> | number
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
    tradingSession?: TradingSessionOmit
    tradingAccount?: TradingAccountOmit
    tradingOrder?: TradingOrderOmit
    tradingPosition?: TradingPositionOmit
    systemSetting?: SystemSettingOmit
    customStrategy?: CustomStrategyOmit
    tradingBot?: TradingBotOmit
    allocationSession?: AllocationSessionOmit
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
   * Count Type TradingAccountCountOutputType
   */

  export type TradingAccountCountOutputType = {
    orders: number
    positions: number
  }

  export type TradingAccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | TradingAccountCountOutputTypeCountOrdersArgs
    positions?: boolean | TradingAccountCountOutputTypeCountPositionsArgs
  }

  // Custom InputTypes
  /**
   * TradingAccountCountOutputType without action
   */
  export type TradingAccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccountCountOutputType
     */
    select?: TradingAccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TradingAccountCountOutputType without action
   */
  export type TradingAccountCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradingOrderWhereInput
  }

  /**
   * TradingAccountCountOutputType without action
   */
  export type TradingAccountCountOutputTypeCountPositionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradingPositionWhereInput
  }


  /**
   * Count Type CustomStrategyCountOutputType
   */

  export type CustomStrategyCountOutputType = {
    bots: number
  }

  export type CustomStrategyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bots?: boolean | CustomStrategyCountOutputTypeCountBotsArgs
  }

  // Custom InputTypes
  /**
   * CustomStrategyCountOutputType without action
   */
  export type CustomStrategyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomStrategyCountOutputType
     */
    select?: CustomStrategyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomStrategyCountOutputType without action
   */
  export type CustomStrategyCountOutputTypeCountBotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradingBotWhereInput
  }


  /**
   * Count Type AllocationSessionCountOutputType
   */

  export type AllocationSessionCountOutputType = {
    bots: number
  }

  export type AllocationSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bots?: boolean | AllocationSessionCountOutputTypeCountBotsArgs
  }

  // Custom InputTypes
  /**
   * AllocationSessionCountOutputType without action
   */
  export type AllocationSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllocationSessionCountOutputType
     */
    select?: AllocationSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AllocationSessionCountOutputType without action
   */
  export type AllocationSessionCountOutputTypeCountBotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradingBotWhereInput
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
    interval: string | null
  }

  export type HistoricalPriceMaxAggregateOutputType = {
    symbolId: string | null
    date: Date | null
    open: number | null
    high: number | null
    low: number | null
    close: number | null
    volume: number | null
    interval: string | null
  }

  export type HistoricalPriceCountAggregateOutputType = {
    symbolId: number
    date: number
    open: number
    high: number
    low: number
    close: number
    volume: number
    interval: number
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
    interval?: true
  }

  export type HistoricalPriceMaxAggregateInputType = {
    symbolId?: true
    date?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
    interval?: true
  }

  export type HistoricalPriceCountAggregateInputType = {
    symbolId?: true
    date?: true
    open?: true
    high?: true
    low?: true
    close?: true
    volume?: true
    interval?: true
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
    interval: string
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
    interval?: boolean
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
    interval?: boolean
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
    interval?: boolean
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
    interval?: boolean
  }

  export type HistoricalPriceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"symbolId" | "date" | "open" | "high" | "low" | "close" | "volume" | "interval", ExtArgs["result"]["historicalPrice"]>
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
      interval: string
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
    readonly interval: FieldRef<"HistoricalPrice", 'String'>
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
   * Model TradingSession
   */

  export type AggregateTradingSession = {
    _count: TradingSessionCountAggregateOutputType | null
    _min: TradingSessionMinAggregateOutputType | null
    _max: TradingSessionMaxAggregateOutputType | null
  }

  export type TradingSessionMinAggregateOutputType = {
    id: string | null
    provider: string | null
    accessToken: string | null
    publicToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TradingSessionMaxAggregateOutputType = {
    id: string | null
    provider: string | null
    accessToken: string | null
    publicToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TradingSessionCountAggregateOutputType = {
    id: number
    provider: number
    accessToken: number
    publicToken: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TradingSessionMinAggregateInputType = {
    id?: true
    provider?: true
    accessToken?: true
    publicToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TradingSessionMaxAggregateInputType = {
    id?: true
    provider?: true
    accessToken?: true
    publicToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TradingSessionCountAggregateInputType = {
    id?: true
    provider?: true
    accessToken?: true
    publicToken?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TradingSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradingSession to aggregate.
     */
    where?: TradingSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingSessions to fetch.
     */
    orderBy?: TradingSessionOrderByWithRelationInput | TradingSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TradingSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TradingSessions
    **/
    _count?: true | TradingSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TradingSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TradingSessionMaxAggregateInputType
  }

  export type GetTradingSessionAggregateType<T extends TradingSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateTradingSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTradingSession[P]>
      : GetScalarType<T[P], AggregateTradingSession[P]>
  }




  export type TradingSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradingSessionWhereInput
    orderBy?: TradingSessionOrderByWithAggregationInput | TradingSessionOrderByWithAggregationInput[]
    by: TradingSessionScalarFieldEnum[] | TradingSessionScalarFieldEnum
    having?: TradingSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TradingSessionCountAggregateInputType | true
    _min?: TradingSessionMinAggregateInputType
    _max?: TradingSessionMaxAggregateInputType
  }

  export type TradingSessionGroupByOutputType = {
    id: string
    provider: string
    accessToken: string
    publicToken: string | null
    createdAt: Date
    updatedAt: Date
    _count: TradingSessionCountAggregateOutputType | null
    _min: TradingSessionMinAggregateOutputType | null
    _max: TradingSessionMaxAggregateOutputType | null
  }

  type GetTradingSessionGroupByPayload<T extends TradingSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradingSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TradingSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TradingSessionGroupByOutputType[P]>
            : GetScalarType<T[P], TradingSessionGroupByOutputType[P]>
        }
      >
    >


  export type TradingSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    provider?: boolean
    accessToken?: boolean
    publicToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tradingSession"]>

  export type TradingSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    provider?: boolean
    accessToken?: boolean
    publicToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tradingSession"]>

  export type TradingSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    provider?: boolean
    accessToken?: boolean
    publicToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tradingSession"]>

  export type TradingSessionSelectScalar = {
    id?: boolean
    provider?: boolean
    accessToken?: boolean
    publicToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TradingSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "provider" | "accessToken" | "publicToken" | "createdAt" | "updatedAt", ExtArgs["result"]["tradingSession"]>

  export type $TradingSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TradingSession"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      provider: string
      accessToken: string
      publicToken: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tradingSession"]>
    composites: {}
  }

  type TradingSessionGetPayload<S extends boolean | null | undefined | TradingSessionDefaultArgs> = $Result.GetResult<Prisma.$TradingSessionPayload, S>

  type TradingSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TradingSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TradingSessionCountAggregateInputType | true
    }

  export interface TradingSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TradingSession'], meta: { name: 'TradingSession' } }
    /**
     * Find zero or one TradingSession that matches the filter.
     * @param {TradingSessionFindUniqueArgs} args - Arguments to find a TradingSession
     * @example
     * // Get one TradingSession
     * const tradingSession = await prisma.tradingSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TradingSessionFindUniqueArgs>(args: SelectSubset<T, TradingSessionFindUniqueArgs<ExtArgs>>): Prisma__TradingSessionClient<$Result.GetResult<Prisma.$TradingSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TradingSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TradingSessionFindUniqueOrThrowArgs} args - Arguments to find a TradingSession
     * @example
     * // Get one TradingSession
     * const tradingSession = await prisma.tradingSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TradingSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, TradingSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TradingSessionClient<$Result.GetResult<Prisma.$TradingSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradingSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingSessionFindFirstArgs} args - Arguments to find a TradingSession
     * @example
     * // Get one TradingSession
     * const tradingSession = await prisma.tradingSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TradingSessionFindFirstArgs>(args?: SelectSubset<T, TradingSessionFindFirstArgs<ExtArgs>>): Prisma__TradingSessionClient<$Result.GetResult<Prisma.$TradingSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradingSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingSessionFindFirstOrThrowArgs} args - Arguments to find a TradingSession
     * @example
     * // Get one TradingSession
     * const tradingSession = await prisma.tradingSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TradingSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, TradingSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TradingSessionClient<$Result.GetResult<Prisma.$TradingSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TradingSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TradingSessions
     * const tradingSessions = await prisma.tradingSession.findMany()
     * 
     * // Get first 10 TradingSessions
     * const tradingSessions = await prisma.tradingSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tradingSessionWithIdOnly = await prisma.tradingSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TradingSessionFindManyArgs>(args?: SelectSubset<T, TradingSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TradingSession.
     * @param {TradingSessionCreateArgs} args - Arguments to create a TradingSession.
     * @example
     * // Create one TradingSession
     * const TradingSession = await prisma.tradingSession.create({
     *   data: {
     *     // ... data to create a TradingSession
     *   }
     * })
     * 
     */
    create<T extends TradingSessionCreateArgs>(args: SelectSubset<T, TradingSessionCreateArgs<ExtArgs>>): Prisma__TradingSessionClient<$Result.GetResult<Prisma.$TradingSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TradingSessions.
     * @param {TradingSessionCreateManyArgs} args - Arguments to create many TradingSessions.
     * @example
     * // Create many TradingSessions
     * const tradingSession = await prisma.tradingSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TradingSessionCreateManyArgs>(args?: SelectSubset<T, TradingSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TradingSessions and returns the data saved in the database.
     * @param {TradingSessionCreateManyAndReturnArgs} args - Arguments to create many TradingSessions.
     * @example
     * // Create many TradingSessions
     * const tradingSession = await prisma.tradingSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TradingSessions and only return the `id`
     * const tradingSessionWithIdOnly = await prisma.tradingSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TradingSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, TradingSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TradingSession.
     * @param {TradingSessionDeleteArgs} args - Arguments to delete one TradingSession.
     * @example
     * // Delete one TradingSession
     * const TradingSession = await prisma.tradingSession.delete({
     *   where: {
     *     // ... filter to delete one TradingSession
     *   }
     * })
     * 
     */
    delete<T extends TradingSessionDeleteArgs>(args: SelectSubset<T, TradingSessionDeleteArgs<ExtArgs>>): Prisma__TradingSessionClient<$Result.GetResult<Prisma.$TradingSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TradingSession.
     * @param {TradingSessionUpdateArgs} args - Arguments to update one TradingSession.
     * @example
     * // Update one TradingSession
     * const tradingSession = await prisma.tradingSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TradingSessionUpdateArgs>(args: SelectSubset<T, TradingSessionUpdateArgs<ExtArgs>>): Prisma__TradingSessionClient<$Result.GetResult<Prisma.$TradingSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TradingSessions.
     * @param {TradingSessionDeleteManyArgs} args - Arguments to filter TradingSessions to delete.
     * @example
     * // Delete a few TradingSessions
     * const { count } = await prisma.tradingSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TradingSessionDeleteManyArgs>(args?: SelectSubset<T, TradingSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradingSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TradingSessions
     * const tradingSession = await prisma.tradingSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TradingSessionUpdateManyArgs>(args: SelectSubset<T, TradingSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradingSessions and returns the data updated in the database.
     * @param {TradingSessionUpdateManyAndReturnArgs} args - Arguments to update many TradingSessions.
     * @example
     * // Update many TradingSessions
     * const tradingSession = await prisma.tradingSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TradingSessions and only return the `id`
     * const tradingSessionWithIdOnly = await prisma.tradingSession.updateManyAndReturn({
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
    updateManyAndReturn<T extends TradingSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, TradingSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TradingSession.
     * @param {TradingSessionUpsertArgs} args - Arguments to update or create a TradingSession.
     * @example
     * // Update or create a TradingSession
     * const tradingSession = await prisma.tradingSession.upsert({
     *   create: {
     *     // ... data to create a TradingSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TradingSession we want to update
     *   }
     * })
     */
    upsert<T extends TradingSessionUpsertArgs>(args: SelectSubset<T, TradingSessionUpsertArgs<ExtArgs>>): Prisma__TradingSessionClient<$Result.GetResult<Prisma.$TradingSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TradingSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingSessionCountArgs} args - Arguments to filter TradingSessions to count.
     * @example
     * // Count the number of TradingSessions
     * const count = await prisma.tradingSession.count({
     *   where: {
     *     // ... the filter for the TradingSessions we want to count
     *   }
     * })
    **/
    count<T extends TradingSessionCountArgs>(
      args?: Subset<T, TradingSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradingSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TradingSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TradingSessionAggregateArgs>(args: Subset<T, TradingSessionAggregateArgs>): Prisma.PrismaPromise<GetTradingSessionAggregateType<T>>

    /**
     * Group by TradingSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingSessionGroupByArgs} args - Group by arguments.
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
      T extends TradingSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradingSessionGroupByArgs['orderBy'] }
        : { orderBy?: TradingSessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TradingSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTradingSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TradingSession model
   */
  readonly fields: TradingSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TradingSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradingSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the TradingSession model
   */
  interface TradingSessionFieldRefs {
    readonly id: FieldRef<"TradingSession", 'String'>
    readonly provider: FieldRef<"TradingSession", 'String'>
    readonly accessToken: FieldRef<"TradingSession", 'String'>
    readonly publicToken: FieldRef<"TradingSession", 'String'>
    readonly createdAt: FieldRef<"TradingSession", 'DateTime'>
    readonly updatedAt: FieldRef<"TradingSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TradingSession findUnique
   */
  export type TradingSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingSession
     */
    select?: TradingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingSession
     */
    omit?: TradingSessionOmit<ExtArgs> | null
    /**
     * Filter, which TradingSession to fetch.
     */
    where: TradingSessionWhereUniqueInput
  }

  /**
   * TradingSession findUniqueOrThrow
   */
  export type TradingSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingSession
     */
    select?: TradingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingSession
     */
    omit?: TradingSessionOmit<ExtArgs> | null
    /**
     * Filter, which TradingSession to fetch.
     */
    where: TradingSessionWhereUniqueInput
  }

  /**
   * TradingSession findFirst
   */
  export type TradingSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingSession
     */
    select?: TradingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingSession
     */
    omit?: TradingSessionOmit<ExtArgs> | null
    /**
     * Filter, which TradingSession to fetch.
     */
    where?: TradingSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingSessions to fetch.
     */
    orderBy?: TradingSessionOrderByWithRelationInput | TradingSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradingSessions.
     */
    cursor?: TradingSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingSessions.
     */
    distinct?: TradingSessionScalarFieldEnum | TradingSessionScalarFieldEnum[]
  }

  /**
   * TradingSession findFirstOrThrow
   */
  export type TradingSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingSession
     */
    select?: TradingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingSession
     */
    omit?: TradingSessionOmit<ExtArgs> | null
    /**
     * Filter, which TradingSession to fetch.
     */
    where?: TradingSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingSessions to fetch.
     */
    orderBy?: TradingSessionOrderByWithRelationInput | TradingSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradingSessions.
     */
    cursor?: TradingSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingSessions.
     */
    distinct?: TradingSessionScalarFieldEnum | TradingSessionScalarFieldEnum[]
  }

  /**
   * TradingSession findMany
   */
  export type TradingSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingSession
     */
    select?: TradingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingSession
     */
    omit?: TradingSessionOmit<ExtArgs> | null
    /**
     * Filter, which TradingSessions to fetch.
     */
    where?: TradingSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingSessions to fetch.
     */
    orderBy?: TradingSessionOrderByWithRelationInput | TradingSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TradingSessions.
     */
    cursor?: TradingSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingSessions.
     */
    distinct?: TradingSessionScalarFieldEnum | TradingSessionScalarFieldEnum[]
  }

  /**
   * TradingSession create
   */
  export type TradingSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingSession
     */
    select?: TradingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingSession
     */
    omit?: TradingSessionOmit<ExtArgs> | null
    /**
     * The data needed to create a TradingSession.
     */
    data: XOR<TradingSessionCreateInput, TradingSessionUncheckedCreateInput>
  }

  /**
   * TradingSession createMany
   */
  export type TradingSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TradingSessions.
     */
    data: TradingSessionCreateManyInput | TradingSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TradingSession createManyAndReturn
   */
  export type TradingSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingSession
     */
    select?: TradingSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradingSession
     */
    omit?: TradingSessionOmit<ExtArgs> | null
    /**
     * The data used to create many TradingSessions.
     */
    data: TradingSessionCreateManyInput | TradingSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TradingSession update
   */
  export type TradingSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingSession
     */
    select?: TradingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingSession
     */
    omit?: TradingSessionOmit<ExtArgs> | null
    /**
     * The data needed to update a TradingSession.
     */
    data: XOR<TradingSessionUpdateInput, TradingSessionUncheckedUpdateInput>
    /**
     * Choose, which TradingSession to update.
     */
    where: TradingSessionWhereUniqueInput
  }

  /**
   * TradingSession updateMany
   */
  export type TradingSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TradingSessions.
     */
    data: XOR<TradingSessionUpdateManyMutationInput, TradingSessionUncheckedUpdateManyInput>
    /**
     * Filter which TradingSessions to update
     */
    where?: TradingSessionWhereInput
    /**
     * Limit how many TradingSessions to update.
     */
    limit?: number
  }

  /**
   * TradingSession updateManyAndReturn
   */
  export type TradingSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingSession
     */
    select?: TradingSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradingSession
     */
    omit?: TradingSessionOmit<ExtArgs> | null
    /**
     * The data used to update TradingSessions.
     */
    data: XOR<TradingSessionUpdateManyMutationInput, TradingSessionUncheckedUpdateManyInput>
    /**
     * Filter which TradingSessions to update
     */
    where?: TradingSessionWhereInput
    /**
     * Limit how many TradingSessions to update.
     */
    limit?: number
  }

  /**
   * TradingSession upsert
   */
  export type TradingSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingSession
     */
    select?: TradingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingSession
     */
    omit?: TradingSessionOmit<ExtArgs> | null
    /**
     * The filter to search for the TradingSession to update in case it exists.
     */
    where: TradingSessionWhereUniqueInput
    /**
     * In case the TradingSession found by the `where` argument doesn't exist, create a new TradingSession with this data.
     */
    create: XOR<TradingSessionCreateInput, TradingSessionUncheckedCreateInput>
    /**
     * In case the TradingSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TradingSessionUpdateInput, TradingSessionUncheckedUpdateInput>
  }

  /**
   * TradingSession delete
   */
  export type TradingSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingSession
     */
    select?: TradingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingSession
     */
    omit?: TradingSessionOmit<ExtArgs> | null
    /**
     * Filter which TradingSession to delete.
     */
    where: TradingSessionWhereUniqueInput
  }

  /**
   * TradingSession deleteMany
   */
  export type TradingSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradingSessions to delete
     */
    where?: TradingSessionWhereInput
    /**
     * Limit how many TradingSessions to delete.
     */
    limit?: number
  }

  /**
   * TradingSession without action
   */
  export type TradingSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingSession
     */
    select?: TradingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingSession
     */
    omit?: TradingSessionOmit<ExtArgs> | null
  }


  /**
   * Model TradingAccount
   */

  export type AggregateTradingAccount = {
    _count: TradingAccountCountAggregateOutputType | null
    _avg: TradingAccountAvgAggregateOutputType | null
    _sum: TradingAccountSumAggregateOutputType | null
    _min: TradingAccountMinAggregateOutputType | null
    _max: TradingAccountMaxAggregateOutputType | null
  }

  export type TradingAccountAvgAggregateOutputType = {
    balance: number | null
  }

  export type TradingAccountSumAggregateOutputType = {
    balance: number | null
  }

  export type TradingAccountMinAggregateOutputType = {
    id: string | null
    provider: string | null
    name: string | null
    isLive: boolean | null
    balance: number | null
    currency: string | null
    createdAt: Date | null
  }

  export type TradingAccountMaxAggregateOutputType = {
    id: string | null
    provider: string | null
    name: string | null
    isLive: boolean | null
    balance: number | null
    currency: string | null
    createdAt: Date | null
  }

  export type TradingAccountCountAggregateOutputType = {
    id: number
    provider: number
    name: number
    isLive: number
    balance: number
    currency: number
    createdAt: number
    _all: number
  }


  export type TradingAccountAvgAggregateInputType = {
    balance?: true
  }

  export type TradingAccountSumAggregateInputType = {
    balance?: true
  }

  export type TradingAccountMinAggregateInputType = {
    id?: true
    provider?: true
    name?: true
    isLive?: true
    balance?: true
    currency?: true
    createdAt?: true
  }

  export type TradingAccountMaxAggregateInputType = {
    id?: true
    provider?: true
    name?: true
    isLive?: true
    balance?: true
    currency?: true
    createdAt?: true
  }

  export type TradingAccountCountAggregateInputType = {
    id?: true
    provider?: true
    name?: true
    isLive?: true
    balance?: true
    currency?: true
    createdAt?: true
    _all?: true
  }

  export type TradingAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradingAccount to aggregate.
     */
    where?: TradingAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingAccounts to fetch.
     */
    orderBy?: TradingAccountOrderByWithRelationInput | TradingAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TradingAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TradingAccounts
    **/
    _count?: true | TradingAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TradingAccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TradingAccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TradingAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TradingAccountMaxAggregateInputType
  }

  export type GetTradingAccountAggregateType<T extends TradingAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateTradingAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTradingAccount[P]>
      : GetScalarType<T[P], AggregateTradingAccount[P]>
  }




  export type TradingAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradingAccountWhereInput
    orderBy?: TradingAccountOrderByWithAggregationInput | TradingAccountOrderByWithAggregationInput[]
    by: TradingAccountScalarFieldEnum[] | TradingAccountScalarFieldEnum
    having?: TradingAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TradingAccountCountAggregateInputType | true
    _avg?: TradingAccountAvgAggregateInputType
    _sum?: TradingAccountSumAggregateInputType
    _min?: TradingAccountMinAggregateInputType
    _max?: TradingAccountMaxAggregateInputType
  }

  export type TradingAccountGroupByOutputType = {
    id: string
    provider: string
    name: string
    isLive: boolean
    balance: number
    currency: string
    createdAt: Date
    _count: TradingAccountCountAggregateOutputType | null
    _avg: TradingAccountAvgAggregateOutputType | null
    _sum: TradingAccountSumAggregateOutputType | null
    _min: TradingAccountMinAggregateOutputType | null
    _max: TradingAccountMaxAggregateOutputType | null
  }

  type GetTradingAccountGroupByPayload<T extends TradingAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradingAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TradingAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TradingAccountGroupByOutputType[P]>
            : GetScalarType<T[P], TradingAccountGroupByOutputType[P]>
        }
      >
    >


  export type TradingAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    provider?: boolean
    name?: boolean
    isLive?: boolean
    balance?: boolean
    currency?: boolean
    createdAt?: boolean
    orders?: boolean | TradingAccount$ordersArgs<ExtArgs>
    positions?: boolean | TradingAccount$positionsArgs<ExtArgs>
    _count?: boolean | TradingAccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradingAccount"]>

  export type TradingAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    provider?: boolean
    name?: boolean
    isLive?: boolean
    balance?: boolean
    currency?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["tradingAccount"]>

  export type TradingAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    provider?: boolean
    name?: boolean
    isLive?: boolean
    balance?: boolean
    currency?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["tradingAccount"]>

  export type TradingAccountSelectScalar = {
    id?: boolean
    provider?: boolean
    name?: boolean
    isLive?: boolean
    balance?: boolean
    currency?: boolean
    createdAt?: boolean
  }

  export type TradingAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "provider" | "name" | "isLive" | "balance" | "currency" | "createdAt", ExtArgs["result"]["tradingAccount"]>
  export type TradingAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | TradingAccount$ordersArgs<ExtArgs>
    positions?: boolean | TradingAccount$positionsArgs<ExtArgs>
    _count?: boolean | TradingAccountCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TradingAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TradingAccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TradingAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TradingAccount"
    objects: {
      orders: Prisma.$TradingOrderPayload<ExtArgs>[]
      positions: Prisma.$TradingPositionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      provider: string
      name: string
      isLive: boolean
      balance: number
      currency: string
      createdAt: Date
    }, ExtArgs["result"]["tradingAccount"]>
    composites: {}
  }

  type TradingAccountGetPayload<S extends boolean | null | undefined | TradingAccountDefaultArgs> = $Result.GetResult<Prisma.$TradingAccountPayload, S>

  type TradingAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TradingAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TradingAccountCountAggregateInputType | true
    }

  export interface TradingAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TradingAccount'], meta: { name: 'TradingAccount' } }
    /**
     * Find zero or one TradingAccount that matches the filter.
     * @param {TradingAccountFindUniqueArgs} args - Arguments to find a TradingAccount
     * @example
     * // Get one TradingAccount
     * const tradingAccount = await prisma.tradingAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TradingAccountFindUniqueArgs>(args: SelectSubset<T, TradingAccountFindUniqueArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TradingAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TradingAccountFindUniqueOrThrowArgs} args - Arguments to find a TradingAccount
     * @example
     * // Get one TradingAccount
     * const tradingAccount = await prisma.tradingAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TradingAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, TradingAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradingAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingAccountFindFirstArgs} args - Arguments to find a TradingAccount
     * @example
     * // Get one TradingAccount
     * const tradingAccount = await prisma.tradingAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TradingAccountFindFirstArgs>(args?: SelectSubset<T, TradingAccountFindFirstArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradingAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingAccountFindFirstOrThrowArgs} args - Arguments to find a TradingAccount
     * @example
     * // Get one TradingAccount
     * const tradingAccount = await prisma.tradingAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TradingAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, TradingAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TradingAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TradingAccounts
     * const tradingAccounts = await prisma.tradingAccount.findMany()
     * 
     * // Get first 10 TradingAccounts
     * const tradingAccounts = await prisma.tradingAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tradingAccountWithIdOnly = await prisma.tradingAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TradingAccountFindManyArgs>(args?: SelectSubset<T, TradingAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TradingAccount.
     * @param {TradingAccountCreateArgs} args - Arguments to create a TradingAccount.
     * @example
     * // Create one TradingAccount
     * const TradingAccount = await prisma.tradingAccount.create({
     *   data: {
     *     // ... data to create a TradingAccount
     *   }
     * })
     * 
     */
    create<T extends TradingAccountCreateArgs>(args: SelectSubset<T, TradingAccountCreateArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TradingAccounts.
     * @param {TradingAccountCreateManyArgs} args - Arguments to create many TradingAccounts.
     * @example
     * // Create many TradingAccounts
     * const tradingAccount = await prisma.tradingAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TradingAccountCreateManyArgs>(args?: SelectSubset<T, TradingAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TradingAccounts and returns the data saved in the database.
     * @param {TradingAccountCreateManyAndReturnArgs} args - Arguments to create many TradingAccounts.
     * @example
     * // Create many TradingAccounts
     * const tradingAccount = await prisma.tradingAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TradingAccounts and only return the `id`
     * const tradingAccountWithIdOnly = await prisma.tradingAccount.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TradingAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, TradingAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TradingAccount.
     * @param {TradingAccountDeleteArgs} args - Arguments to delete one TradingAccount.
     * @example
     * // Delete one TradingAccount
     * const TradingAccount = await prisma.tradingAccount.delete({
     *   where: {
     *     // ... filter to delete one TradingAccount
     *   }
     * })
     * 
     */
    delete<T extends TradingAccountDeleteArgs>(args: SelectSubset<T, TradingAccountDeleteArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TradingAccount.
     * @param {TradingAccountUpdateArgs} args - Arguments to update one TradingAccount.
     * @example
     * // Update one TradingAccount
     * const tradingAccount = await prisma.tradingAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TradingAccountUpdateArgs>(args: SelectSubset<T, TradingAccountUpdateArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TradingAccounts.
     * @param {TradingAccountDeleteManyArgs} args - Arguments to filter TradingAccounts to delete.
     * @example
     * // Delete a few TradingAccounts
     * const { count } = await prisma.tradingAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TradingAccountDeleteManyArgs>(args?: SelectSubset<T, TradingAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradingAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TradingAccounts
     * const tradingAccount = await prisma.tradingAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TradingAccountUpdateManyArgs>(args: SelectSubset<T, TradingAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradingAccounts and returns the data updated in the database.
     * @param {TradingAccountUpdateManyAndReturnArgs} args - Arguments to update many TradingAccounts.
     * @example
     * // Update many TradingAccounts
     * const tradingAccount = await prisma.tradingAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TradingAccounts and only return the `id`
     * const tradingAccountWithIdOnly = await prisma.tradingAccount.updateManyAndReturn({
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
    updateManyAndReturn<T extends TradingAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, TradingAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TradingAccount.
     * @param {TradingAccountUpsertArgs} args - Arguments to update or create a TradingAccount.
     * @example
     * // Update or create a TradingAccount
     * const tradingAccount = await prisma.tradingAccount.upsert({
     *   create: {
     *     // ... data to create a TradingAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TradingAccount we want to update
     *   }
     * })
     */
    upsert<T extends TradingAccountUpsertArgs>(args: SelectSubset<T, TradingAccountUpsertArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TradingAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingAccountCountArgs} args - Arguments to filter TradingAccounts to count.
     * @example
     * // Count the number of TradingAccounts
     * const count = await prisma.tradingAccount.count({
     *   where: {
     *     // ... the filter for the TradingAccounts we want to count
     *   }
     * })
    **/
    count<T extends TradingAccountCountArgs>(
      args?: Subset<T, TradingAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradingAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TradingAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TradingAccountAggregateArgs>(args: Subset<T, TradingAccountAggregateArgs>): Prisma.PrismaPromise<GetTradingAccountAggregateType<T>>

    /**
     * Group by TradingAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingAccountGroupByArgs} args - Group by arguments.
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
      T extends TradingAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradingAccountGroupByArgs['orderBy'] }
        : { orderBy?: TradingAccountGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TradingAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTradingAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TradingAccount model
   */
  readonly fields: TradingAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TradingAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradingAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    orders<T extends TradingAccount$ordersArgs<ExtArgs> = {}>(args?: Subset<T, TradingAccount$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    positions<T extends TradingAccount$positionsArgs<ExtArgs> = {}>(args?: Subset<T, TradingAccount$positionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the TradingAccount model
   */
  interface TradingAccountFieldRefs {
    readonly id: FieldRef<"TradingAccount", 'String'>
    readonly provider: FieldRef<"TradingAccount", 'String'>
    readonly name: FieldRef<"TradingAccount", 'String'>
    readonly isLive: FieldRef<"TradingAccount", 'Boolean'>
    readonly balance: FieldRef<"TradingAccount", 'Float'>
    readonly currency: FieldRef<"TradingAccount", 'String'>
    readonly createdAt: FieldRef<"TradingAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TradingAccount findUnique
   */
  export type TradingAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingAccount
     */
    omit?: TradingAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * Filter, which TradingAccount to fetch.
     */
    where: TradingAccountWhereUniqueInput
  }

  /**
   * TradingAccount findUniqueOrThrow
   */
  export type TradingAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingAccount
     */
    omit?: TradingAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * Filter, which TradingAccount to fetch.
     */
    where: TradingAccountWhereUniqueInput
  }

  /**
   * TradingAccount findFirst
   */
  export type TradingAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingAccount
     */
    omit?: TradingAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * Filter, which TradingAccount to fetch.
     */
    where?: TradingAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingAccounts to fetch.
     */
    orderBy?: TradingAccountOrderByWithRelationInput | TradingAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradingAccounts.
     */
    cursor?: TradingAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingAccounts.
     */
    distinct?: TradingAccountScalarFieldEnum | TradingAccountScalarFieldEnum[]
  }

  /**
   * TradingAccount findFirstOrThrow
   */
  export type TradingAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingAccount
     */
    omit?: TradingAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * Filter, which TradingAccount to fetch.
     */
    where?: TradingAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingAccounts to fetch.
     */
    orderBy?: TradingAccountOrderByWithRelationInput | TradingAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradingAccounts.
     */
    cursor?: TradingAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingAccounts.
     */
    distinct?: TradingAccountScalarFieldEnum | TradingAccountScalarFieldEnum[]
  }

  /**
   * TradingAccount findMany
   */
  export type TradingAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingAccount
     */
    omit?: TradingAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * Filter, which TradingAccounts to fetch.
     */
    where?: TradingAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingAccounts to fetch.
     */
    orderBy?: TradingAccountOrderByWithRelationInput | TradingAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TradingAccounts.
     */
    cursor?: TradingAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingAccounts.
     */
    distinct?: TradingAccountScalarFieldEnum | TradingAccountScalarFieldEnum[]
  }

  /**
   * TradingAccount create
   */
  export type TradingAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingAccount
     */
    omit?: TradingAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a TradingAccount.
     */
    data: XOR<TradingAccountCreateInput, TradingAccountUncheckedCreateInput>
  }

  /**
   * TradingAccount createMany
   */
  export type TradingAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TradingAccounts.
     */
    data: TradingAccountCreateManyInput | TradingAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TradingAccount createManyAndReturn
   */
  export type TradingAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradingAccount
     */
    omit?: TradingAccountOmit<ExtArgs> | null
    /**
     * The data used to create many TradingAccounts.
     */
    data: TradingAccountCreateManyInput | TradingAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TradingAccount update
   */
  export type TradingAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingAccount
     */
    omit?: TradingAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a TradingAccount.
     */
    data: XOR<TradingAccountUpdateInput, TradingAccountUncheckedUpdateInput>
    /**
     * Choose, which TradingAccount to update.
     */
    where: TradingAccountWhereUniqueInput
  }

  /**
   * TradingAccount updateMany
   */
  export type TradingAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TradingAccounts.
     */
    data: XOR<TradingAccountUpdateManyMutationInput, TradingAccountUncheckedUpdateManyInput>
    /**
     * Filter which TradingAccounts to update
     */
    where?: TradingAccountWhereInput
    /**
     * Limit how many TradingAccounts to update.
     */
    limit?: number
  }

  /**
   * TradingAccount updateManyAndReturn
   */
  export type TradingAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradingAccount
     */
    omit?: TradingAccountOmit<ExtArgs> | null
    /**
     * The data used to update TradingAccounts.
     */
    data: XOR<TradingAccountUpdateManyMutationInput, TradingAccountUncheckedUpdateManyInput>
    /**
     * Filter which TradingAccounts to update
     */
    where?: TradingAccountWhereInput
    /**
     * Limit how many TradingAccounts to update.
     */
    limit?: number
  }

  /**
   * TradingAccount upsert
   */
  export type TradingAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingAccount
     */
    omit?: TradingAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the TradingAccount to update in case it exists.
     */
    where: TradingAccountWhereUniqueInput
    /**
     * In case the TradingAccount found by the `where` argument doesn't exist, create a new TradingAccount with this data.
     */
    create: XOR<TradingAccountCreateInput, TradingAccountUncheckedCreateInput>
    /**
     * In case the TradingAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TradingAccountUpdateInput, TradingAccountUncheckedUpdateInput>
  }

  /**
   * TradingAccount delete
   */
  export type TradingAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingAccount
     */
    omit?: TradingAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
    /**
     * Filter which TradingAccount to delete.
     */
    where: TradingAccountWhereUniqueInput
  }

  /**
   * TradingAccount deleteMany
   */
  export type TradingAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradingAccounts to delete
     */
    where?: TradingAccountWhereInput
    /**
     * Limit how many TradingAccounts to delete.
     */
    limit?: number
  }

  /**
   * TradingAccount.orders
   */
  export type TradingAccount$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingOrder
     */
    select?: TradingOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingOrder
     */
    omit?: TradingOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingOrderInclude<ExtArgs> | null
    where?: TradingOrderWhereInput
    orderBy?: TradingOrderOrderByWithRelationInput | TradingOrderOrderByWithRelationInput[]
    cursor?: TradingOrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradingOrderScalarFieldEnum | TradingOrderScalarFieldEnum[]
  }

  /**
   * TradingAccount.positions
   */
  export type TradingAccount$positionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    where?: TradingPositionWhereInput
    orderBy?: TradingPositionOrderByWithRelationInput | TradingPositionOrderByWithRelationInput[]
    cursor?: TradingPositionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradingPositionScalarFieldEnum | TradingPositionScalarFieldEnum[]
  }

  /**
   * TradingAccount without action
   */
  export type TradingAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingAccount
     */
    select?: TradingAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingAccount
     */
    omit?: TradingAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingAccountInclude<ExtArgs> | null
  }


  /**
   * Model TradingOrder
   */

  export type AggregateTradingOrder = {
    _count: TradingOrderCountAggregateOutputType | null
    _avg: TradingOrderAvgAggregateOutputType | null
    _sum: TradingOrderSumAggregateOutputType | null
    _min: TradingOrderMinAggregateOutputType | null
    _max: TradingOrderMaxAggregateOutputType | null
  }

  export type TradingOrderAvgAggregateOutputType = {
    qty: number | null
    price: number | null
    filledPrice: number | null
    commission: number | null
  }

  export type TradingOrderSumAggregateOutputType = {
    qty: number | null
    price: number | null
    filledPrice: number | null
    commission: number | null
  }

  export type TradingOrderMinAggregateOutputType = {
    id: string | null
    accountId: string | null
    symbol: string | null
    qty: number | null
    side: string | null
    type: string | null
    price: number | null
    status: string | null
    filledPrice: number | null
    commission: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TradingOrderMaxAggregateOutputType = {
    id: string | null
    accountId: string | null
    symbol: string | null
    qty: number | null
    side: string | null
    type: string | null
    price: number | null
    status: string | null
    filledPrice: number | null
    commission: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TradingOrderCountAggregateOutputType = {
    id: number
    accountId: number
    symbol: number
    qty: number
    side: number
    type: number
    price: number
    status: number
    filledPrice: number
    commission: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TradingOrderAvgAggregateInputType = {
    qty?: true
    price?: true
    filledPrice?: true
    commission?: true
  }

  export type TradingOrderSumAggregateInputType = {
    qty?: true
    price?: true
    filledPrice?: true
    commission?: true
  }

  export type TradingOrderMinAggregateInputType = {
    id?: true
    accountId?: true
    symbol?: true
    qty?: true
    side?: true
    type?: true
    price?: true
    status?: true
    filledPrice?: true
    commission?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TradingOrderMaxAggregateInputType = {
    id?: true
    accountId?: true
    symbol?: true
    qty?: true
    side?: true
    type?: true
    price?: true
    status?: true
    filledPrice?: true
    commission?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TradingOrderCountAggregateInputType = {
    id?: true
    accountId?: true
    symbol?: true
    qty?: true
    side?: true
    type?: true
    price?: true
    status?: true
    filledPrice?: true
    commission?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TradingOrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradingOrder to aggregate.
     */
    where?: TradingOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingOrders to fetch.
     */
    orderBy?: TradingOrderOrderByWithRelationInput | TradingOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TradingOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TradingOrders
    **/
    _count?: true | TradingOrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TradingOrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TradingOrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TradingOrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TradingOrderMaxAggregateInputType
  }

  export type GetTradingOrderAggregateType<T extends TradingOrderAggregateArgs> = {
        [P in keyof T & keyof AggregateTradingOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTradingOrder[P]>
      : GetScalarType<T[P], AggregateTradingOrder[P]>
  }




  export type TradingOrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradingOrderWhereInput
    orderBy?: TradingOrderOrderByWithAggregationInput | TradingOrderOrderByWithAggregationInput[]
    by: TradingOrderScalarFieldEnum[] | TradingOrderScalarFieldEnum
    having?: TradingOrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TradingOrderCountAggregateInputType | true
    _avg?: TradingOrderAvgAggregateInputType
    _sum?: TradingOrderSumAggregateInputType
    _min?: TradingOrderMinAggregateInputType
    _max?: TradingOrderMaxAggregateInputType
  }

  export type TradingOrderGroupByOutputType = {
    id: string
    accountId: string
    symbol: string
    qty: number
    side: string
    type: string
    price: number | null
    status: string
    filledPrice: number | null
    commission: number
    createdAt: Date
    updatedAt: Date
    _count: TradingOrderCountAggregateOutputType | null
    _avg: TradingOrderAvgAggregateOutputType | null
    _sum: TradingOrderSumAggregateOutputType | null
    _min: TradingOrderMinAggregateOutputType | null
    _max: TradingOrderMaxAggregateOutputType | null
  }

  type GetTradingOrderGroupByPayload<T extends TradingOrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradingOrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TradingOrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TradingOrderGroupByOutputType[P]>
            : GetScalarType<T[P], TradingOrderGroupByOutputType[P]>
        }
      >
    >


  export type TradingOrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    symbol?: boolean
    qty?: boolean
    side?: boolean
    type?: boolean
    price?: boolean
    status?: boolean
    filledPrice?: boolean
    commission?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | TradingAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradingOrder"]>

  export type TradingOrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    symbol?: boolean
    qty?: boolean
    side?: boolean
    type?: boolean
    price?: boolean
    status?: boolean
    filledPrice?: boolean
    commission?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | TradingAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradingOrder"]>

  export type TradingOrderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    symbol?: boolean
    qty?: boolean
    side?: boolean
    type?: boolean
    price?: boolean
    status?: boolean
    filledPrice?: boolean
    commission?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | TradingAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradingOrder"]>

  export type TradingOrderSelectScalar = {
    id?: boolean
    accountId?: boolean
    symbol?: boolean
    qty?: boolean
    side?: boolean
    type?: boolean
    price?: boolean
    status?: boolean
    filledPrice?: boolean
    commission?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TradingOrderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountId" | "symbol" | "qty" | "side" | "type" | "price" | "status" | "filledPrice" | "commission" | "createdAt" | "updatedAt", ExtArgs["result"]["tradingOrder"]>
  export type TradingOrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | TradingAccountDefaultArgs<ExtArgs>
  }
  export type TradingOrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | TradingAccountDefaultArgs<ExtArgs>
  }
  export type TradingOrderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | TradingAccountDefaultArgs<ExtArgs>
  }

  export type $TradingOrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TradingOrder"
    objects: {
      account: Prisma.$TradingAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountId: string
      symbol: string
      qty: number
      side: string
      type: string
      price: number | null
      status: string
      filledPrice: number | null
      commission: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tradingOrder"]>
    composites: {}
  }

  type TradingOrderGetPayload<S extends boolean | null | undefined | TradingOrderDefaultArgs> = $Result.GetResult<Prisma.$TradingOrderPayload, S>

  type TradingOrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TradingOrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TradingOrderCountAggregateInputType | true
    }

  export interface TradingOrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TradingOrder'], meta: { name: 'TradingOrder' } }
    /**
     * Find zero or one TradingOrder that matches the filter.
     * @param {TradingOrderFindUniqueArgs} args - Arguments to find a TradingOrder
     * @example
     * // Get one TradingOrder
     * const tradingOrder = await prisma.tradingOrder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TradingOrderFindUniqueArgs>(args: SelectSubset<T, TradingOrderFindUniqueArgs<ExtArgs>>): Prisma__TradingOrderClient<$Result.GetResult<Prisma.$TradingOrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TradingOrder that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TradingOrderFindUniqueOrThrowArgs} args - Arguments to find a TradingOrder
     * @example
     * // Get one TradingOrder
     * const tradingOrder = await prisma.tradingOrder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TradingOrderFindUniqueOrThrowArgs>(args: SelectSubset<T, TradingOrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TradingOrderClient<$Result.GetResult<Prisma.$TradingOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradingOrder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingOrderFindFirstArgs} args - Arguments to find a TradingOrder
     * @example
     * // Get one TradingOrder
     * const tradingOrder = await prisma.tradingOrder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TradingOrderFindFirstArgs>(args?: SelectSubset<T, TradingOrderFindFirstArgs<ExtArgs>>): Prisma__TradingOrderClient<$Result.GetResult<Prisma.$TradingOrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradingOrder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingOrderFindFirstOrThrowArgs} args - Arguments to find a TradingOrder
     * @example
     * // Get one TradingOrder
     * const tradingOrder = await prisma.tradingOrder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TradingOrderFindFirstOrThrowArgs>(args?: SelectSubset<T, TradingOrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__TradingOrderClient<$Result.GetResult<Prisma.$TradingOrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TradingOrders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingOrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TradingOrders
     * const tradingOrders = await prisma.tradingOrder.findMany()
     * 
     * // Get first 10 TradingOrders
     * const tradingOrders = await prisma.tradingOrder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tradingOrderWithIdOnly = await prisma.tradingOrder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TradingOrderFindManyArgs>(args?: SelectSubset<T, TradingOrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TradingOrder.
     * @param {TradingOrderCreateArgs} args - Arguments to create a TradingOrder.
     * @example
     * // Create one TradingOrder
     * const TradingOrder = await prisma.tradingOrder.create({
     *   data: {
     *     // ... data to create a TradingOrder
     *   }
     * })
     * 
     */
    create<T extends TradingOrderCreateArgs>(args: SelectSubset<T, TradingOrderCreateArgs<ExtArgs>>): Prisma__TradingOrderClient<$Result.GetResult<Prisma.$TradingOrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TradingOrders.
     * @param {TradingOrderCreateManyArgs} args - Arguments to create many TradingOrders.
     * @example
     * // Create many TradingOrders
     * const tradingOrder = await prisma.tradingOrder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TradingOrderCreateManyArgs>(args?: SelectSubset<T, TradingOrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TradingOrders and returns the data saved in the database.
     * @param {TradingOrderCreateManyAndReturnArgs} args - Arguments to create many TradingOrders.
     * @example
     * // Create many TradingOrders
     * const tradingOrder = await prisma.tradingOrder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TradingOrders and only return the `id`
     * const tradingOrderWithIdOnly = await prisma.tradingOrder.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TradingOrderCreateManyAndReturnArgs>(args?: SelectSubset<T, TradingOrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingOrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TradingOrder.
     * @param {TradingOrderDeleteArgs} args - Arguments to delete one TradingOrder.
     * @example
     * // Delete one TradingOrder
     * const TradingOrder = await prisma.tradingOrder.delete({
     *   where: {
     *     // ... filter to delete one TradingOrder
     *   }
     * })
     * 
     */
    delete<T extends TradingOrderDeleteArgs>(args: SelectSubset<T, TradingOrderDeleteArgs<ExtArgs>>): Prisma__TradingOrderClient<$Result.GetResult<Prisma.$TradingOrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TradingOrder.
     * @param {TradingOrderUpdateArgs} args - Arguments to update one TradingOrder.
     * @example
     * // Update one TradingOrder
     * const tradingOrder = await prisma.tradingOrder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TradingOrderUpdateArgs>(args: SelectSubset<T, TradingOrderUpdateArgs<ExtArgs>>): Prisma__TradingOrderClient<$Result.GetResult<Prisma.$TradingOrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TradingOrders.
     * @param {TradingOrderDeleteManyArgs} args - Arguments to filter TradingOrders to delete.
     * @example
     * // Delete a few TradingOrders
     * const { count } = await prisma.tradingOrder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TradingOrderDeleteManyArgs>(args?: SelectSubset<T, TradingOrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradingOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingOrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TradingOrders
     * const tradingOrder = await prisma.tradingOrder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TradingOrderUpdateManyArgs>(args: SelectSubset<T, TradingOrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradingOrders and returns the data updated in the database.
     * @param {TradingOrderUpdateManyAndReturnArgs} args - Arguments to update many TradingOrders.
     * @example
     * // Update many TradingOrders
     * const tradingOrder = await prisma.tradingOrder.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TradingOrders and only return the `id`
     * const tradingOrderWithIdOnly = await prisma.tradingOrder.updateManyAndReturn({
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
    updateManyAndReturn<T extends TradingOrderUpdateManyAndReturnArgs>(args: SelectSubset<T, TradingOrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingOrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TradingOrder.
     * @param {TradingOrderUpsertArgs} args - Arguments to update or create a TradingOrder.
     * @example
     * // Update or create a TradingOrder
     * const tradingOrder = await prisma.tradingOrder.upsert({
     *   create: {
     *     // ... data to create a TradingOrder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TradingOrder we want to update
     *   }
     * })
     */
    upsert<T extends TradingOrderUpsertArgs>(args: SelectSubset<T, TradingOrderUpsertArgs<ExtArgs>>): Prisma__TradingOrderClient<$Result.GetResult<Prisma.$TradingOrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TradingOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingOrderCountArgs} args - Arguments to filter TradingOrders to count.
     * @example
     * // Count the number of TradingOrders
     * const count = await prisma.tradingOrder.count({
     *   where: {
     *     // ... the filter for the TradingOrders we want to count
     *   }
     * })
    **/
    count<T extends TradingOrderCountArgs>(
      args?: Subset<T, TradingOrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradingOrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TradingOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingOrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TradingOrderAggregateArgs>(args: Subset<T, TradingOrderAggregateArgs>): Prisma.PrismaPromise<GetTradingOrderAggregateType<T>>

    /**
     * Group by TradingOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingOrderGroupByArgs} args - Group by arguments.
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
      T extends TradingOrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradingOrderGroupByArgs['orderBy'] }
        : { orderBy?: TradingOrderGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TradingOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTradingOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TradingOrder model
   */
  readonly fields: TradingOrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TradingOrder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradingOrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account<T extends TradingAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TradingAccountDefaultArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the TradingOrder model
   */
  interface TradingOrderFieldRefs {
    readonly id: FieldRef<"TradingOrder", 'String'>
    readonly accountId: FieldRef<"TradingOrder", 'String'>
    readonly symbol: FieldRef<"TradingOrder", 'String'>
    readonly qty: FieldRef<"TradingOrder", 'Float'>
    readonly side: FieldRef<"TradingOrder", 'String'>
    readonly type: FieldRef<"TradingOrder", 'String'>
    readonly price: FieldRef<"TradingOrder", 'Float'>
    readonly status: FieldRef<"TradingOrder", 'String'>
    readonly filledPrice: FieldRef<"TradingOrder", 'Float'>
    readonly commission: FieldRef<"TradingOrder", 'Float'>
    readonly createdAt: FieldRef<"TradingOrder", 'DateTime'>
    readonly updatedAt: FieldRef<"TradingOrder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TradingOrder findUnique
   */
  export type TradingOrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingOrder
     */
    select?: TradingOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingOrder
     */
    omit?: TradingOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingOrderInclude<ExtArgs> | null
    /**
     * Filter, which TradingOrder to fetch.
     */
    where: TradingOrderWhereUniqueInput
  }

  /**
   * TradingOrder findUniqueOrThrow
   */
  export type TradingOrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingOrder
     */
    select?: TradingOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingOrder
     */
    omit?: TradingOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingOrderInclude<ExtArgs> | null
    /**
     * Filter, which TradingOrder to fetch.
     */
    where: TradingOrderWhereUniqueInput
  }

  /**
   * TradingOrder findFirst
   */
  export type TradingOrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingOrder
     */
    select?: TradingOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingOrder
     */
    omit?: TradingOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingOrderInclude<ExtArgs> | null
    /**
     * Filter, which TradingOrder to fetch.
     */
    where?: TradingOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingOrders to fetch.
     */
    orderBy?: TradingOrderOrderByWithRelationInput | TradingOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradingOrders.
     */
    cursor?: TradingOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingOrders.
     */
    distinct?: TradingOrderScalarFieldEnum | TradingOrderScalarFieldEnum[]
  }

  /**
   * TradingOrder findFirstOrThrow
   */
  export type TradingOrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingOrder
     */
    select?: TradingOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingOrder
     */
    omit?: TradingOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingOrderInclude<ExtArgs> | null
    /**
     * Filter, which TradingOrder to fetch.
     */
    where?: TradingOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingOrders to fetch.
     */
    orderBy?: TradingOrderOrderByWithRelationInput | TradingOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradingOrders.
     */
    cursor?: TradingOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingOrders.
     */
    distinct?: TradingOrderScalarFieldEnum | TradingOrderScalarFieldEnum[]
  }

  /**
   * TradingOrder findMany
   */
  export type TradingOrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingOrder
     */
    select?: TradingOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingOrder
     */
    omit?: TradingOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingOrderInclude<ExtArgs> | null
    /**
     * Filter, which TradingOrders to fetch.
     */
    where?: TradingOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingOrders to fetch.
     */
    orderBy?: TradingOrderOrderByWithRelationInput | TradingOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TradingOrders.
     */
    cursor?: TradingOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingOrders.
     */
    distinct?: TradingOrderScalarFieldEnum | TradingOrderScalarFieldEnum[]
  }

  /**
   * TradingOrder create
   */
  export type TradingOrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingOrder
     */
    select?: TradingOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingOrder
     */
    omit?: TradingOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingOrderInclude<ExtArgs> | null
    /**
     * The data needed to create a TradingOrder.
     */
    data: XOR<TradingOrderCreateInput, TradingOrderUncheckedCreateInput>
  }

  /**
   * TradingOrder createMany
   */
  export type TradingOrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TradingOrders.
     */
    data: TradingOrderCreateManyInput | TradingOrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TradingOrder createManyAndReturn
   */
  export type TradingOrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingOrder
     */
    select?: TradingOrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradingOrder
     */
    omit?: TradingOrderOmit<ExtArgs> | null
    /**
     * The data used to create many TradingOrders.
     */
    data: TradingOrderCreateManyInput | TradingOrderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingOrderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradingOrder update
   */
  export type TradingOrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingOrder
     */
    select?: TradingOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingOrder
     */
    omit?: TradingOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingOrderInclude<ExtArgs> | null
    /**
     * The data needed to update a TradingOrder.
     */
    data: XOR<TradingOrderUpdateInput, TradingOrderUncheckedUpdateInput>
    /**
     * Choose, which TradingOrder to update.
     */
    where: TradingOrderWhereUniqueInput
  }

  /**
   * TradingOrder updateMany
   */
  export type TradingOrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TradingOrders.
     */
    data: XOR<TradingOrderUpdateManyMutationInput, TradingOrderUncheckedUpdateManyInput>
    /**
     * Filter which TradingOrders to update
     */
    where?: TradingOrderWhereInput
    /**
     * Limit how many TradingOrders to update.
     */
    limit?: number
  }

  /**
   * TradingOrder updateManyAndReturn
   */
  export type TradingOrderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingOrder
     */
    select?: TradingOrderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradingOrder
     */
    omit?: TradingOrderOmit<ExtArgs> | null
    /**
     * The data used to update TradingOrders.
     */
    data: XOR<TradingOrderUpdateManyMutationInput, TradingOrderUncheckedUpdateManyInput>
    /**
     * Filter which TradingOrders to update
     */
    where?: TradingOrderWhereInput
    /**
     * Limit how many TradingOrders to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingOrderIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradingOrder upsert
   */
  export type TradingOrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingOrder
     */
    select?: TradingOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingOrder
     */
    omit?: TradingOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingOrderInclude<ExtArgs> | null
    /**
     * The filter to search for the TradingOrder to update in case it exists.
     */
    where: TradingOrderWhereUniqueInput
    /**
     * In case the TradingOrder found by the `where` argument doesn't exist, create a new TradingOrder with this data.
     */
    create: XOR<TradingOrderCreateInput, TradingOrderUncheckedCreateInput>
    /**
     * In case the TradingOrder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TradingOrderUpdateInput, TradingOrderUncheckedUpdateInput>
  }

  /**
   * TradingOrder delete
   */
  export type TradingOrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingOrder
     */
    select?: TradingOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingOrder
     */
    omit?: TradingOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingOrderInclude<ExtArgs> | null
    /**
     * Filter which TradingOrder to delete.
     */
    where: TradingOrderWhereUniqueInput
  }

  /**
   * TradingOrder deleteMany
   */
  export type TradingOrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradingOrders to delete
     */
    where?: TradingOrderWhereInput
    /**
     * Limit how many TradingOrders to delete.
     */
    limit?: number
  }

  /**
   * TradingOrder without action
   */
  export type TradingOrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingOrder
     */
    select?: TradingOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingOrder
     */
    omit?: TradingOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingOrderInclude<ExtArgs> | null
  }


  /**
   * Model TradingPosition
   */

  export type AggregateTradingPosition = {
    _count: TradingPositionCountAggregateOutputType | null
    _avg: TradingPositionAvgAggregateOutputType | null
    _sum: TradingPositionSumAggregateOutputType | null
    _min: TradingPositionMinAggregateOutputType | null
    _max: TradingPositionMaxAggregateOutputType | null
  }

  export type TradingPositionAvgAggregateOutputType = {
    qty: number | null
    entryPrice: number | null
    marketPrice: number | null
  }

  export type TradingPositionSumAggregateOutputType = {
    qty: number | null
    entryPrice: number | null
    marketPrice: number | null
  }

  export type TradingPositionMinAggregateOutputType = {
    id: string | null
    accountId: string | null
    symbol: string | null
    qty: number | null
    entryPrice: number | null
    marketPrice: number | null
    updatedAt: Date | null
  }

  export type TradingPositionMaxAggregateOutputType = {
    id: string | null
    accountId: string | null
    symbol: string | null
    qty: number | null
    entryPrice: number | null
    marketPrice: number | null
    updatedAt: Date | null
  }

  export type TradingPositionCountAggregateOutputType = {
    id: number
    accountId: number
    symbol: number
    qty: number
    entryPrice: number
    marketPrice: number
    updatedAt: number
    _all: number
  }


  export type TradingPositionAvgAggregateInputType = {
    qty?: true
    entryPrice?: true
    marketPrice?: true
  }

  export type TradingPositionSumAggregateInputType = {
    qty?: true
    entryPrice?: true
    marketPrice?: true
  }

  export type TradingPositionMinAggregateInputType = {
    id?: true
    accountId?: true
    symbol?: true
    qty?: true
    entryPrice?: true
    marketPrice?: true
    updatedAt?: true
  }

  export type TradingPositionMaxAggregateInputType = {
    id?: true
    accountId?: true
    symbol?: true
    qty?: true
    entryPrice?: true
    marketPrice?: true
    updatedAt?: true
  }

  export type TradingPositionCountAggregateInputType = {
    id?: true
    accountId?: true
    symbol?: true
    qty?: true
    entryPrice?: true
    marketPrice?: true
    updatedAt?: true
    _all?: true
  }

  export type TradingPositionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradingPosition to aggregate.
     */
    where?: TradingPositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingPositions to fetch.
     */
    orderBy?: TradingPositionOrderByWithRelationInput | TradingPositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TradingPositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingPositions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingPositions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TradingPositions
    **/
    _count?: true | TradingPositionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TradingPositionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TradingPositionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TradingPositionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TradingPositionMaxAggregateInputType
  }

  export type GetTradingPositionAggregateType<T extends TradingPositionAggregateArgs> = {
        [P in keyof T & keyof AggregateTradingPosition]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTradingPosition[P]>
      : GetScalarType<T[P], AggregateTradingPosition[P]>
  }




  export type TradingPositionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradingPositionWhereInput
    orderBy?: TradingPositionOrderByWithAggregationInput | TradingPositionOrderByWithAggregationInput[]
    by: TradingPositionScalarFieldEnum[] | TradingPositionScalarFieldEnum
    having?: TradingPositionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TradingPositionCountAggregateInputType | true
    _avg?: TradingPositionAvgAggregateInputType
    _sum?: TradingPositionSumAggregateInputType
    _min?: TradingPositionMinAggregateInputType
    _max?: TradingPositionMaxAggregateInputType
  }

  export type TradingPositionGroupByOutputType = {
    id: string
    accountId: string
    symbol: string
    qty: number
    entryPrice: number
    marketPrice: number
    updatedAt: Date
    _count: TradingPositionCountAggregateOutputType | null
    _avg: TradingPositionAvgAggregateOutputType | null
    _sum: TradingPositionSumAggregateOutputType | null
    _min: TradingPositionMinAggregateOutputType | null
    _max: TradingPositionMaxAggregateOutputType | null
  }

  type GetTradingPositionGroupByPayload<T extends TradingPositionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradingPositionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TradingPositionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TradingPositionGroupByOutputType[P]>
            : GetScalarType<T[P], TradingPositionGroupByOutputType[P]>
        }
      >
    >


  export type TradingPositionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    symbol?: boolean
    qty?: boolean
    entryPrice?: boolean
    marketPrice?: boolean
    updatedAt?: boolean
    account?: boolean | TradingAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradingPosition"]>

  export type TradingPositionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    symbol?: boolean
    qty?: boolean
    entryPrice?: boolean
    marketPrice?: boolean
    updatedAt?: boolean
    account?: boolean | TradingAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradingPosition"]>

  export type TradingPositionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    symbol?: boolean
    qty?: boolean
    entryPrice?: boolean
    marketPrice?: boolean
    updatedAt?: boolean
    account?: boolean | TradingAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradingPosition"]>

  export type TradingPositionSelectScalar = {
    id?: boolean
    accountId?: boolean
    symbol?: boolean
    qty?: boolean
    entryPrice?: boolean
    marketPrice?: boolean
    updatedAt?: boolean
  }

  export type TradingPositionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountId" | "symbol" | "qty" | "entryPrice" | "marketPrice" | "updatedAt", ExtArgs["result"]["tradingPosition"]>
  export type TradingPositionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | TradingAccountDefaultArgs<ExtArgs>
  }
  export type TradingPositionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | TradingAccountDefaultArgs<ExtArgs>
  }
  export type TradingPositionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | TradingAccountDefaultArgs<ExtArgs>
  }

  export type $TradingPositionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TradingPosition"
    objects: {
      account: Prisma.$TradingAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountId: string
      symbol: string
      qty: number
      entryPrice: number
      marketPrice: number
      updatedAt: Date
    }, ExtArgs["result"]["tradingPosition"]>
    composites: {}
  }

  type TradingPositionGetPayload<S extends boolean | null | undefined | TradingPositionDefaultArgs> = $Result.GetResult<Prisma.$TradingPositionPayload, S>

  type TradingPositionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TradingPositionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TradingPositionCountAggregateInputType | true
    }

  export interface TradingPositionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TradingPosition'], meta: { name: 'TradingPosition' } }
    /**
     * Find zero or one TradingPosition that matches the filter.
     * @param {TradingPositionFindUniqueArgs} args - Arguments to find a TradingPosition
     * @example
     * // Get one TradingPosition
     * const tradingPosition = await prisma.tradingPosition.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TradingPositionFindUniqueArgs>(args: SelectSubset<T, TradingPositionFindUniqueArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TradingPosition that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TradingPositionFindUniqueOrThrowArgs} args - Arguments to find a TradingPosition
     * @example
     * // Get one TradingPosition
     * const tradingPosition = await prisma.tradingPosition.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TradingPositionFindUniqueOrThrowArgs>(args: SelectSubset<T, TradingPositionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradingPosition that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPositionFindFirstArgs} args - Arguments to find a TradingPosition
     * @example
     * // Get one TradingPosition
     * const tradingPosition = await prisma.tradingPosition.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TradingPositionFindFirstArgs>(args?: SelectSubset<T, TradingPositionFindFirstArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradingPosition that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPositionFindFirstOrThrowArgs} args - Arguments to find a TradingPosition
     * @example
     * // Get one TradingPosition
     * const tradingPosition = await prisma.tradingPosition.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TradingPositionFindFirstOrThrowArgs>(args?: SelectSubset<T, TradingPositionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TradingPositions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPositionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TradingPositions
     * const tradingPositions = await prisma.tradingPosition.findMany()
     * 
     * // Get first 10 TradingPositions
     * const tradingPositions = await prisma.tradingPosition.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tradingPositionWithIdOnly = await prisma.tradingPosition.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TradingPositionFindManyArgs>(args?: SelectSubset<T, TradingPositionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TradingPosition.
     * @param {TradingPositionCreateArgs} args - Arguments to create a TradingPosition.
     * @example
     * // Create one TradingPosition
     * const TradingPosition = await prisma.tradingPosition.create({
     *   data: {
     *     // ... data to create a TradingPosition
     *   }
     * })
     * 
     */
    create<T extends TradingPositionCreateArgs>(args: SelectSubset<T, TradingPositionCreateArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TradingPositions.
     * @param {TradingPositionCreateManyArgs} args - Arguments to create many TradingPositions.
     * @example
     * // Create many TradingPositions
     * const tradingPosition = await prisma.tradingPosition.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TradingPositionCreateManyArgs>(args?: SelectSubset<T, TradingPositionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TradingPositions and returns the data saved in the database.
     * @param {TradingPositionCreateManyAndReturnArgs} args - Arguments to create many TradingPositions.
     * @example
     * // Create many TradingPositions
     * const tradingPosition = await prisma.tradingPosition.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TradingPositions and only return the `id`
     * const tradingPositionWithIdOnly = await prisma.tradingPosition.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TradingPositionCreateManyAndReturnArgs>(args?: SelectSubset<T, TradingPositionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TradingPosition.
     * @param {TradingPositionDeleteArgs} args - Arguments to delete one TradingPosition.
     * @example
     * // Delete one TradingPosition
     * const TradingPosition = await prisma.tradingPosition.delete({
     *   where: {
     *     // ... filter to delete one TradingPosition
     *   }
     * })
     * 
     */
    delete<T extends TradingPositionDeleteArgs>(args: SelectSubset<T, TradingPositionDeleteArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TradingPosition.
     * @param {TradingPositionUpdateArgs} args - Arguments to update one TradingPosition.
     * @example
     * // Update one TradingPosition
     * const tradingPosition = await prisma.tradingPosition.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TradingPositionUpdateArgs>(args: SelectSubset<T, TradingPositionUpdateArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TradingPositions.
     * @param {TradingPositionDeleteManyArgs} args - Arguments to filter TradingPositions to delete.
     * @example
     * // Delete a few TradingPositions
     * const { count } = await prisma.tradingPosition.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TradingPositionDeleteManyArgs>(args?: SelectSubset<T, TradingPositionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradingPositions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPositionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TradingPositions
     * const tradingPosition = await prisma.tradingPosition.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TradingPositionUpdateManyArgs>(args: SelectSubset<T, TradingPositionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradingPositions and returns the data updated in the database.
     * @param {TradingPositionUpdateManyAndReturnArgs} args - Arguments to update many TradingPositions.
     * @example
     * // Update many TradingPositions
     * const tradingPosition = await prisma.tradingPosition.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TradingPositions and only return the `id`
     * const tradingPositionWithIdOnly = await prisma.tradingPosition.updateManyAndReturn({
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
    updateManyAndReturn<T extends TradingPositionUpdateManyAndReturnArgs>(args: SelectSubset<T, TradingPositionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TradingPosition.
     * @param {TradingPositionUpsertArgs} args - Arguments to update or create a TradingPosition.
     * @example
     * // Update or create a TradingPosition
     * const tradingPosition = await prisma.tradingPosition.upsert({
     *   create: {
     *     // ... data to create a TradingPosition
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TradingPosition we want to update
     *   }
     * })
     */
    upsert<T extends TradingPositionUpsertArgs>(args: SelectSubset<T, TradingPositionUpsertArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TradingPositions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPositionCountArgs} args - Arguments to filter TradingPositions to count.
     * @example
     * // Count the number of TradingPositions
     * const count = await prisma.tradingPosition.count({
     *   where: {
     *     // ... the filter for the TradingPositions we want to count
     *   }
     * })
    **/
    count<T extends TradingPositionCountArgs>(
      args?: Subset<T, TradingPositionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradingPositionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TradingPosition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPositionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TradingPositionAggregateArgs>(args: Subset<T, TradingPositionAggregateArgs>): Prisma.PrismaPromise<GetTradingPositionAggregateType<T>>

    /**
     * Group by TradingPosition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPositionGroupByArgs} args - Group by arguments.
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
      T extends TradingPositionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradingPositionGroupByArgs['orderBy'] }
        : { orderBy?: TradingPositionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TradingPositionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTradingPositionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TradingPosition model
   */
  readonly fields: TradingPositionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TradingPosition.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradingPositionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account<T extends TradingAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TradingAccountDefaultArgs<ExtArgs>>): Prisma__TradingAccountClient<$Result.GetResult<Prisma.$TradingAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the TradingPosition model
   */
  interface TradingPositionFieldRefs {
    readonly id: FieldRef<"TradingPosition", 'String'>
    readonly accountId: FieldRef<"TradingPosition", 'String'>
    readonly symbol: FieldRef<"TradingPosition", 'String'>
    readonly qty: FieldRef<"TradingPosition", 'Float'>
    readonly entryPrice: FieldRef<"TradingPosition", 'Float'>
    readonly marketPrice: FieldRef<"TradingPosition", 'Float'>
    readonly updatedAt: FieldRef<"TradingPosition", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TradingPosition findUnique
   */
  export type TradingPositionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * Filter, which TradingPosition to fetch.
     */
    where: TradingPositionWhereUniqueInput
  }

  /**
   * TradingPosition findUniqueOrThrow
   */
  export type TradingPositionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * Filter, which TradingPosition to fetch.
     */
    where: TradingPositionWhereUniqueInput
  }

  /**
   * TradingPosition findFirst
   */
  export type TradingPositionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * Filter, which TradingPosition to fetch.
     */
    where?: TradingPositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingPositions to fetch.
     */
    orderBy?: TradingPositionOrderByWithRelationInput | TradingPositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradingPositions.
     */
    cursor?: TradingPositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingPositions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingPositions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingPositions.
     */
    distinct?: TradingPositionScalarFieldEnum | TradingPositionScalarFieldEnum[]
  }

  /**
   * TradingPosition findFirstOrThrow
   */
  export type TradingPositionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * Filter, which TradingPosition to fetch.
     */
    where?: TradingPositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingPositions to fetch.
     */
    orderBy?: TradingPositionOrderByWithRelationInput | TradingPositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradingPositions.
     */
    cursor?: TradingPositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingPositions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingPositions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingPositions.
     */
    distinct?: TradingPositionScalarFieldEnum | TradingPositionScalarFieldEnum[]
  }

  /**
   * TradingPosition findMany
   */
  export type TradingPositionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * Filter, which TradingPositions to fetch.
     */
    where?: TradingPositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingPositions to fetch.
     */
    orderBy?: TradingPositionOrderByWithRelationInput | TradingPositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TradingPositions.
     */
    cursor?: TradingPositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingPositions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingPositions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingPositions.
     */
    distinct?: TradingPositionScalarFieldEnum | TradingPositionScalarFieldEnum[]
  }

  /**
   * TradingPosition create
   */
  export type TradingPositionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * The data needed to create a TradingPosition.
     */
    data: XOR<TradingPositionCreateInput, TradingPositionUncheckedCreateInput>
  }

  /**
   * TradingPosition createMany
   */
  export type TradingPositionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TradingPositions.
     */
    data: TradingPositionCreateManyInput | TradingPositionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TradingPosition createManyAndReturn
   */
  export type TradingPositionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * The data used to create many TradingPositions.
     */
    data: TradingPositionCreateManyInput | TradingPositionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradingPosition update
   */
  export type TradingPositionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * The data needed to update a TradingPosition.
     */
    data: XOR<TradingPositionUpdateInput, TradingPositionUncheckedUpdateInput>
    /**
     * Choose, which TradingPosition to update.
     */
    where: TradingPositionWhereUniqueInput
  }

  /**
   * TradingPosition updateMany
   */
  export type TradingPositionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TradingPositions.
     */
    data: XOR<TradingPositionUpdateManyMutationInput, TradingPositionUncheckedUpdateManyInput>
    /**
     * Filter which TradingPositions to update
     */
    where?: TradingPositionWhereInput
    /**
     * Limit how many TradingPositions to update.
     */
    limit?: number
  }

  /**
   * TradingPosition updateManyAndReturn
   */
  export type TradingPositionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * The data used to update TradingPositions.
     */
    data: XOR<TradingPositionUpdateManyMutationInput, TradingPositionUncheckedUpdateManyInput>
    /**
     * Filter which TradingPositions to update
     */
    where?: TradingPositionWhereInput
    /**
     * Limit how many TradingPositions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradingPosition upsert
   */
  export type TradingPositionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * The filter to search for the TradingPosition to update in case it exists.
     */
    where: TradingPositionWhereUniqueInput
    /**
     * In case the TradingPosition found by the `where` argument doesn't exist, create a new TradingPosition with this data.
     */
    create: XOR<TradingPositionCreateInput, TradingPositionUncheckedCreateInput>
    /**
     * In case the TradingPosition was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TradingPositionUpdateInput, TradingPositionUncheckedUpdateInput>
  }

  /**
   * TradingPosition delete
   */
  export type TradingPositionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * Filter which TradingPosition to delete.
     */
    where: TradingPositionWhereUniqueInput
  }

  /**
   * TradingPosition deleteMany
   */
  export type TradingPositionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradingPositions to delete
     */
    where?: TradingPositionWhereInput
    /**
     * Limit how many TradingPositions to delete.
     */
    limit?: number
  }

  /**
   * TradingPosition without action
   */
  export type TradingPositionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
  }


  /**
   * Model SystemSetting
   */

  export type AggregateSystemSetting = {
    _count: SystemSettingCountAggregateOutputType | null
    _min: SystemSettingMinAggregateOutputType | null
    _max: SystemSettingMaxAggregateOutputType | null
  }

  export type SystemSettingMinAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
    updatedAt: Date | null
  }

  export type SystemSettingMaxAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
    updatedAt: Date | null
  }

  export type SystemSettingCountAggregateOutputType = {
    id: number
    key: number
    value: number
    updatedAt: number
    _all: number
  }


  export type SystemSettingMinAggregateInputType = {
    id?: true
    key?: true
    value?: true
    updatedAt?: true
  }

  export type SystemSettingMaxAggregateInputType = {
    id?: true
    key?: true
    value?: true
    updatedAt?: true
  }

  export type SystemSettingCountAggregateInputType = {
    id?: true
    key?: true
    value?: true
    updatedAt?: true
    _all?: true
  }

  export type SystemSettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemSetting to aggregate.
     */
    where?: SystemSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemSettings to fetch.
     */
    orderBy?: SystemSettingOrderByWithRelationInput | SystemSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SystemSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SystemSettings
    **/
    _count?: true | SystemSettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SystemSettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SystemSettingMaxAggregateInputType
  }

  export type GetSystemSettingAggregateType<T extends SystemSettingAggregateArgs> = {
        [P in keyof T & keyof AggregateSystemSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystemSetting[P]>
      : GetScalarType<T[P], AggregateSystemSetting[P]>
  }




  export type SystemSettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SystemSettingWhereInput
    orderBy?: SystemSettingOrderByWithAggregationInput | SystemSettingOrderByWithAggregationInput[]
    by: SystemSettingScalarFieldEnum[] | SystemSettingScalarFieldEnum
    having?: SystemSettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SystemSettingCountAggregateInputType | true
    _min?: SystemSettingMinAggregateInputType
    _max?: SystemSettingMaxAggregateInputType
  }

  export type SystemSettingGroupByOutputType = {
    id: string
    key: string
    value: string
    updatedAt: Date
    _count: SystemSettingCountAggregateOutputType | null
    _min: SystemSettingMinAggregateOutputType | null
    _max: SystemSettingMaxAggregateOutputType | null
  }

  type GetSystemSettingGroupByPayload<T extends SystemSettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SystemSettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SystemSettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SystemSettingGroupByOutputType[P]>
            : GetScalarType<T[P], SystemSettingGroupByOutputType[P]>
        }
      >
    >


  export type SystemSettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemSetting"]>

  export type SystemSettingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemSetting"]>

  export type SystemSettingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemSetting"]>

  export type SystemSettingSelectScalar = {
    id?: boolean
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }

  export type SystemSettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "key" | "value" | "updatedAt", ExtArgs["result"]["systemSetting"]>

  export type $SystemSettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SystemSetting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      key: string
      value: string
      updatedAt: Date
    }, ExtArgs["result"]["systemSetting"]>
    composites: {}
  }

  type SystemSettingGetPayload<S extends boolean | null | undefined | SystemSettingDefaultArgs> = $Result.GetResult<Prisma.$SystemSettingPayload, S>

  type SystemSettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SystemSettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SystemSettingCountAggregateInputType | true
    }

  export interface SystemSettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SystemSetting'], meta: { name: 'SystemSetting' } }
    /**
     * Find zero or one SystemSetting that matches the filter.
     * @param {SystemSettingFindUniqueArgs} args - Arguments to find a SystemSetting
     * @example
     * // Get one SystemSetting
     * const systemSetting = await prisma.systemSetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SystemSettingFindUniqueArgs>(args: SelectSubset<T, SystemSettingFindUniqueArgs<ExtArgs>>): Prisma__SystemSettingClient<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SystemSetting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SystemSettingFindUniqueOrThrowArgs} args - Arguments to find a SystemSetting
     * @example
     * // Get one SystemSetting
     * const systemSetting = await prisma.systemSetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SystemSettingFindUniqueOrThrowArgs>(args: SelectSubset<T, SystemSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SystemSettingClient<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemSetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingFindFirstArgs} args - Arguments to find a SystemSetting
     * @example
     * // Get one SystemSetting
     * const systemSetting = await prisma.systemSetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SystemSettingFindFirstArgs>(args?: SelectSubset<T, SystemSettingFindFirstArgs<ExtArgs>>): Prisma__SystemSettingClient<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemSetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingFindFirstOrThrowArgs} args - Arguments to find a SystemSetting
     * @example
     * // Get one SystemSetting
     * const systemSetting = await prisma.systemSetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SystemSettingFindFirstOrThrowArgs>(args?: SelectSubset<T, SystemSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__SystemSettingClient<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SystemSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SystemSettings
     * const systemSettings = await prisma.systemSetting.findMany()
     * 
     * // Get first 10 SystemSettings
     * const systemSettings = await prisma.systemSetting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const systemSettingWithIdOnly = await prisma.systemSetting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SystemSettingFindManyArgs>(args?: SelectSubset<T, SystemSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SystemSetting.
     * @param {SystemSettingCreateArgs} args - Arguments to create a SystemSetting.
     * @example
     * // Create one SystemSetting
     * const SystemSetting = await prisma.systemSetting.create({
     *   data: {
     *     // ... data to create a SystemSetting
     *   }
     * })
     * 
     */
    create<T extends SystemSettingCreateArgs>(args: SelectSubset<T, SystemSettingCreateArgs<ExtArgs>>): Prisma__SystemSettingClient<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SystemSettings.
     * @param {SystemSettingCreateManyArgs} args - Arguments to create many SystemSettings.
     * @example
     * // Create many SystemSettings
     * const systemSetting = await prisma.systemSetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SystemSettingCreateManyArgs>(args?: SelectSubset<T, SystemSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SystemSettings and returns the data saved in the database.
     * @param {SystemSettingCreateManyAndReturnArgs} args - Arguments to create many SystemSettings.
     * @example
     * // Create many SystemSettings
     * const systemSetting = await prisma.systemSetting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SystemSettings and only return the `id`
     * const systemSettingWithIdOnly = await prisma.systemSetting.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SystemSettingCreateManyAndReturnArgs>(args?: SelectSubset<T, SystemSettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SystemSetting.
     * @param {SystemSettingDeleteArgs} args - Arguments to delete one SystemSetting.
     * @example
     * // Delete one SystemSetting
     * const SystemSetting = await prisma.systemSetting.delete({
     *   where: {
     *     // ... filter to delete one SystemSetting
     *   }
     * })
     * 
     */
    delete<T extends SystemSettingDeleteArgs>(args: SelectSubset<T, SystemSettingDeleteArgs<ExtArgs>>): Prisma__SystemSettingClient<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SystemSetting.
     * @param {SystemSettingUpdateArgs} args - Arguments to update one SystemSetting.
     * @example
     * // Update one SystemSetting
     * const systemSetting = await prisma.systemSetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SystemSettingUpdateArgs>(args: SelectSubset<T, SystemSettingUpdateArgs<ExtArgs>>): Prisma__SystemSettingClient<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SystemSettings.
     * @param {SystemSettingDeleteManyArgs} args - Arguments to filter SystemSettings to delete.
     * @example
     * // Delete a few SystemSettings
     * const { count } = await prisma.systemSetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SystemSettingDeleteManyArgs>(args?: SelectSubset<T, SystemSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SystemSettings
     * const systemSetting = await prisma.systemSetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SystemSettingUpdateManyArgs>(args: SelectSubset<T, SystemSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemSettings and returns the data updated in the database.
     * @param {SystemSettingUpdateManyAndReturnArgs} args - Arguments to update many SystemSettings.
     * @example
     * // Update many SystemSettings
     * const systemSetting = await prisma.systemSetting.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SystemSettings and only return the `id`
     * const systemSettingWithIdOnly = await prisma.systemSetting.updateManyAndReturn({
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
    updateManyAndReturn<T extends SystemSettingUpdateManyAndReturnArgs>(args: SelectSubset<T, SystemSettingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SystemSetting.
     * @param {SystemSettingUpsertArgs} args - Arguments to update or create a SystemSetting.
     * @example
     * // Update or create a SystemSetting
     * const systemSetting = await prisma.systemSetting.upsert({
     *   create: {
     *     // ... data to create a SystemSetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SystemSetting we want to update
     *   }
     * })
     */
    upsert<T extends SystemSettingUpsertArgs>(args: SelectSubset<T, SystemSettingUpsertArgs<ExtArgs>>): Prisma__SystemSettingClient<$Result.GetResult<Prisma.$SystemSettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SystemSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingCountArgs} args - Arguments to filter SystemSettings to count.
     * @example
     * // Count the number of SystemSettings
     * const count = await prisma.systemSetting.count({
     *   where: {
     *     // ... the filter for the SystemSettings we want to count
     *   }
     * })
    **/
    count<T extends SystemSettingCountArgs>(
      args?: Subset<T, SystemSettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SystemSettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SystemSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SystemSettingAggregateArgs>(args: Subset<T, SystemSettingAggregateArgs>): Prisma.PrismaPromise<GetSystemSettingAggregateType<T>>

    /**
     * Group by SystemSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingGroupByArgs} args - Group by arguments.
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
      T extends SystemSettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SystemSettingGroupByArgs['orderBy'] }
        : { orderBy?: SystemSettingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SystemSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SystemSetting model
   */
  readonly fields: SystemSettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SystemSetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SystemSettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the SystemSetting model
   */
  interface SystemSettingFieldRefs {
    readonly id: FieldRef<"SystemSetting", 'String'>
    readonly key: FieldRef<"SystemSetting", 'String'>
    readonly value: FieldRef<"SystemSetting", 'String'>
    readonly updatedAt: FieldRef<"SystemSetting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SystemSetting findUnique
   */
  export type SystemSettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSetting
     */
    omit?: SystemSettingOmit<ExtArgs> | null
    /**
     * Filter, which SystemSetting to fetch.
     */
    where: SystemSettingWhereUniqueInput
  }

  /**
   * SystemSetting findUniqueOrThrow
   */
  export type SystemSettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSetting
     */
    omit?: SystemSettingOmit<ExtArgs> | null
    /**
     * Filter, which SystemSetting to fetch.
     */
    where: SystemSettingWhereUniqueInput
  }

  /**
   * SystemSetting findFirst
   */
  export type SystemSettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSetting
     */
    omit?: SystemSettingOmit<ExtArgs> | null
    /**
     * Filter, which SystemSetting to fetch.
     */
    where?: SystemSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemSettings to fetch.
     */
    orderBy?: SystemSettingOrderByWithRelationInput | SystemSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemSettings.
     */
    cursor?: SystemSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemSettings.
     */
    distinct?: SystemSettingScalarFieldEnum | SystemSettingScalarFieldEnum[]
  }

  /**
   * SystemSetting findFirstOrThrow
   */
  export type SystemSettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSetting
     */
    omit?: SystemSettingOmit<ExtArgs> | null
    /**
     * Filter, which SystemSetting to fetch.
     */
    where?: SystemSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemSettings to fetch.
     */
    orderBy?: SystemSettingOrderByWithRelationInput | SystemSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemSettings.
     */
    cursor?: SystemSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemSettings.
     */
    distinct?: SystemSettingScalarFieldEnum | SystemSettingScalarFieldEnum[]
  }

  /**
   * SystemSetting findMany
   */
  export type SystemSettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSetting
     */
    omit?: SystemSettingOmit<ExtArgs> | null
    /**
     * Filter, which SystemSettings to fetch.
     */
    where?: SystemSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemSettings to fetch.
     */
    orderBy?: SystemSettingOrderByWithRelationInput | SystemSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SystemSettings.
     */
    cursor?: SystemSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemSettings.
     */
    distinct?: SystemSettingScalarFieldEnum | SystemSettingScalarFieldEnum[]
  }

  /**
   * SystemSetting create
   */
  export type SystemSettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSetting
     */
    omit?: SystemSettingOmit<ExtArgs> | null
    /**
     * The data needed to create a SystemSetting.
     */
    data: XOR<SystemSettingCreateInput, SystemSettingUncheckedCreateInput>
  }

  /**
   * SystemSetting createMany
   */
  export type SystemSettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SystemSettings.
     */
    data: SystemSettingCreateManyInput | SystemSettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemSetting createManyAndReturn
   */
  export type SystemSettingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSetting
     */
    omit?: SystemSettingOmit<ExtArgs> | null
    /**
     * The data used to create many SystemSettings.
     */
    data: SystemSettingCreateManyInput | SystemSettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemSetting update
   */
  export type SystemSettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSetting
     */
    omit?: SystemSettingOmit<ExtArgs> | null
    /**
     * The data needed to update a SystemSetting.
     */
    data: XOR<SystemSettingUpdateInput, SystemSettingUncheckedUpdateInput>
    /**
     * Choose, which SystemSetting to update.
     */
    where: SystemSettingWhereUniqueInput
  }

  /**
   * SystemSetting updateMany
   */
  export type SystemSettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SystemSettings.
     */
    data: XOR<SystemSettingUpdateManyMutationInput, SystemSettingUncheckedUpdateManyInput>
    /**
     * Filter which SystemSettings to update
     */
    where?: SystemSettingWhereInput
    /**
     * Limit how many SystemSettings to update.
     */
    limit?: number
  }

  /**
   * SystemSetting updateManyAndReturn
   */
  export type SystemSettingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSetting
     */
    omit?: SystemSettingOmit<ExtArgs> | null
    /**
     * The data used to update SystemSettings.
     */
    data: XOR<SystemSettingUpdateManyMutationInput, SystemSettingUncheckedUpdateManyInput>
    /**
     * Filter which SystemSettings to update
     */
    where?: SystemSettingWhereInput
    /**
     * Limit how many SystemSettings to update.
     */
    limit?: number
  }

  /**
   * SystemSetting upsert
   */
  export type SystemSettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSetting
     */
    omit?: SystemSettingOmit<ExtArgs> | null
    /**
     * The filter to search for the SystemSetting to update in case it exists.
     */
    where: SystemSettingWhereUniqueInput
    /**
     * In case the SystemSetting found by the `where` argument doesn't exist, create a new SystemSetting with this data.
     */
    create: XOR<SystemSettingCreateInput, SystemSettingUncheckedCreateInput>
    /**
     * In case the SystemSetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SystemSettingUpdateInput, SystemSettingUncheckedUpdateInput>
  }

  /**
   * SystemSetting delete
   */
  export type SystemSettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSetting
     */
    omit?: SystemSettingOmit<ExtArgs> | null
    /**
     * Filter which SystemSetting to delete.
     */
    where: SystemSettingWhereUniqueInput
  }

  /**
   * SystemSetting deleteMany
   */
  export type SystemSettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemSettings to delete
     */
    where?: SystemSettingWhereInput
    /**
     * Limit how many SystemSettings to delete.
     */
    limit?: number
  }

  /**
   * SystemSetting without action
   */
  export type SystemSettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSetting
     */
    select?: SystemSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSetting
     */
    omit?: SystemSettingOmit<ExtArgs> | null
  }


  /**
   * Model CustomStrategy
   */

  export type AggregateCustomStrategy = {
    _count: CustomStrategyCountAggregateOutputType | null
    _min: CustomStrategyMinAggregateOutputType | null
    _max: CustomStrategyMaxAggregateOutputType | null
  }

  export type CustomStrategyMinAggregateOutputType = {
    id: string | null
    name: string | null
    baseType: string | null
    interval: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomStrategyMaxAggregateOutputType = {
    id: string | null
    name: string | null
    baseType: string | null
    interval: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomStrategyCountAggregateOutputType = {
    id: number
    name: number
    baseType: number
    parameters: number
    interval: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CustomStrategyMinAggregateInputType = {
    id?: true
    name?: true
    baseType?: true
    interval?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomStrategyMaxAggregateInputType = {
    id?: true
    name?: true
    baseType?: true
    interval?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomStrategyCountAggregateInputType = {
    id?: true
    name?: true
    baseType?: true
    parameters?: true
    interval?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CustomStrategyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomStrategy to aggregate.
     */
    where?: CustomStrategyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomStrategies to fetch.
     */
    orderBy?: CustomStrategyOrderByWithRelationInput | CustomStrategyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomStrategyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomStrategies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomStrategies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CustomStrategies
    **/
    _count?: true | CustomStrategyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomStrategyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomStrategyMaxAggregateInputType
  }

  export type GetCustomStrategyAggregateType<T extends CustomStrategyAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomStrategy]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomStrategy[P]>
      : GetScalarType<T[P], AggregateCustomStrategy[P]>
  }




  export type CustomStrategyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomStrategyWhereInput
    orderBy?: CustomStrategyOrderByWithAggregationInput | CustomStrategyOrderByWithAggregationInput[]
    by: CustomStrategyScalarFieldEnum[] | CustomStrategyScalarFieldEnum
    having?: CustomStrategyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomStrategyCountAggregateInputType | true
    _min?: CustomStrategyMinAggregateInputType
    _max?: CustomStrategyMaxAggregateInputType
  }

  export type CustomStrategyGroupByOutputType = {
    id: string
    name: string
    baseType: string
    parameters: JsonValue
    interval: string
    createdAt: Date
    updatedAt: Date
    _count: CustomStrategyCountAggregateOutputType | null
    _min: CustomStrategyMinAggregateOutputType | null
    _max: CustomStrategyMaxAggregateOutputType | null
  }

  type GetCustomStrategyGroupByPayload<T extends CustomStrategyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomStrategyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomStrategyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomStrategyGroupByOutputType[P]>
            : GetScalarType<T[P], CustomStrategyGroupByOutputType[P]>
        }
      >
    >


  export type CustomStrategySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    baseType?: boolean
    parameters?: boolean
    interval?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    bots?: boolean | CustomStrategy$botsArgs<ExtArgs>
    _count?: boolean | CustomStrategyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customStrategy"]>

  export type CustomStrategySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    baseType?: boolean
    parameters?: boolean
    interval?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["customStrategy"]>

  export type CustomStrategySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    baseType?: boolean
    parameters?: boolean
    interval?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["customStrategy"]>

  export type CustomStrategySelectScalar = {
    id?: boolean
    name?: boolean
    baseType?: boolean
    parameters?: boolean
    interval?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CustomStrategyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "baseType" | "parameters" | "interval" | "createdAt" | "updatedAt", ExtArgs["result"]["customStrategy"]>
  export type CustomStrategyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bots?: boolean | CustomStrategy$botsArgs<ExtArgs>
    _count?: boolean | CustomStrategyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CustomStrategyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CustomStrategyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CustomStrategyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CustomStrategy"
    objects: {
      bots: Prisma.$TradingBotPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      baseType: string
      parameters: Prisma.JsonValue
      interval: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["customStrategy"]>
    composites: {}
  }

  type CustomStrategyGetPayload<S extends boolean | null | undefined | CustomStrategyDefaultArgs> = $Result.GetResult<Prisma.$CustomStrategyPayload, S>

  type CustomStrategyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CustomStrategyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomStrategyCountAggregateInputType | true
    }

  export interface CustomStrategyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CustomStrategy'], meta: { name: 'CustomStrategy' } }
    /**
     * Find zero or one CustomStrategy that matches the filter.
     * @param {CustomStrategyFindUniqueArgs} args - Arguments to find a CustomStrategy
     * @example
     * // Get one CustomStrategy
     * const customStrategy = await prisma.customStrategy.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomStrategyFindUniqueArgs>(args: SelectSubset<T, CustomStrategyFindUniqueArgs<ExtArgs>>): Prisma__CustomStrategyClient<$Result.GetResult<Prisma.$CustomStrategyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CustomStrategy that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomStrategyFindUniqueOrThrowArgs} args - Arguments to find a CustomStrategy
     * @example
     * // Get one CustomStrategy
     * const customStrategy = await prisma.customStrategy.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomStrategyFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomStrategyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomStrategyClient<$Result.GetResult<Prisma.$CustomStrategyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomStrategy that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomStrategyFindFirstArgs} args - Arguments to find a CustomStrategy
     * @example
     * // Get one CustomStrategy
     * const customStrategy = await prisma.customStrategy.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomStrategyFindFirstArgs>(args?: SelectSubset<T, CustomStrategyFindFirstArgs<ExtArgs>>): Prisma__CustomStrategyClient<$Result.GetResult<Prisma.$CustomStrategyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomStrategy that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomStrategyFindFirstOrThrowArgs} args - Arguments to find a CustomStrategy
     * @example
     * // Get one CustomStrategy
     * const customStrategy = await prisma.customStrategy.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomStrategyFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomStrategyFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomStrategyClient<$Result.GetResult<Prisma.$CustomStrategyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CustomStrategies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomStrategyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CustomStrategies
     * const customStrategies = await prisma.customStrategy.findMany()
     * 
     * // Get first 10 CustomStrategies
     * const customStrategies = await prisma.customStrategy.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customStrategyWithIdOnly = await prisma.customStrategy.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomStrategyFindManyArgs>(args?: SelectSubset<T, CustomStrategyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomStrategyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CustomStrategy.
     * @param {CustomStrategyCreateArgs} args - Arguments to create a CustomStrategy.
     * @example
     * // Create one CustomStrategy
     * const CustomStrategy = await prisma.customStrategy.create({
     *   data: {
     *     // ... data to create a CustomStrategy
     *   }
     * })
     * 
     */
    create<T extends CustomStrategyCreateArgs>(args: SelectSubset<T, CustomStrategyCreateArgs<ExtArgs>>): Prisma__CustomStrategyClient<$Result.GetResult<Prisma.$CustomStrategyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CustomStrategies.
     * @param {CustomStrategyCreateManyArgs} args - Arguments to create many CustomStrategies.
     * @example
     * // Create many CustomStrategies
     * const customStrategy = await prisma.customStrategy.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomStrategyCreateManyArgs>(args?: SelectSubset<T, CustomStrategyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CustomStrategies and returns the data saved in the database.
     * @param {CustomStrategyCreateManyAndReturnArgs} args - Arguments to create many CustomStrategies.
     * @example
     * // Create many CustomStrategies
     * const customStrategy = await prisma.customStrategy.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CustomStrategies and only return the `id`
     * const customStrategyWithIdOnly = await prisma.customStrategy.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomStrategyCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomStrategyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomStrategyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CustomStrategy.
     * @param {CustomStrategyDeleteArgs} args - Arguments to delete one CustomStrategy.
     * @example
     * // Delete one CustomStrategy
     * const CustomStrategy = await prisma.customStrategy.delete({
     *   where: {
     *     // ... filter to delete one CustomStrategy
     *   }
     * })
     * 
     */
    delete<T extends CustomStrategyDeleteArgs>(args: SelectSubset<T, CustomStrategyDeleteArgs<ExtArgs>>): Prisma__CustomStrategyClient<$Result.GetResult<Prisma.$CustomStrategyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CustomStrategy.
     * @param {CustomStrategyUpdateArgs} args - Arguments to update one CustomStrategy.
     * @example
     * // Update one CustomStrategy
     * const customStrategy = await prisma.customStrategy.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomStrategyUpdateArgs>(args: SelectSubset<T, CustomStrategyUpdateArgs<ExtArgs>>): Prisma__CustomStrategyClient<$Result.GetResult<Prisma.$CustomStrategyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CustomStrategies.
     * @param {CustomStrategyDeleteManyArgs} args - Arguments to filter CustomStrategies to delete.
     * @example
     * // Delete a few CustomStrategies
     * const { count } = await prisma.customStrategy.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomStrategyDeleteManyArgs>(args?: SelectSubset<T, CustomStrategyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomStrategies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomStrategyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CustomStrategies
     * const customStrategy = await prisma.customStrategy.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomStrategyUpdateManyArgs>(args: SelectSubset<T, CustomStrategyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomStrategies and returns the data updated in the database.
     * @param {CustomStrategyUpdateManyAndReturnArgs} args - Arguments to update many CustomStrategies.
     * @example
     * // Update many CustomStrategies
     * const customStrategy = await prisma.customStrategy.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CustomStrategies and only return the `id`
     * const customStrategyWithIdOnly = await prisma.customStrategy.updateManyAndReturn({
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
    updateManyAndReturn<T extends CustomStrategyUpdateManyAndReturnArgs>(args: SelectSubset<T, CustomStrategyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomStrategyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CustomStrategy.
     * @param {CustomStrategyUpsertArgs} args - Arguments to update or create a CustomStrategy.
     * @example
     * // Update or create a CustomStrategy
     * const customStrategy = await prisma.customStrategy.upsert({
     *   create: {
     *     // ... data to create a CustomStrategy
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CustomStrategy we want to update
     *   }
     * })
     */
    upsert<T extends CustomStrategyUpsertArgs>(args: SelectSubset<T, CustomStrategyUpsertArgs<ExtArgs>>): Prisma__CustomStrategyClient<$Result.GetResult<Prisma.$CustomStrategyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CustomStrategies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomStrategyCountArgs} args - Arguments to filter CustomStrategies to count.
     * @example
     * // Count the number of CustomStrategies
     * const count = await prisma.customStrategy.count({
     *   where: {
     *     // ... the filter for the CustomStrategies we want to count
     *   }
     * })
    **/
    count<T extends CustomStrategyCountArgs>(
      args?: Subset<T, CustomStrategyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomStrategyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CustomStrategy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomStrategyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CustomStrategyAggregateArgs>(args: Subset<T, CustomStrategyAggregateArgs>): Prisma.PrismaPromise<GetCustomStrategyAggregateType<T>>

    /**
     * Group by CustomStrategy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomStrategyGroupByArgs} args - Group by arguments.
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
      T extends CustomStrategyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomStrategyGroupByArgs['orderBy'] }
        : { orderBy?: CustomStrategyGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CustomStrategyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomStrategyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CustomStrategy model
   */
  readonly fields: CustomStrategyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CustomStrategy.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomStrategyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bots<T extends CustomStrategy$botsArgs<ExtArgs> = {}>(args?: Subset<T, CustomStrategy$botsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingBotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the CustomStrategy model
   */
  interface CustomStrategyFieldRefs {
    readonly id: FieldRef<"CustomStrategy", 'String'>
    readonly name: FieldRef<"CustomStrategy", 'String'>
    readonly baseType: FieldRef<"CustomStrategy", 'String'>
    readonly parameters: FieldRef<"CustomStrategy", 'Json'>
    readonly interval: FieldRef<"CustomStrategy", 'String'>
    readonly createdAt: FieldRef<"CustomStrategy", 'DateTime'>
    readonly updatedAt: FieldRef<"CustomStrategy", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CustomStrategy findUnique
   */
  export type CustomStrategyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomStrategy
     */
    select?: CustomStrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomStrategy
     */
    omit?: CustomStrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomStrategyInclude<ExtArgs> | null
    /**
     * Filter, which CustomStrategy to fetch.
     */
    where: CustomStrategyWhereUniqueInput
  }

  /**
   * CustomStrategy findUniqueOrThrow
   */
  export type CustomStrategyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomStrategy
     */
    select?: CustomStrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomStrategy
     */
    omit?: CustomStrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomStrategyInclude<ExtArgs> | null
    /**
     * Filter, which CustomStrategy to fetch.
     */
    where: CustomStrategyWhereUniqueInput
  }

  /**
   * CustomStrategy findFirst
   */
  export type CustomStrategyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomStrategy
     */
    select?: CustomStrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomStrategy
     */
    omit?: CustomStrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomStrategyInclude<ExtArgs> | null
    /**
     * Filter, which CustomStrategy to fetch.
     */
    where?: CustomStrategyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomStrategies to fetch.
     */
    orderBy?: CustomStrategyOrderByWithRelationInput | CustomStrategyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomStrategies.
     */
    cursor?: CustomStrategyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomStrategies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomStrategies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomStrategies.
     */
    distinct?: CustomStrategyScalarFieldEnum | CustomStrategyScalarFieldEnum[]
  }

  /**
   * CustomStrategy findFirstOrThrow
   */
  export type CustomStrategyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomStrategy
     */
    select?: CustomStrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomStrategy
     */
    omit?: CustomStrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomStrategyInclude<ExtArgs> | null
    /**
     * Filter, which CustomStrategy to fetch.
     */
    where?: CustomStrategyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomStrategies to fetch.
     */
    orderBy?: CustomStrategyOrderByWithRelationInput | CustomStrategyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomStrategies.
     */
    cursor?: CustomStrategyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomStrategies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomStrategies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomStrategies.
     */
    distinct?: CustomStrategyScalarFieldEnum | CustomStrategyScalarFieldEnum[]
  }

  /**
   * CustomStrategy findMany
   */
  export type CustomStrategyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomStrategy
     */
    select?: CustomStrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomStrategy
     */
    omit?: CustomStrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomStrategyInclude<ExtArgs> | null
    /**
     * Filter, which CustomStrategies to fetch.
     */
    where?: CustomStrategyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomStrategies to fetch.
     */
    orderBy?: CustomStrategyOrderByWithRelationInput | CustomStrategyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CustomStrategies.
     */
    cursor?: CustomStrategyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomStrategies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomStrategies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomStrategies.
     */
    distinct?: CustomStrategyScalarFieldEnum | CustomStrategyScalarFieldEnum[]
  }

  /**
   * CustomStrategy create
   */
  export type CustomStrategyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomStrategy
     */
    select?: CustomStrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomStrategy
     */
    omit?: CustomStrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomStrategyInclude<ExtArgs> | null
    /**
     * The data needed to create a CustomStrategy.
     */
    data: XOR<CustomStrategyCreateInput, CustomStrategyUncheckedCreateInput>
  }

  /**
   * CustomStrategy createMany
   */
  export type CustomStrategyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CustomStrategies.
     */
    data: CustomStrategyCreateManyInput | CustomStrategyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CustomStrategy createManyAndReturn
   */
  export type CustomStrategyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomStrategy
     */
    select?: CustomStrategySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CustomStrategy
     */
    omit?: CustomStrategyOmit<ExtArgs> | null
    /**
     * The data used to create many CustomStrategies.
     */
    data: CustomStrategyCreateManyInput | CustomStrategyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CustomStrategy update
   */
  export type CustomStrategyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomStrategy
     */
    select?: CustomStrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomStrategy
     */
    omit?: CustomStrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomStrategyInclude<ExtArgs> | null
    /**
     * The data needed to update a CustomStrategy.
     */
    data: XOR<CustomStrategyUpdateInput, CustomStrategyUncheckedUpdateInput>
    /**
     * Choose, which CustomStrategy to update.
     */
    where: CustomStrategyWhereUniqueInput
  }

  /**
   * CustomStrategy updateMany
   */
  export type CustomStrategyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CustomStrategies.
     */
    data: XOR<CustomStrategyUpdateManyMutationInput, CustomStrategyUncheckedUpdateManyInput>
    /**
     * Filter which CustomStrategies to update
     */
    where?: CustomStrategyWhereInput
    /**
     * Limit how many CustomStrategies to update.
     */
    limit?: number
  }

  /**
   * CustomStrategy updateManyAndReturn
   */
  export type CustomStrategyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomStrategy
     */
    select?: CustomStrategySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CustomStrategy
     */
    omit?: CustomStrategyOmit<ExtArgs> | null
    /**
     * The data used to update CustomStrategies.
     */
    data: XOR<CustomStrategyUpdateManyMutationInput, CustomStrategyUncheckedUpdateManyInput>
    /**
     * Filter which CustomStrategies to update
     */
    where?: CustomStrategyWhereInput
    /**
     * Limit how many CustomStrategies to update.
     */
    limit?: number
  }

  /**
   * CustomStrategy upsert
   */
  export type CustomStrategyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomStrategy
     */
    select?: CustomStrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomStrategy
     */
    omit?: CustomStrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomStrategyInclude<ExtArgs> | null
    /**
     * The filter to search for the CustomStrategy to update in case it exists.
     */
    where: CustomStrategyWhereUniqueInput
    /**
     * In case the CustomStrategy found by the `where` argument doesn't exist, create a new CustomStrategy with this data.
     */
    create: XOR<CustomStrategyCreateInput, CustomStrategyUncheckedCreateInput>
    /**
     * In case the CustomStrategy was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomStrategyUpdateInput, CustomStrategyUncheckedUpdateInput>
  }

  /**
   * CustomStrategy delete
   */
  export type CustomStrategyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomStrategy
     */
    select?: CustomStrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomStrategy
     */
    omit?: CustomStrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomStrategyInclude<ExtArgs> | null
    /**
     * Filter which CustomStrategy to delete.
     */
    where: CustomStrategyWhereUniqueInput
  }

  /**
   * CustomStrategy deleteMany
   */
  export type CustomStrategyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomStrategies to delete
     */
    where?: CustomStrategyWhereInput
    /**
     * Limit how many CustomStrategies to delete.
     */
    limit?: number
  }

  /**
   * CustomStrategy.bots
   */
  export type CustomStrategy$botsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingBot
     */
    select?: TradingBotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingBot
     */
    omit?: TradingBotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingBotInclude<ExtArgs> | null
    where?: TradingBotWhereInput
    orderBy?: TradingBotOrderByWithRelationInput | TradingBotOrderByWithRelationInput[]
    cursor?: TradingBotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradingBotScalarFieldEnum | TradingBotScalarFieldEnum[]
  }

  /**
   * CustomStrategy without action
   */
  export type CustomStrategyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomStrategy
     */
    select?: CustomStrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomStrategy
     */
    omit?: CustomStrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomStrategyInclude<ExtArgs> | null
  }


  /**
   * Model TradingBot
   */

  export type AggregateTradingBot = {
    _count: TradingBotCountAggregateOutputType | null
    _min: TradingBotMinAggregateOutputType | null
    _max: TradingBotMaxAggregateOutputType | null
  }

  export type TradingBotMinAggregateOutputType = {
    id: string | null
    name: string | null
    strategy: string | null
    customStrategyId: string | null
    symbol: string | null
    active: boolean | null
    allocationSessionId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TradingBotMaxAggregateOutputType = {
    id: string | null
    name: string | null
    strategy: string | null
    customStrategyId: string | null
    symbol: string | null
    active: boolean | null
    allocationSessionId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TradingBotCountAggregateOutputType = {
    id: number
    name: number
    strategy: number
    customStrategyId: number
    parameters: number
    symbol: number
    active: number
    allocationSessionId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TradingBotMinAggregateInputType = {
    id?: true
    name?: true
    strategy?: true
    customStrategyId?: true
    symbol?: true
    active?: true
    allocationSessionId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TradingBotMaxAggregateInputType = {
    id?: true
    name?: true
    strategy?: true
    customStrategyId?: true
    symbol?: true
    active?: true
    allocationSessionId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TradingBotCountAggregateInputType = {
    id?: true
    name?: true
    strategy?: true
    customStrategyId?: true
    parameters?: true
    symbol?: true
    active?: true
    allocationSessionId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TradingBotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradingBot to aggregate.
     */
    where?: TradingBotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingBots to fetch.
     */
    orderBy?: TradingBotOrderByWithRelationInput | TradingBotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TradingBotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingBots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingBots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TradingBots
    **/
    _count?: true | TradingBotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TradingBotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TradingBotMaxAggregateInputType
  }

  export type GetTradingBotAggregateType<T extends TradingBotAggregateArgs> = {
        [P in keyof T & keyof AggregateTradingBot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTradingBot[P]>
      : GetScalarType<T[P], AggregateTradingBot[P]>
  }




  export type TradingBotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradingBotWhereInput
    orderBy?: TradingBotOrderByWithAggregationInput | TradingBotOrderByWithAggregationInput[]
    by: TradingBotScalarFieldEnum[] | TradingBotScalarFieldEnum
    having?: TradingBotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TradingBotCountAggregateInputType | true
    _min?: TradingBotMinAggregateInputType
    _max?: TradingBotMaxAggregateInputType
  }

  export type TradingBotGroupByOutputType = {
    id: string
    name: string
    strategy: string
    customStrategyId: string | null
    parameters: JsonValue
    symbol: string
    active: boolean
    allocationSessionId: string | null
    createdAt: Date
    updatedAt: Date
    _count: TradingBotCountAggregateOutputType | null
    _min: TradingBotMinAggregateOutputType | null
    _max: TradingBotMaxAggregateOutputType | null
  }

  type GetTradingBotGroupByPayload<T extends TradingBotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradingBotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TradingBotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TradingBotGroupByOutputType[P]>
            : GetScalarType<T[P], TradingBotGroupByOutputType[P]>
        }
      >
    >


  export type TradingBotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    strategy?: boolean
    customStrategyId?: boolean
    parameters?: boolean
    symbol?: boolean
    active?: boolean
    allocationSessionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customStrategy?: boolean | TradingBot$customStrategyArgs<ExtArgs>
    allocationSession?: boolean | TradingBot$allocationSessionArgs<ExtArgs>
  }, ExtArgs["result"]["tradingBot"]>

  export type TradingBotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    strategy?: boolean
    customStrategyId?: boolean
    parameters?: boolean
    symbol?: boolean
    active?: boolean
    allocationSessionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customStrategy?: boolean | TradingBot$customStrategyArgs<ExtArgs>
    allocationSession?: boolean | TradingBot$allocationSessionArgs<ExtArgs>
  }, ExtArgs["result"]["tradingBot"]>

  export type TradingBotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    strategy?: boolean
    customStrategyId?: boolean
    parameters?: boolean
    symbol?: boolean
    active?: boolean
    allocationSessionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customStrategy?: boolean | TradingBot$customStrategyArgs<ExtArgs>
    allocationSession?: boolean | TradingBot$allocationSessionArgs<ExtArgs>
  }, ExtArgs["result"]["tradingBot"]>

  export type TradingBotSelectScalar = {
    id?: boolean
    name?: boolean
    strategy?: boolean
    customStrategyId?: boolean
    parameters?: boolean
    symbol?: boolean
    active?: boolean
    allocationSessionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TradingBotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "strategy" | "customStrategyId" | "parameters" | "symbol" | "active" | "allocationSessionId" | "createdAt" | "updatedAt", ExtArgs["result"]["tradingBot"]>
  export type TradingBotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customStrategy?: boolean | TradingBot$customStrategyArgs<ExtArgs>
    allocationSession?: boolean | TradingBot$allocationSessionArgs<ExtArgs>
  }
  export type TradingBotIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customStrategy?: boolean | TradingBot$customStrategyArgs<ExtArgs>
    allocationSession?: boolean | TradingBot$allocationSessionArgs<ExtArgs>
  }
  export type TradingBotIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customStrategy?: boolean | TradingBot$customStrategyArgs<ExtArgs>
    allocationSession?: boolean | TradingBot$allocationSessionArgs<ExtArgs>
  }

  export type $TradingBotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TradingBot"
    objects: {
      customStrategy: Prisma.$CustomStrategyPayload<ExtArgs> | null
      allocationSession: Prisma.$AllocationSessionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      strategy: string
      customStrategyId: string | null
      parameters: Prisma.JsonValue
      symbol: string
      active: boolean
      allocationSessionId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tradingBot"]>
    composites: {}
  }

  type TradingBotGetPayload<S extends boolean | null | undefined | TradingBotDefaultArgs> = $Result.GetResult<Prisma.$TradingBotPayload, S>

  type TradingBotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TradingBotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TradingBotCountAggregateInputType | true
    }

  export interface TradingBotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TradingBot'], meta: { name: 'TradingBot' } }
    /**
     * Find zero or one TradingBot that matches the filter.
     * @param {TradingBotFindUniqueArgs} args - Arguments to find a TradingBot
     * @example
     * // Get one TradingBot
     * const tradingBot = await prisma.tradingBot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TradingBotFindUniqueArgs>(args: SelectSubset<T, TradingBotFindUniqueArgs<ExtArgs>>): Prisma__TradingBotClient<$Result.GetResult<Prisma.$TradingBotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TradingBot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TradingBotFindUniqueOrThrowArgs} args - Arguments to find a TradingBot
     * @example
     * // Get one TradingBot
     * const tradingBot = await prisma.tradingBot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TradingBotFindUniqueOrThrowArgs>(args: SelectSubset<T, TradingBotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TradingBotClient<$Result.GetResult<Prisma.$TradingBotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradingBot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingBotFindFirstArgs} args - Arguments to find a TradingBot
     * @example
     * // Get one TradingBot
     * const tradingBot = await prisma.tradingBot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TradingBotFindFirstArgs>(args?: SelectSubset<T, TradingBotFindFirstArgs<ExtArgs>>): Prisma__TradingBotClient<$Result.GetResult<Prisma.$TradingBotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradingBot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingBotFindFirstOrThrowArgs} args - Arguments to find a TradingBot
     * @example
     * // Get one TradingBot
     * const tradingBot = await prisma.tradingBot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TradingBotFindFirstOrThrowArgs>(args?: SelectSubset<T, TradingBotFindFirstOrThrowArgs<ExtArgs>>): Prisma__TradingBotClient<$Result.GetResult<Prisma.$TradingBotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TradingBots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingBotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TradingBots
     * const tradingBots = await prisma.tradingBot.findMany()
     * 
     * // Get first 10 TradingBots
     * const tradingBots = await prisma.tradingBot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tradingBotWithIdOnly = await prisma.tradingBot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TradingBotFindManyArgs>(args?: SelectSubset<T, TradingBotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingBotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TradingBot.
     * @param {TradingBotCreateArgs} args - Arguments to create a TradingBot.
     * @example
     * // Create one TradingBot
     * const TradingBot = await prisma.tradingBot.create({
     *   data: {
     *     // ... data to create a TradingBot
     *   }
     * })
     * 
     */
    create<T extends TradingBotCreateArgs>(args: SelectSubset<T, TradingBotCreateArgs<ExtArgs>>): Prisma__TradingBotClient<$Result.GetResult<Prisma.$TradingBotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TradingBots.
     * @param {TradingBotCreateManyArgs} args - Arguments to create many TradingBots.
     * @example
     * // Create many TradingBots
     * const tradingBot = await prisma.tradingBot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TradingBotCreateManyArgs>(args?: SelectSubset<T, TradingBotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TradingBots and returns the data saved in the database.
     * @param {TradingBotCreateManyAndReturnArgs} args - Arguments to create many TradingBots.
     * @example
     * // Create many TradingBots
     * const tradingBot = await prisma.tradingBot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TradingBots and only return the `id`
     * const tradingBotWithIdOnly = await prisma.tradingBot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TradingBotCreateManyAndReturnArgs>(args?: SelectSubset<T, TradingBotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingBotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TradingBot.
     * @param {TradingBotDeleteArgs} args - Arguments to delete one TradingBot.
     * @example
     * // Delete one TradingBot
     * const TradingBot = await prisma.tradingBot.delete({
     *   where: {
     *     // ... filter to delete one TradingBot
     *   }
     * })
     * 
     */
    delete<T extends TradingBotDeleteArgs>(args: SelectSubset<T, TradingBotDeleteArgs<ExtArgs>>): Prisma__TradingBotClient<$Result.GetResult<Prisma.$TradingBotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TradingBot.
     * @param {TradingBotUpdateArgs} args - Arguments to update one TradingBot.
     * @example
     * // Update one TradingBot
     * const tradingBot = await prisma.tradingBot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TradingBotUpdateArgs>(args: SelectSubset<T, TradingBotUpdateArgs<ExtArgs>>): Prisma__TradingBotClient<$Result.GetResult<Prisma.$TradingBotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TradingBots.
     * @param {TradingBotDeleteManyArgs} args - Arguments to filter TradingBots to delete.
     * @example
     * // Delete a few TradingBots
     * const { count } = await prisma.tradingBot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TradingBotDeleteManyArgs>(args?: SelectSubset<T, TradingBotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradingBots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingBotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TradingBots
     * const tradingBot = await prisma.tradingBot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TradingBotUpdateManyArgs>(args: SelectSubset<T, TradingBotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradingBots and returns the data updated in the database.
     * @param {TradingBotUpdateManyAndReturnArgs} args - Arguments to update many TradingBots.
     * @example
     * // Update many TradingBots
     * const tradingBot = await prisma.tradingBot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TradingBots and only return the `id`
     * const tradingBotWithIdOnly = await prisma.tradingBot.updateManyAndReturn({
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
    updateManyAndReturn<T extends TradingBotUpdateManyAndReturnArgs>(args: SelectSubset<T, TradingBotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingBotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TradingBot.
     * @param {TradingBotUpsertArgs} args - Arguments to update or create a TradingBot.
     * @example
     * // Update or create a TradingBot
     * const tradingBot = await prisma.tradingBot.upsert({
     *   create: {
     *     // ... data to create a TradingBot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TradingBot we want to update
     *   }
     * })
     */
    upsert<T extends TradingBotUpsertArgs>(args: SelectSubset<T, TradingBotUpsertArgs<ExtArgs>>): Prisma__TradingBotClient<$Result.GetResult<Prisma.$TradingBotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TradingBots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingBotCountArgs} args - Arguments to filter TradingBots to count.
     * @example
     * // Count the number of TradingBots
     * const count = await prisma.tradingBot.count({
     *   where: {
     *     // ... the filter for the TradingBots we want to count
     *   }
     * })
    **/
    count<T extends TradingBotCountArgs>(
      args?: Subset<T, TradingBotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradingBotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TradingBot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingBotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TradingBotAggregateArgs>(args: Subset<T, TradingBotAggregateArgs>): Prisma.PrismaPromise<GetTradingBotAggregateType<T>>

    /**
     * Group by TradingBot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingBotGroupByArgs} args - Group by arguments.
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
      T extends TradingBotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradingBotGroupByArgs['orderBy'] }
        : { orderBy?: TradingBotGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TradingBotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTradingBotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TradingBot model
   */
  readonly fields: TradingBotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TradingBot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradingBotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customStrategy<T extends TradingBot$customStrategyArgs<ExtArgs> = {}>(args?: Subset<T, TradingBot$customStrategyArgs<ExtArgs>>): Prisma__CustomStrategyClient<$Result.GetResult<Prisma.$CustomStrategyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    allocationSession<T extends TradingBot$allocationSessionArgs<ExtArgs> = {}>(args?: Subset<T, TradingBot$allocationSessionArgs<ExtArgs>>): Prisma__AllocationSessionClient<$Result.GetResult<Prisma.$AllocationSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the TradingBot model
   */
  interface TradingBotFieldRefs {
    readonly id: FieldRef<"TradingBot", 'String'>
    readonly name: FieldRef<"TradingBot", 'String'>
    readonly strategy: FieldRef<"TradingBot", 'String'>
    readonly customStrategyId: FieldRef<"TradingBot", 'String'>
    readonly parameters: FieldRef<"TradingBot", 'Json'>
    readonly symbol: FieldRef<"TradingBot", 'String'>
    readonly active: FieldRef<"TradingBot", 'Boolean'>
    readonly allocationSessionId: FieldRef<"TradingBot", 'String'>
    readonly createdAt: FieldRef<"TradingBot", 'DateTime'>
    readonly updatedAt: FieldRef<"TradingBot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TradingBot findUnique
   */
  export type TradingBotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingBot
     */
    select?: TradingBotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingBot
     */
    omit?: TradingBotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingBotInclude<ExtArgs> | null
    /**
     * Filter, which TradingBot to fetch.
     */
    where: TradingBotWhereUniqueInput
  }

  /**
   * TradingBot findUniqueOrThrow
   */
  export type TradingBotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingBot
     */
    select?: TradingBotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingBot
     */
    omit?: TradingBotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingBotInclude<ExtArgs> | null
    /**
     * Filter, which TradingBot to fetch.
     */
    where: TradingBotWhereUniqueInput
  }

  /**
   * TradingBot findFirst
   */
  export type TradingBotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingBot
     */
    select?: TradingBotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingBot
     */
    omit?: TradingBotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingBotInclude<ExtArgs> | null
    /**
     * Filter, which TradingBot to fetch.
     */
    where?: TradingBotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingBots to fetch.
     */
    orderBy?: TradingBotOrderByWithRelationInput | TradingBotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradingBots.
     */
    cursor?: TradingBotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingBots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingBots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingBots.
     */
    distinct?: TradingBotScalarFieldEnum | TradingBotScalarFieldEnum[]
  }

  /**
   * TradingBot findFirstOrThrow
   */
  export type TradingBotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingBot
     */
    select?: TradingBotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingBot
     */
    omit?: TradingBotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingBotInclude<ExtArgs> | null
    /**
     * Filter, which TradingBot to fetch.
     */
    where?: TradingBotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingBots to fetch.
     */
    orderBy?: TradingBotOrderByWithRelationInput | TradingBotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradingBots.
     */
    cursor?: TradingBotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingBots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingBots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingBots.
     */
    distinct?: TradingBotScalarFieldEnum | TradingBotScalarFieldEnum[]
  }

  /**
   * TradingBot findMany
   */
  export type TradingBotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingBot
     */
    select?: TradingBotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingBot
     */
    omit?: TradingBotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingBotInclude<ExtArgs> | null
    /**
     * Filter, which TradingBots to fetch.
     */
    where?: TradingBotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingBots to fetch.
     */
    orderBy?: TradingBotOrderByWithRelationInput | TradingBotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TradingBots.
     */
    cursor?: TradingBotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingBots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingBots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingBots.
     */
    distinct?: TradingBotScalarFieldEnum | TradingBotScalarFieldEnum[]
  }

  /**
   * TradingBot create
   */
  export type TradingBotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingBot
     */
    select?: TradingBotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingBot
     */
    omit?: TradingBotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingBotInclude<ExtArgs> | null
    /**
     * The data needed to create a TradingBot.
     */
    data: XOR<TradingBotCreateInput, TradingBotUncheckedCreateInput>
  }

  /**
   * TradingBot createMany
   */
  export type TradingBotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TradingBots.
     */
    data: TradingBotCreateManyInput | TradingBotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TradingBot createManyAndReturn
   */
  export type TradingBotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingBot
     */
    select?: TradingBotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradingBot
     */
    omit?: TradingBotOmit<ExtArgs> | null
    /**
     * The data used to create many TradingBots.
     */
    data: TradingBotCreateManyInput | TradingBotCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingBotIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradingBot update
   */
  export type TradingBotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingBot
     */
    select?: TradingBotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingBot
     */
    omit?: TradingBotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingBotInclude<ExtArgs> | null
    /**
     * The data needed to update a TradingBot.
     */
    data: XOR<TradingBotUpdateInput, TradingBotUncheckedUpdateInput>
    /**
     * Choose, which TradingBot to update.
     */
    where: TradingBotWhereUniqueInput
  }

  /**
   * TradingBot updateMany
   */
  export type TradingBotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TradingBots.
     */
    data: XOR<TradingBotUpdateManyMutationInput, TradingBotUncheckedUpdateManyInput>
    /**
     * Filter which TradingBots to update
     */
    where?: TradingBotWhereInput
    /**
     * Limit how many TradingBots to update.
     */
    limit?: number
  }

  /**
   * TradingBot updateManyAndReturn
   */
  export type TradingBotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingBot
     */
    select?: TradingBotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradingBot
     */
    omit?: TradingBotOmit<ExtArgs> | null
    /**
     * The data used to update TradingBots.
     */
    data: XOR<TradingBotUpdateManyMutationInput, TradingBotUncheckedUpdateManyInput>
    /**
     * Filter which TradingBots to update
     */
    where?: TradingBotWhereInput
    /**
     * Limit how many TradingBots to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingBotIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradingBot upsert
   */
  export type TradingBotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingBot
     */
    select?: TradingBotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingBot
     */
    omit?: TradingBotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingBotInclude<ExtArgs> | null
    /**
     * The filter to search for the TradingBot to update in case it exists.
     */
    where: TradingBotWhereUniqueInput
    /**
     * In case the TradingBot found by the `where` argument doesn't exist, create a new TradingBot with this data.
     */
    create: XOR<TradingBotCreateInput, TradingBotUncheckedCreateInput>
    /**
     * In case the TradingBot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TradingBotUpdateInput, TradingBotUncheckedUpdateInput>
  }

  /**
   * TradingBot delete
   */
  export type TradingBotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingBot
     */
    select?: TradingBotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingBot
     */
    omit?: TradingBotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingBotInclude<ExtArgs> | null
    /**
     * Filter which TradingBot to delete.
     */
    where: TradingBotWhereUniqueInput
  }

  /**
   * TradingBot deleteMany
   */
  export type TradingBotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradingBots to delete
     */
    where?: TradingBotWhereInput
    /**
     * Limit how many TradingBots to delete.
     */
    limit?: number
  }

  /**
   * TradingBot.customStrategy
   */
  export type TradingBot$customStrategyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomStrategy
     */
    select?: CustomStrategySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomStrategy
     */
    omit?: CustomStrategyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomStrategyInclude<ExtArgs> | null
    where?: CustomStrategyWhereInput
  }

  /**
   * TradingBot.allocationSession
   */
  export type TradingBot$allocationSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllocationSession
     */
    select?: AllocationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AllocationSession
     */
    omit?: AllocationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllocationSessionInclude<ExtArgs> | null
    where?: AllocationSessionWhereInput
  }

  /**
   * TradingBot without action
   */
  export type TradingBotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingBot
     */
    select?: TradingBotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingBot
     */
    omit?: TradingBotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingBotInclude<ExtArgs> | null
  }


  /**
   * Model AllocationSession
   */

  export type AggregateAllocationSession = {
    _count: AllocationSessionCountAggregateOutputType | null
    _avg: AllocationSessionAvgAggregateOutputType | null
    _sum: AllocationSessionSumAggregateOutputType | null
    _min: AllocationSessionMinAggregateOutputType | null
    _max: AllocationSessionMaxAggregateOutputType | null
  }

  export type AllocationSessionAvgAggregateOutputType = {
    capital: number | null
    virtualCash: number | null
    maxDrawdownPct: number | null
  }

  export type AllocationSessionSumAggregateOutputType = {
    capital: number | null
    virtualCash: number | null
    maxDrawdownPct: number | null
  }

  export type AllocationSessionMinAggregateOutputType = {
    id: string | null
    name: string | null
    capital: number | null
    virtualCash: number | null
    maxDrawdownPct: number | null
    provider: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AllocationSessionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    capital: number | null
    virtualCash: number | null
    maxDrawdownPct: number | null
    provider: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AllocationSessionCountAggregateOutputType = {
    id: number
    name: number
    capital: number
    virtualCash: number
    maxDrawdownPct: number
    enabledMarkets: number
    provider: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AllocationSessionAvgAggregateInputType = {
    capital?: true
    virtualCash?: true
    maxDrawdownPct?: true
  }

  export type AllocationSessionSumAggregateInputType = {
    capital?: true
    virtualCash?: true
    maxDrawdownPct?: true
  }

  export type AllocationSessionMinAggregateInputType = {
    id?: true
    name?: true
    capital?: true
    virtualCash?: true
    maxDrawdownPct?: true
    provider?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AllocationSessionMaxAggregateInputType = {
    id?: true
    name?: true
    capital?: true
    virtualCash?: true
    maxDrawdownPct?: true
    provider?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AllocationSessionCountAggregateInputType = {
    id?: true
    name?: true
    capital?: true
    virtualCash?: true
    maxDrawdownPct?: true
    enabledMarkets?: true
    provider?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AllocationSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AllocationSession to aggregate.
     */
    where?: AllocationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AllocationSessions to fetch.
     */
    orderBy?: AllocationSessionOrderByWithRelationInput | AllocationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AllocationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AllocationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AllocationSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AllocationSessions
    **/
    _count?: true | AllocationSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AllocationSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AllocationSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AllocationSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AllocationSessionMaxAggregateInputType
  }

  export type GetAllocationSessionAggregateType<T extends AllocationSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateAllocationSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAllocationSession[P]>
      : GetScalarType<T[P], AggregateAllocationSession[P]>
  }




  export type AllocationSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AllocationSessionWhereInput
    orderBy?: AllocationSessionOrderByWithAggregationInput | AllocationSessionOrderByWithAggregationInput[]
    by: AllocationSessionScalarFieldEnum[] | AllocationSessionScalarFieldEnum
    having?: AllocationSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AllocationSessionCountAggregateInputType | true
    _avg?: AllocationSessionAvgAggregateInputType
    _sum?: AllocationSessionSumAggregateInputType
    _min?: AllocationSessionMinAggregateInputType
    _max?: AllocationSessionMaxAggregateInputType
  }

  export type AllocationSessionGroupByOutputType = {
    id: string
    name: string
    capital: number
    virtualCash: number
    maxDrawdownPct: number
    enabledMarkets: JsonValue
    provider: string
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: AllocationSessionCountAggregateOutputType | null
    _avg: AllocationSessionAvgAggregateOutputType | null
    _sum: AllocationSessionSumAggregateOutputType | null
    _min: AllocationSessionMinAggregateOutputType | null
    _max: AllocationSessionMaxAggregateOutputType | null
  }

  type GetAllocationSessionGroupByPayload<T extends AllocationSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AllocationSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AllocationSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AllocationSessionGroupByOutputType[P]>
            : GetScalarType<T[P], AllocationSessionGroupByOutputType[P]>
        }
      >
    >


  export type AllocationSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    capital?: boolean
    virtualCash?: boolean
    maxDrawdownPct?: boolean
    enabledMarkets?: boolean
    provider?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    bots?: boolean | AllocationSession$botsArgs<ExtArgs>
    _count?: boolean | AllocationSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["allocationSession"]>

  export type AllocationSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    capital?: boolean
    virtualCash?: boolean
    maxDrawdownPct?: boolean
    enabledMarkets?: boolean
    provider?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["allocationSession"]>

  export type AllocationSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    capital?: boolean
    virtualCash?: boolean
    maxDrawdownPct?: boolean
    enabledMarkets?: boolean
    provider?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["allocationSession"]>

  export type AllocationSessionSelectScalar = {
    id?: boolean
    name?: boolean
    capital?: boolean
    virtualCash?: boolean
    maxDrawdownPct?: boolean
    enabledMarkets?: boolean
    provider?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AllocationSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "capital" | "virtualCash" | "maxDrawdownPct" | "enabledMarkets" | "provider" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["allocationSession"]>
  export type AllocationSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bots?: boolean | AllocationSession$botsArgs<ExtArgs>
    _count?: boolean | AllocationSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AllocationSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AllocationSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AllocationSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AllocationSession"
    objects: {
      bots: Prisma.$TradingBotPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      capital: number
      virtualCash: number
      maxDrawdownPct: number
      enabledMarkets: Prisma.JsonValue
      provider: string
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["allocationSession"]>
    composites: {}
  }

  type AllocationSessionGetPayload<S extends boolean | null | undefined | AllocationSessionDefaultArgs> = $Result.GetResult<Prisma.$AllocationSessionPayload, S>

  type AllocationSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AllocationSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AllocationSessionCountAggregateInputType | true
    }

  export interface AllocationSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AllocationSession'], meta: { name: 'AllocationSession' } }
    /**
     * Find zero or one AllocationSession that matches the filter.
     * @param {AllocationSessionFindUniqueArgs} args - Arguments to find a AllocationSession
     * @example
     * // Get one AllocationSession
     * const allocationSession = await prisma.allocationSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AllocationSessionFindUniqueArgs>(args: SelectSubset<T, AllocationSessionFindUniqueArgs<ExtArgs>>): Prisma__AllocationSessionClient<$Result.GetResult<Prisma.$AllocationSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AllocationSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AllocationSessionFindUniqueOrThrowArgs} args - Arguments to find a AllocationSession
     * @example
     * // Get one AllocationSession
     * const allocationSession = await prisma.allocationSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AllocationSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, AllocationSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AllocationSessionClient<$Result.GetResult<Prisma.$AllocationSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AllocationSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AllocationSessionFindFirstArgs} args - Arguments to find a AllocationSession
     * @example
     * // Get one AllocationSession
     * const allocationSession = await prisma.allocationSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AllocationSessionFindFirstArgs>(args?: SelectSubset<T, AllocationSessionFindFirstArgs<ExtArgs>>): Prisma__AllocationSessionClient<$Result.GetResult<Prisma.$AllocationSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AllocationSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AllocationSessionFindFirstOrThrowArgs} args - Arguments to find a AllocationSession
     * @example
     * // Get one AllocationSession
     * const allocationSession = await prisma.allocationSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AllocationSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, AllocationSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__AllocationSessionClient<$Result.GetResult<Prisma.$AllocationSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AllocationSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AllocationSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AllocationSessions
     * const allocationSessions = await prisma.allocationSession.findMany()
     * 
     * // Get first 10 AllocationSessions
     * const allocationSessions = await prisma.allocationSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const allocationSessionWithIdOnly = await prisma.allocationSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AllocationSessionFindManyArgs>(args?: SelectSubset<T, AllocationSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AllocationSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AllocationSession.
     * @param {AllocationSessionCreateArgs} args - Arguments to create a AllocationSession.
     * @example
     * // Create one AllocationSession
     * const AllocationSession = await prisma.allocationSession.create({
     *   data: {
     *     // ... data to create a AllocationSession
     *   }
     * })
     * 
     */
    create<T extends AllocationSessionCreateArgs>(args: SelectSubset<T, AllocationSessionCreateArgs<ExtArgs>>): Prisma__AllocationSessionClient<$Result.GetResult<Prisma.$AllocationSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AllocationSessions.
     * @param {AllocationSessionCreateManyArgs} args - Arguments to create many AllocationSessions.
     * @example
     * // Create many AllocationSessions
     * const allocationSession = await prisma.allocationSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AllocationSessionCreateManyArgs>(args?: SelectSubset<T, AllocationSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AllocationSessions and returns the data saved in the database.
     * @param {AllocationSessionCreateManyAndReturnArgs} args - Arguments to create many AllocationSessions.
     * @example
     * // Create many AllocationSessions
     * const allocationSession = await prisma.allocationSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AllocationSessions and only return the `id`
     * const allocationSessionWithIdOnly = await prisma.allocationSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AllocationSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, AllocationSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AllocationSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AllocationSession.
     * @param {AllocationSessionDeleteArgs} args - Arguments to delete one AllocationSession.
     * @example
     * // Delete one AllocationSession
     * const AllocationSession = await prisma.allocationSession.delete({
     *   where: {
     *     // ... filter to delete one AllocationSession
     *   }
     * })
     * 
     */
    delete<T extends AllocationSessionDeleteArgs>(args: SelectSubset<T, AllocationSessionDeleteArgs<ExtArgs>>): Prisma__AllocationSessionClient<$Result.GetResult<Prisma.$AllocationSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AllocationSession.
     * @param {AllocationSessionUpdateArgs} args - Arguments to update one AllocationSession.
     * @example
     * // Update one AllocationSession
     * const allocationSession = await prisma.allocationSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AllocationSessionUpdateArgs>(args: SelectSubset<T, AllocationSessionUpdateArgs<ExtArgs>>): Prisma__AllocationSessionClient<$Result.GetResult<Prisma.$AllocationSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AllocationSessions.
     * @param {AllocationSessionDeleteManyArgs} args - Arguments to filter AllocationSessions to delete.
     * @example
     * // Delete a few AllocationSessions
     * const { count } = await prisma.allocationSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AllocationSessionDeleteManyArgs>(args?: SelectSubset<T, AllocationSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AllocationSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AllocationSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AllocationSessions
     * const allocationSession = await prisma.allocationSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AllocationSessionUpdateManyArgs>(args: SelectSubset<T, AllocationSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AllocationSessions and returns the data updated in the database.
     * @param {AllocationSessionUpdateManyAndReturnArgs} args - Arguments to update many AllocationSessions.
     * @example
     * // Update many AllocationSessions
     * const allocationSession = await prisma.allocationSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AllocationSessions and only return the `id`
     * const allocationSessionWithIdOnly = await prisma.allocationSession.updateManyAndReturn({
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
    updateManyAndReturn<T extends AllocationSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, AllocationSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AllocationSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AllocationSession.
     * @param {AllocationSessionUpsertArgs} args - Arguments to update or create a AllocationSession.
     * @example
     * // Update or create a AllocationSession
     * const allocationSession = await prisma.allocationSession.upsert({
     *   create: {
     *     // ... data to create a AllocationSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AllocationSession we want to update
     *   }
     * })
     */
    upsert<T extends AllocationSessionUpsertArgs>(args: SelectSubset<T, AllocationSessionUpsertArgs<ExtArgs>>): Prisma__AllocationSessionClient<$Result.GetResult<Prisma.$AllocationSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AllocationSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AllocationSessionCountArgs} args - Arguments to filter AllocationSessions to count.
     * @example
     * // Count the number of AllocationSessions
     * const count = await prisma.allocationSession.count({
     *   where: {
     *     // ... the filter for the AllocationSessions we want to count
     *   }
     * })
    **/
    count<T extends AllocationSessionCountArgs>(
      args?: Subset<T, AllocationSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AllocationSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AllocationSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AllocationSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AllocationSessionAggregateArgs>(args: Subset<T, AllocationSessionAggregateArgs>): Prisma.PrismaPromise<GetAllocationSessionAggregateType<T>>

    /**
     * Group by AllocationSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AllocationSessionGroupByArgs} args - Group by arguments.
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
      T extends AllocationSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AllocationSessionGroupByArgs['orderBy'] }
        : { orderBy?: AllocationSessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AllocationSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAllocationSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AllocationSession model
   */
  readonly fields: AllocationSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AllocationSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AllocationSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bots<T extends AllocationSession$botsArgs<ExtArgs> = {}>(args?: Subset<T, AllocationSession$botsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingBotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the AllocationSession model
   */
  interface AllocationSessionFieldRefs {
    readonly id: FieldRef<"AllocationSession", 'String'>
    readonly name: FieldRef<"AllocationSession", 'String'>
    readonly capital: FieldRef<"AllocationSession", 'Float'>
    readonly virtualCash: FieldRef<"AllocationSession", 'Float'>
    readonly maxDrawdownPct: FieldRef<"AllocationSession", 'Float'>
    readonly enabledMarkets: FieldRef<"AllocationSession", 'Json'>
    readonly provider: FieldRef<"AllocationSession", 'String'>
    readonly active: FieldRef<"AllocationSession", 'Boolean'>
    readonly createdAt: FieldRef<"AllocationSession", 'DateTime'>
    readonly updatedAt: FieldRef<"AllocationSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AllocationSession findUnique
   */
  export type AllocationSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllocationSession
     */
    select?: AllocationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AllocationSession
     */
    omit?: AllocationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllocationSessionInclude<ExtArgs> | null
    /**
     * Filter, which AllocationSession to fetch.
     */
    where: AllocationSessionWhereUniqueInput
  }

  /**
   * AllocationSession findUniqueOrThrow
   */
  export type AllocationSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllocationSession
     */
    select?: AllocationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AllocationSession
     */
    omit?: AllocationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllocationSessionInclude<ExtArgs> | null
    /**
     * Filter, which AllocationSession to fetch.
     */
    where: AllocationSessionWhereUniqueInput
  }

  /**
   * AllocationSession findFirst
   */
  export type AllocationSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllocationSession
     */
    select?: AllocationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AllocationSession
     */
    omit?: AllocationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllocationSessionInclude<ExtArgs> | null
    /**
     * Filter, which AllocationSession to fetch.
     */
    where?: AllocationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AllocationSessions to fetch.
     */
    orderBy?: AllocationSessionOrderByWithRelationInput | AllocationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AllocationSessions.
     */
    cursor?: AllocationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AllocationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AllocationSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AllocationSessions.
     */
    distinct?: AllocationSessionScalarFieldEnum | AllocationSessionScalarFieldEnum[]
  }

  /**
   * AllocationSession findFirstOrThrow
   */
  export type AllocationSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllocationSession
     */
    select?: AllocationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AllocationSession
     */
    omit?: AllocationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllocationSessionInclude<ExtArgs> | null
    /**
     * Filter, which AllocationSession to fetch.
     */
    where?: AllocationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AllocationSessions to fetch.
     */
    orderBy?: AllocationSessionOrderByWithRelationInput | AllocationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AllocationSessions.
     */
    cursor?: AllocationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AllocationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AllocationSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AllocationSessions.
     */
    distinct?: AllocationSessionScalarFieldEnum | AllocationSessionScalarFieldEnum[]
  }

  /**
   * AllocationSession findMany
   */
  export type AllocationSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllocationSession
     */
    select?: AllocationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AllocationSession
     */
    omit?: AllocationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllocationSessionInclude<ExtArgs> | null
    /**
     * Filter, which AllocationSessions to fetch.
     */
    where?: AllocationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AllocationSessions to fetch.
     */
    orderBy?: AllocationSessionOrderByWithRelationInput | AllocationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AllocationSessions.
     */
    cursor?: AllocationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AllocationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AllocationSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AllocationSessions.
     */
    distinct?: AllocationSessionScalarFieldEnum | AllocationSessionScalarFieldEnum[]
  }

  /**
   * AllocationSession create
   */
  export type AllocationSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllocationSession
     */
    select?: AllocationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AllocationSession
     */
    omit?: AllocationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllocationSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a AllocationSession.
     */
    data: XOR<AllocationSessionCreateInput, AllocationSessionUncheckedCreateInput>
  }

  /**
   * AllocationSession createMany
   */
  export type AllocationSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AllocationSessions.
     */
    data: AllocationSessionCreateManyInput | AllocationSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AllocationSession createManyAndReturn
   */
  export type AllocationSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllocationSession
     */
    select?: AllocationSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AllocationSession
     */
    omit?: AllocationSessionOmit<ExtArgs> | null
    /**
     * The data used to create many AllocationSessions.
     */
    data: AllocationSessionCreateManyInput | AllocationSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AllocationSession update
   */
  export type AllocationSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllocationSession
     */
    select?: AllocationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AllocationSession
     */
    omit?: AllocationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllocationSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a AllocationSession.
     */
    data: XOR<AllocationSessionUpdateInput, AllocationSessionUncheckedUpdateInput>
    /**
     * Choose, which AllocationSession to update.
     */
    where: AllocationSessionWhereUniqueInput
  }

  /**
   * AllocationSession updateMany
   */
  export type AllocationSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AllocationSessions.
     */
    data: XOR<AllocationSessionUpdateManyMutationInput, AllocationSessionUncheckedUpdateManyInput>
    /**
     * Filter which AllocationSessions to update
     */
    where?: AllocationSessionWhereInput
    /**
     * Limit how many AllocationSessions to update.
     */
    limit?: number
  }

  /**
   * AllocationSession updateManyAndReturn
   */
  export type AllocationSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllocationSession
     */
    select?: AllocationSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AllocationSession
     */
    omit?: AllocationSessionOmit<ExtArgs> | null
    /**
     * The data used to update AllocationSessions.
     */
    data: XOR<AllocationSessionUpdateManyMutationInput, AllocationSessionUncheckedUpdateManyInput>
    /**
     * Filter which AllocationSessions to update
     */
    where?: AllocationSessionWhereInput
    /**
     * Limit how many AllocationSessions to update.
     */
    limit?: number
  }

  /**
   * AllocationSession upsert
   */
  export type AllocationSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllocationSession
     */
    select?: AllocationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AllocationSession
     */
    omit?: AllocationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllocationSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the AllocationSession to update in case it exists.
     */
    where: AllocationSessionWhereUniqueInput
    /**
     * In case the AllocationSession found by the `where` argument doesn't exist, create a new AllocationSession with this data.
     */
    create: XOR<AllocationSessionCreateInput, AllocationSessionUncheckedCreateInput>
    /**
     * In case the AllocationSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AllocationSessionUpdateInput, AllocationSessionUncheckedUpdateInput>
  }

  /**
   * AllocationSession delete
   */
  export type AllocationSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllocationSession
     */
    select?: AllocationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AllocationSession
     */
    omit?: AllocationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllocationSessionInclude<ExtArgs> | null
    /**
     * Filter which AllocationSession to delete.
     */
    where: AllocationSessionWhereUniqueInput
  }

  /**
   * AllocationSession deleteMany
   */
  export type AllocationSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AllocationSessions to delete
     */
    where?: AllocationSessionWhereInput
    /**
     * Limit how many AllocationSessions to delete.
     */
    limit?: number
  }

  /**
   * AllocationSession.bots
   */
  export type AllocationSession$botsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingBot
     */
    select?: TradingBotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingBot
     */
    omit?: TradingBotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingBotInclude<ExtArgs> | null
    where?: TradingBotWhereInput
    orderBy?: TradingBotOrderByWithRelationInput | TradingBotOrderByWithRelationInput[]
    cursor?: TradingBotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradingBotScalarFieldEnum | TradingBotScalarFieldEnum[]
  }

  /**
   * AllocationSession without action
   */
  export type AllocationSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllocationSession
     */
    select?: AllocationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AllocationSession
     */
    omit?: AllocationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllocationSessionInclude<ExtArgs> | null
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
    volume: 'volume',
    interval: 'interval'
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


  export const TradingSessionScalarFieldEnum: {
    id: 'id',
    provider: 'provider',
    accessToken: 'accessToken',
    publicToken: 'publicToken',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TradingSessionScalarFieldEnum = (typeof TradingSessionScalarFieldEnum)[keyof typeof TradingSessionScalarFieldEnum]


  export const TradingAccountScalarFieldEnum: {
    id: 'id',
    provider: 'provider',
    name: 'name',
    isLive: 'isLive',
    balance: 'balance',
    currency: 'currency',
    createdAt: 'createdAt'
  };

  export type TradingAccountScalarFieldEnum = (typeof TradingAccountScalarFieldEnum)[keyof typeof TradingAccountScalarFieldEnum]


  export const TradingOrderScalarFieldEnum: {
    id: 'id',
    accountId: 'accountId',
    symbol: 'symbol',
    qty: 'qty',
    side: 'side',
    type: 'type',
    price: 'price',
    status: 'status',
    filledPrice: 'filledPrice',
    commission: 'commission',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TradingOrderScalarFieldEnum = (typeof TradingOrderScalarFieldEnum)[keyof typeof TradingOrderScalarFieldEnum]


  export const TradingPositionScalarFieldEnum: {
    id: 'id',
    accountId: 'accountId',
    symbol: 'symbol',
    qty: 'qty',
    entryPrice: 'entryPrice',
    marketPrice: 'marketPrice',
    updatedAt: 'updatedAt'
  };

  export type TradingPositionScalarFieldEnum = (typeof TradingPositionScalarFieldEnum)[keyof typeof TradingPositionScalarFieldEnum]


  export const SystemSettingScalarFieldEnum: {
    id: 'id',
    key: 'key',
    value: 'value',
    updatedAt: 'updatedAt'
  };

  export type SystemSettingScalarFieldEnum = (typeof SystemSettingScalarFieldEnum)[keyof typeof SystemSettingScalarFieldEnum]


  export const CustomStrategyScalarFieldEnum: {
    id: 'id',
    name: 'name',
    baseType: 'baseType',
    parameters: 'parameters',
    interval: 'interval',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CustomStrategyScalarFieldEnum = (typeof CustomStrategyScalarFieldEnum)[keyof typeof CustomStrategyScalarFieldEnum]


  export const TradingBotScalarFieldEnum: {
    id: 'id',
    name: 'name',
    strategy: 'strategy',
    customStrategyId: 'customStrategyId',
    parameters: 'parameters',
    symbol: 'symbol',
    active: 'active',
    allocationSessionId: 'allocationSessionId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TradingBotScalarFieldEnum = (typeof TradingBotScalarFieldEnum)[keyof typeof TradingBotScalarFieldEnum]


  export const AllocationSessionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    capital: 'capital',
    virtualCash: 'virtualCash',
    maxDrawdownPct: 'maxDrawdownPct',
    enabledMarkets: 'enabledMarkets',
    provider: 'provider',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AllocationSessionScalarFieldEnum = (typeof AllocationSessionScalarFieldEnum)[keyof typeof AllocationSessionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


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
    interval?: StringFilter<"HistoricalPrice"> | string
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
    interval?: SortOrder
    symbol?: SymbolOrderByWithRelationInput
  }

  export type HistoricalPriceWhereUniqueInput = Prisma.AtLeast<{
    symbolId_date_interval?: HistoricalPriceSymbolIdDateIntervalCompoundUniqueInput
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
    interval?: StringFilter<"HistoricalPrice"> | string
    symbol?: XOR<SymbolScalarRelationFilter, SymbolWhereInput>
  }, "symbolId_date_interval">

  export type HistoricalPriceOrderByWithAggregationInput = {
    symbolId?: SortOrder
    date?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    interval?: SortOrder
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
    interval?: StringWithAggregatesFilter<"HistoricalPrice"> | string
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

  export type TradingSessionWhereInput = {
    AND?: TradingSessionWhereInput | TradingSessionWhereInput[]
    OR?: TradingSessionWhereInput[]
    NOT?: TradingSessionWhereInput | TradingSessionWhereInput[]
    id?: StringFilter<"TradingSession"> | string
    provider?: StringFilter<"TradingSession"> | string
    accessToken?: StringFilter<"TradingSession"> | string
    publicToken?: StringNullableFilter<"TradingSession"> | string | null
    createdAt?: DateTimeFilter<"TradingSession"> | Date | string
    updatedAt?: DateTimeFilter<"TradingSession"> | Date | string
  }

  export type TradingSessionOrderByWithRelationInput = {
    id?: SortOrder
    provider?: SortOrder
    accessToken?: SortOrder
    publicToken?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradingSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TradingSessionWhereInput | TradingSessionWhereInput[]
    OR?: TradingSessionWhereInput[]
    NOT?: TradingSessionWhereInput | TradingSessionWhereInput[]
    provider?: StringFilter<"TradingSession"> | string
    accessToken?: StringFilter<"TradingSession"> | string
    publicToken?: StringNullableFilter<"TradingSession"> | string | null
    createdAt?: DateTimeFilter<"TradingSession"> | Date | string
    updatedAt?: DateTimeFilter<"TradingSession"> | Date | string
  }, "id">

  export type TradingSessionOrderByWithAggregationInput = {
    id?: SortOrder
    provider?: SortOrder
    accessToken?: SortOrder
    publicToken?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TradingSessionCountOrderByAggregateInput
    _max?: TradingSessionMaxOrderByAggregateInput
    _min?: TradingSessionMinOrderByAggregateInput
  }

  export type TradingSessionScalarWhereWithAggregatesInput = {
    AND?: TradingSessionScalarWhereWithAggregatesInput | TradingSessionScalarWhereWithAggregatesInput[]
    OR?: TradingSessionScalarWhereWithAggregatesInput[]
    NOT?: TradingSessionScalarWhereWithAggregatesInput | TradingSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TradingSession"> | string
    provider?: StringWithAggregatesFilter<"TradingSession"> | string
    accessToken?: StringWithAggregatesFilter<"TradingSession"> | string
    publicToken?: StringNullableWithAggregatesFilter<"TradingSession"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TradingSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TradingSession"> | Date | string
  }

  export type TradingAccountWhereInput = {
    AND?: TradingAccountWhereInput | TradingAccountWhereInput[]
    OR?: TradingAccountWhereInput[]
    NOT?: TradingAccountWhereInput | TradingAccountWhereInput[]
    id?: StringFilter<"TradingAccount"> | string
    provider?: StringFilter<"TradingAccount"> | string
    name?: StringFilter<"TradingAccount"> | string
    isLive?: BoolFilter<"TradingAccount"> | boolean
    balance?: FloatFilter<"TradingAccount"> | number
    currency?: StringFilter<"TradingAccount"> | string
    createdAt?: DateTimeFilter<"TradingAccount"> | Date | string
    orders?: TradingOrderListRelationFilter
    positions?: TradingPositionListRelationFilter
  }

  export type TradingAccountOrderByWithRelationInput = {
    id?: SortOrder
    provider?: SortOrder
    name?: SortOrder
    isLive?: SortOrder
    balance?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    orders?: TradingOrderOrderByRelationAggregateInput
    positions?: TradingPositionOrderByRelationAggregateInput
  }

  export type TradingAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TradingAccountWhereInput | TradingAccountWhereInput[]
    OR?: TradingAccountWhereInput[]
    NOT?: TradingAccountWhereInput | TradingAccountWhereInput[]
    provider?: StringFilter<"TradingAccount"> | string
    name?: StringFilter<"TradingAccount"> | string
    isLive?: BoolFilter<"TradingAccount"> | boolean
    balance?: FloatFilter<"TradingAccount"> | number
    currency?: StringFilter<"TradingAccount"> | string
    createdAt?: DateTimeFilter<"TradingAccount"> | Date | string
    orders?: TradingOrderListRelationFilter
    positions?: TradingPositionListRelationFilter
  }, "id">

  export type TradingAccountOrderByWithAggregationInput = {
    id?: SortOrder
    provider?: SortOrder
    name?: SortOrder
    isLive?: SortOrder
    balance?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    _count?: TradingAccountCountOrderByAggregateInput
    _avg?: TradingAccountAvgOrderByAggregateInput
    _max?: TradingAccountMaxOrderByAggregateInput
    _min?: TradingAccountMinOrderByAggregateInput
    _sum?: TradingAccountSumOrderByAggregateInput
  }

  export type TradingAccountScalarWhereWithAggregatesInput = {
    AND?: TradingAccountScalarWhereWithAggregatesInput | TradingAccountScalarWhereWithAggregatesInput[]
    OR?: TradingAccountScalarWhereWithAggregatesInput[]
    NOT?: TradingAccountScalarWhereWithAggregatesInput | TradingAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TradingAccount"> | string
    provider?: StringWithAggregatesFilter<"TradingAccount"> | string
    name?: StringWithAggregatesFilter<"TradingAccount"> | string
    isLive?: BoolWithAggregatesFilter<"TradingAccount"> | boolean
    balance?: FloatWithAggregatesFilter<"TradingAccount"> | number
    currency?: StringWithAggregatesFilter<"TradingAccount"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TradingAccount"> | Date | string
  }

  export type TradingOrderWhereInput = {
    AND?: TradingOrderWhereInput | TradingOrderWhereInput[]
    OR?: TradingOrderWhereInput[]
    NOT?: TradingOrderWhereInput | TradingOrderWhereInput[]
    id?: StringFilter<"TradingOrder"> | string
    accountId?: StringFilter<"TradingOrder"> | string
    symbol?: StringFilter<"TradingOrder"> | string
    qty?: FloatFilter<"TradingOrder"> | number
    side?: StringFilter<"TradingOrder"> | string
    type?: StringFilter<"TradingOrder"> | string
    price?: FloatNullableFilter<"TradingOrder"> | number | null
    status?: StringFilter<"TradingOrder"> | string
    filledPrice?: FloatNullableFilter<"TradingOrder"> | number | null
    commission?: FloatFilter<"TradingOrder"> | number
    createdAt?: DateTimeFilter<"TradingOrder"> | Date | string
    updatedAt?: DateTimeFilter<"TradingOrder"> | Date | string
    account?: XOR<TradingAccountScalarRelationFilter, TradingAccountWhereInput>
  }

  export type TradingOrderOrderByWithRelationInput = {
    id?: SortOrder
    accountId?: SortOrder
    symbol?: SortOrder
    qty?: SortOrder
    side?: SortOrder
    type?: SortOrder
    price?: SortOrderInput | SortOrder
    status?: SortOrder
    filledPrice?: SortOrderInput | SortOrder
    commission?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    account?: TradingAccountOrderByWithRelationInput
  }

  export type TradingOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TradingOrderWhereInput | TradingOrderWhereInput[]
    OR?: TradingOrderWhereInput[]
    NOT?: TradingOrderWhereInput | TradingOrderWhereInput[]
    accountId?: StringFilter<"TradingOrder"> | string
    symbol?: StringFilter<"TradingOrder"> | string
    qty?: FloatFilter<"TradingOrder"> | number
    side?: StringFilter<"TradingOrder"> | string
    type?: StringFilter<"TradingOrder"> | string
    price?: FloatNullableFilter<"TradingOrder"> | number | null
    status?: StringFilter<"TradingOrder"> | string
    filledPrice?: FloatNullableFilter<"TradingOrder"> | number | null
    commission?: FloatFilter<"TradingOrder"> | number
    createdAt?: DateTimeFilter<"TradingOrder"> | Date | string
    updatedAt?: DateTimeFilter<"TradingOrder"> | Date | string
    account?: XOR<TradingAccountScalarRelationFilter, TradingAccountWhereInput>
  }, "id">

  export type TradingOrderOrderByWithAggregationInput = {
    id?: SortOrder
    accountId?: SortOrder
    symbol?: SortOrder
    qty?: SortOrder
    side?: SortOrder
    type?: SortOrder
    price?: SortOrderInput | SortOrder
    status?: SortOrder
    filledPrice?: SortOrderInput | SortOrder
    commission?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TradingOrderCountOrderByAggregateInput
    _avg?: TradingOrderAvgOrderByAggregateInput
    _max?: TradingOrderMaxOrderByAggregateInput
    _min?: TradingOrderMinOrderByAggregateInput
    _sum?: TradingOrderSumOrderByAggregateInput
  }

  export type TradingOrderScalarWhereWithAggregatesInput = {
    AND?: TradingOrderScalarWhereWithAggregatesInput | TradingOrderScalarWhereWithAggregatesInput[]
    OR?: TradingOrderScalarWhereWithAggregatesInput[]
    NOT?: TradingOrderScalarWhereWithAggregatesInput | TradingOrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TradingOrder"> | string
    accountId?: StringWithAggregatesFilter<"TradingOrder"> | string
    symbol?: StringWithAggregatesFilter<"TradingOrder"> | string
    qty?: FloatWithAggregatesFilter<"TradingOrder"> | number
    side?: StringWithAggregatesFilter<"TradingOrder"> | string
    type?: StringWithAggregatesFilter<"TradingOrder"> | string
    price?: FloatNullableWithAggregatesFilter<"TradingOrder"> | number | null
    status?: StringWithAggregatesFilter<"TradingOrder"> | string
    filledPrice?: FloatNullableWithAggregatesFilter<"TradingOrder"> | number | null
    commission?: FloatWithAggregatesFilter<"TradingOrder"> | number
    createdAt?: DateTimeWithAggregatesFilter<"TradingOrder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TradingOrder"> | Date | string
  }

  export type TradingPositionWhereInput = {
    AND?: TradingPositionWhereInput | TradingPositionWhereInput[]
    OR?: TradingPositionWhereInput[]
    NOT?: TradingPositionWhereInput | TradingPositionWhereInput[]
    id?: StringFilter<"TradingPosition"> | string
    accountId?: StringFilter<"TradingPosition"> | string
    symbol?: StringFilter<"TradingPosition"> | string
    qty?: FloatFilter<"TradingPosition"> | number
    entryPrice?: FloatFilter<"TradingPosition"> | number
    marketPrice?: FloatFilter<"TradingPosition"> | number
    updatedAt?: DateTimeFilter<"TradingPosition"> | Date | string
    account?: XOR<TradingAccountScalarRelationFilter, TradingAccountWhereInput>
  }

  export type TradingPositionOrderByWithRelationInput = {
    id?: SortOrder
    accountId?: SortOrder
    symbol?: SortOrder
    qty?: SortOrder
    entryPrice?: SortOrder
    marketPrice?: SortOrder
    updatedAt?: SortOrder
    account?: TradingAccountOrderByWithRelationInput
  }

  export type TradingPositionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TradingPositionWhereInput | TradingPositionWhereInput[]
    OR?: TradingPositionWhereInput[]
    NOT?: TradingPositionWhereInput | TradingPositionWhereInput[]
    accountId?: StringFilter<"TradingPosition"> | string
    symbol?: StringFilter<"TradingPosition"> | string
    qty?: FloatFilter<"TradingPosition"> | number
    entryPrice?: FloatFilter<"TradingPosition"> | number
    marketPrice?: FloatFilter<"TradingPosition"> | number
    updatedAt?: DateTimeFilter<"TradingPosition"> | Date | string
    account?: XOR<TradingAccountScalarRelationFilter, TradingAccountWhereInput>
  }, "id">

  export type TradingPositionOrderByWithAggregationInput = {
    id?: SortOrder
    accountId?: SortOrder
    symbol?: SortOrder
    qty?: SortOrder
    entryPrice?: SortOrder
    marketPrice?: SortOrder
    updatedAt?: SortOrder
    _count?: TradingPositionCountOrderByAggregateInput
    _avg?: TradingPositionAvgOrderByAggregateInput
    _max?: TradingPositionMaxOrderByAggregateInput
    _min?: TradingPositionMinOrderByAggregateInput
    _sum?: TradingPositionSumOrderByAggregateInput
  }

  export type TradingPositionScalarWhereWithAggregatesInput = {
    AND?: TradingPositionScalarWhereWithAggregatesInput | TradingPositionScalarWhereWithAggregatesInput[]
    OR?: TradingPositionScalarWhereWithAggregatesInput[]
    NOT?: TradingPositionScalarWhereWithAggregatesInput | TradingPositionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TradingPosition"> | string
    accountId?: StringWithAggregatesFilter<"TradingPosition"> | string
    symbol?: StringWithAggregatesFilter<"TradingPosition"> | string
    qty?: FloatWithAggregatesFilter<"TradingPosition"> | number
    entryPrice?: FloatWithAggregatesFilter<"TradingPosition"> | number
    marketPrice?: FloatWithAggregatesFilter<"TradingPosition"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"TradingPosition"> | Date | string
  }

  export type SystemSettingWhereInput = {
    AND?: SystemSettingWhereInput | SystemSettingWhereInput[]
    OR?: SystemSettingWhereInput[]
    NOT?: SystemSettingWhereInput | SystemSettingWhereInput[]
    id?: StringFilter<"SystemSetting"> | string
    key?: StringFilter<"SystemSetting"> | string
    value?: StringFilter<"SystemSetting"> | string
    updatedAt?: DateTimeFilter<"SystemSetting"> | Date | string
  }

  export type SystemSettingOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemSettingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    key?: string
    AND?: SystemSettingWhereInput | SystemSettingWhereInput[]
    OR?: SystemSettingWhereInput[]
    NOT?: SystemSettingWhereInput | SystemSettingWhereInput[]
    value?: StringFilter<"SystemSetting"> | string
    updatedAt?: DateTimeFilter<"SystemSetting"> | Date | string
  }, "id" | "key">

  export type SystemSettingOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
    _count?: SystemSettingCountOrderByAggregateInput
    _max?: SystemSettingMaxOrderByAggregateInput
    _min?: SystemSettingMinOrderByAggregateInput
  }

  export type SystemSettingScalarWhereWithAggregatesInput = {
    AND?: SystemSettingScalarWhereWithAggregatesInput | SystemSettingScalarWhereWithAggregatesInput[]
    OR?: SystemSettingScalarWhereWithAggregatesInput[]
    NOT?: SystemSettingScalarWhereWithAggregatesInput | SystemSettingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SystemSetting"> | string
    key?: StringWithAggregatesFilter<"SystemSetting"> | string
    value?: StringWithAggregatesFilter<"SystemSetting"> | string
    updatedAt?: DateTimeWithAggregatesFilter<"SystemSetting"> | Date | string
  }

  export type CustomStrategyWhereInput = {
    AND?: CustomStrategyWhereInput | CustomStrategyWhereInput[]
    OR?: CustomStrategyWhereInput[]
    NOT?: CustomStrategyWhereInput | CustomStrategyWhereInput[]
    id?: StringFilter<"CustomStrategy"> | string
    name?: StringFilter<"CustomStrategy"> | string
    baseType?: StringFilter<"CustomStrategy"> | string
    parameters?: JsonFilter<"CustomStrategy">
    interval?: StringFilter<"CustomStrategy"> | string
    createdAt?: DateTimeFilter<"CustomStrategy"> | Date | string
    updatedAt?: DateTimeFilter<"CustomStrategy"> | Date | string
    bots?: TradingBotListRelationFilter
  }

  export type CustomStrategyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    baseType?: SortOrder
    parameters?: SortOrder
    interval?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    bots?: TradingBotOrderByRelationAggregateInput
  }

  export type CustomStrategyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: CustomStrategyWhereInput | CustomStrategyWhereInput[]
    OR?: CustomStrategyWhereInput[]
    NOT?: CustomStrategyWhereInput | CustomStrategyWhereInput[]
    baseType?: StringFilter<"CustomStrategy"> | string
    parameters?: JsonFilter<"CustomStrategy">
    interval?: StringFilter<"CustomStrategy"> | string
    createdAt?: DateTimeFilter<"CustomStrategy"> | Date | string
    updatedAt?: DateTimeFilter<"CustomStrategy"> | Date | string
    bots?: TradingBotListRelationFilter
  }, "id" | "name">

  export type CustomStrategyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    baseType?: SortOrder
    parameters?: SortOrder
    interval?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CustomStrategyCountOrderByAggregateInput
    _max?: CustomStrategyMaxOrderByAggregateInput
    _min?: CustomStrategyMinOrderByAggregateInput
  }

  export type CustomStrategyScalarWhereWithAggregatesInput = {
    AND?: CustomStrategyScalarWhereWithAggregatesInput | CustomStrategyScalarWhereWithAggregatesInput[]
    OR?: CustomStrategyScalarWhereWithAggregatesInput[]
    NOT?: CustomStrategyScalarWhereWithAggregatesInput | CustomStrategyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CustomStrategy"> | string
    name?: StringWithAggregatesFilter<"CustomStrategy"> | string
    baseType?: StringWithAggregatesFilter<"CustomStrategy"> | string
    parameters?: JsonWithAggregatesFilter<"CustomStrategy">
    interval?: StringWithAggregatesFilter<"CustomStrategy"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CustomStrategy"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CustomStrategy"> | Date | string
  }

  export type TradingBotWhereInput = {
    AND?: TradingBotWhereInput | TradingBotWhereInput[]
    OR?: TradingBotWhereInput[]
    NOT?: TradingBotWhereInput | TradingBotWhereInput[]
    id?: StringFilter<"TradingBot"> | string
    name?: StringFilter<"TradingBot"> | string
    strategy?: StringFilter<"TradingBot"> | string
    customStrategyId?: StringNullableFilter<"TradingBot"> | string | null
    parameters?: JsonFilter<"TradingBot">
    symbol?: StringFilter<"TradingBot"> | string
    active?: BoolFilter<"TradingBot"> | boolean
    allocationSessionId?: StringNullableFilter<"TradingBot"> | string | null
    createdAt?: DateTimeFilter<"TradingBot"> | Date | string
    updatedAt?: DateTimeFilter<"TradingBot"> | Date | string
    customStrategy?: XOR<CustomStrategyNullableScalarRelationFilter, CustomStrategyWhereInput> | null
    allocationSession?: XOR<AllocationSessionNullableScalarRelationFilter, AllocationSessionWhereInput> | null
  }

  export type TradingBotOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    strategy?: SortOrder
    customStrategyId?: SortOrderInput | SortOrder
    parameters?: SortOrder
    symbol?: SortOrder
    active?: SortOrder
    allocationSessionId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    customStrategy?: CustomStrategyOrderByWithRelationInput
    allocationSession?: AllocationSessionOrderByWithRelationInput
  }

  export type TradingBotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: TradingBotWhereInput | TradingBotWhereInput[]
    OR?: TradingBotWhereInput[]
    NOT?: TradingBotWhereInput | TradingBotWhereInput[]
    strategy?: StringFilter<"TradingBot"> | string
    customStrategyId?: StringNullableFilter<"TradingBot"> | string | null
    parameters?: JsonFilter<"TradingBot">
    symbol?: StringFilter<"TradingBot"> | string
    active?: BoolFilter<"TradingBot"> | boolean
    allocationSessionId?: StringNullableFilter<"TradingBot"> | string | null
    createdAt?: DateTimeFilter<"TradingBot"> | Date | string
    updatedAt?: DateTimeFilter<"TradingBot"> | Date | string
    customStrategy?: XOR<CustomStrategyNullableScalarRelationFilter, CustomStrategyWhereInput> | null
    allocationSession?: XOR<AllocationSessionNullableScalarRelationFilter, AllocationSessionWhereInput> | null
  }, "id" | "name">

  export type TradingBotOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    strategy?: SortOrder
    customStrategyId?: SortOrderInput | SortOrder
    parameters?: SortOrder
    symbol?: SortOrder
    active?: SortOrder
    allocationSessionId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TradingBotCountOrderByAggregateInput
    _max?: TradingBotMaxOrderByAggregateInput
    _min?: TradingBotMinOrderByAggregateInput
  }

  export type TradingBotScalarWhereWithAggregatesInput = {
    AND?: TradingBotScalarWhereWithAggregatesInput | TradingBotScalarWhereWithAggregatesInput[]
    OR?: TradingBotScalarWhereWithAggregatesInput[]
    NOT?: TradingBotScalarWhereWithAggregatesInput | TradingBotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TradingBot"> | string
    name?: StringWithAggregatesFilter<"TradingBot"> | string
    strategy?: StringWithAggregatesFilter<"TradingBot"> | string
    customStrategyId?: StringNullableWithAggregatesFilter<"TradingBot"> | string | null
    parameters?: JsonWithAggregatesFilter<"TradingBot">
    symbol?: StringWithAggregatesFilter<"TradingBot"> | string
    active?: BoolWithAggregatesFilter<"TradingBot"> | boolean
    allocationSessionId?: StringNullableWithAggregatesFilter<"TradingBot"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TradingBot"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TradingBot"> | Date | string
  }

  export type AllocationSessionWhereInput = {
    AND?: AllocationSessionWhereInput | AllocationSessionWhereInput[]
    OR?: AllocationSessionWhereInput[]
    NOT?: AllocationSessionWhereInput | AllocationSessionWhereInput[]
    id?: StringFilter<"AllocationSession"> | string
    name?: StringFilter<"AllocationSession"> | string
    capital?: FloatFilter<"AllocationSession"> | number
    virtualCash?: FloatFilter<"AllocationSession"> | number
    maxDrawdownPct?: FloatFilter<"AllocationSession"> | number
    enabledMarkets?: JsonFilter<"AllocationSession">
    provider?: StringFilter<"AllocationSession"> | string
    active?: BoolFilter<"AllocationSession"> | boolean
    createdAt?: DateTimeFilter<"AllocationSession"> | Date | string
    updatedAt?: DateTimeFilter<"AllocationSession"> | Date | string
    bots?: TradingBotListRelationFilter
  }

  export type AllocationSessionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    capital?: SortOrder
    virtualCash?: SortOrder
    maxDrawdownPct?: SortOrder
    enabledMarkets?: SortOrder
    provider?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    bots?: TradingBotOrderByRelationAggregateInput
  }

  export type AllocationSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: AllocationSessionWhereInput | AllocationSessionWhereInput[]
    OR?: AllocationSessionWhereInput[]
    NOT?: AllocationSessionWhereInput | AllocationSessionWhereInput[]
    capital?: FloatFilter<"AllocationSession"> | number
    virtualCash?: FloatFilter<"AllocationSession"> | number
    maxDrawdownPct?: FloatFilter<"AllocationSession"> | number
    enabledMarkets?: JsonFilter<"AllocationSession">
    provider?: StringFilter<"AllocationSession"> | string
    active?: BoolFilter<"AllocationSession"> | boolean
    createdAt?: DateTimeFilter<"AllocationSession"> | Date | string
    updatedAt?: DateTimeFilter<"AllocationSession"> | Date | string
    bots?: TradingBotListRelationFilter
  }, "id" | "name">

  export type AllocationSessionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    capital?: SortOrder
    virtualCash?: SortOrder
    maxDrawdownPct?: SortOrder
    enabledMarkets?: SortOrder
    provider?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AllocationSessionCountOrderByAggregateInput
    _avg?: AllocationSessionAvgOrderByAggregateInput
    _max?: AllocationSessionMaxOrderByAggregateInput
    _min?: AllocationSessionMinOrderByAggregateInput
    _sum?: AllocationSessionSumOrderByAggregateInput
  }

  export type AllocationSessionScalarWhereWithAggregatesInput = {
    AND?: AllocationSessionScalarWhereWithAggregatesInput | AllocationSessionScalarWhereWithAggregatesInput[]
    OR?: AllocationSessionScalarWhereWithAggregatesInput[]
    NOT?: AllocationSessionScalarWhereWithAggregatesInput | AllocationSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AllocationSession"> | string
    name?: StringWithAggregatesFilter<"AllocationSession"> | string
    capital?: FloatWithAggregatesFilter<"AllocationSession"> | number
    virtualCash?: FloatWithAggregatesFilter<"AllocationSession"> | number
    maxDrawdownPct?: FloatWithAggregatesFilter<"AllocationSession"> | number
    enabledMarkets?: JsonWithAggregatesFilter<"AllocationSession">
    provider?: StringWithAggregatesFilter<"AllocationSession"> | string
    active?: BoolWithAggregatesFilter<"AllocationSession"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"AllocationSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AllocationSession"> | Date | string
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
    interval?: string
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
    interval?: string
  }

  export type HistoricalPriceUpdateInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: FloatFieldUpdateOperationsInput | number
    high?: FloatFieldUpdateOperationsInput | number
    low?: FloatFieldUpdateOperationsInput | number
    close?: FloatFieldUpdateOperationsInput | number
    volume?: FloatFieldUpdateOperationsInput | number
    interval?: StringFieldUpdateOperationsInput | string
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
    interval?: StringFieldUpdateOperationsInput | string
  }

  export type HistoricalPriceCreateManyInput = {
    symbolId: string
    date: Date | string
    open: number
    high: number
    low: number
    close: number
    volume: number
    interval?: string
  }

  export type HistoricalPriceUpdateManyMutationInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: FloatFieldUpdateOperationsInput | number
    high?: FloatFieldUpdateOperationsInput | number
    low?: FloatFieldUpdateOperationsInput | number
    close?: FloatFieldUpdateOperationsInput | number
    volume?: FloatFieldUpdateOperationsInput | number
    interval?: StringFieldUpdateOperationsInput | string
  }

  export type HistoricalPriceUncheckedUpdateManyInput = {
    symbolId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: FloatFieldUpdateOperationsInput | number
    high?: FloatFieldUpdateOperationsInput | number
    low?: FloatFieldUpdateOperationsInput | number
    close?: FloatFieldUpdateOperationsInput | number
    volume?: FloatFieldUpdateOperationsInput | number
    interval?: StringFieldUpdateOperationsInput | string
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

  export type TradingSessionCreateInput = {
    id?: string
    provider: string
    accessToken: string
    publicToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingSessionUncheckedCreateInput = {
    id?: string
    provider: string
    accessToken: string
    publicToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    publicToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    publicToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingSessionCreateManyInput = {
    id?: string
    provider: string
    accessToken: string
    publicToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    publicToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    publicToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingAccountCreateInput = {
    id?: string
    provider: string
    name: string
    isLive?: boolean
    balance: number
    currency?: string
    createdAt?: Date | string
    orders?: TradingOrderCreateNestedManyWithoutAccountInput
    positions?: TradingPositionCreateNestedManyWithoutAccountInput
  }

  export type TradingAccountUncheckedCreateInput = {
    id?: string
    provider: string
    name: string
    isLive?: boolean
    balance: number
    currency?: string
    createdAt?: Date | string
    orders?: TradingOrderUncheckedCreateNestedManyWithoutAccountInput
    positions?: TradingPositionUncheckedCreateNestedManyWithoutAccountInput
  }

  export type TradingAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isLive?: BoolFieldUpdateOperationsInput | boolean
    balance?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: TradingOrderUpdateManyWithoutAccountNestedInput
    positions?: TradingPositionUpdateManyWithoutAccountNestedInput
  }

  export type TradingAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isLive?: BoolFieldUpdateOperationsInput | boolean
    balance?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: TradingOrderUncheckedUpdateManyWithoutAccountNestedInput
    positions?: TradingPositionUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type TradingAccountCreateManyInput = {
    id?: string
    provider: string
    name: string
    isLive?: boolean
    balance: number
    currency?: string
    createdAt?: Date | string
  }

  export type TradingAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isLive?: BoolFieldUpdateOperationsInput | boolean
    balance?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isLive?: BoolFieldUpdateOperationsInput | boolean
    balance?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingOrderCreateInput = {
    id?: string
    symbol: string
    qty: number
    side: string
    type: string
    price?: number | null
    status: string
    filledPrice?: number | null
    commission?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    account: TradingAccountCreateNestedOneWithoutOrdersInput
  }

  export type TradingOrderUncheckedCreateInput = {
    id?: string
    accountId: string
    symbol: string
    qty: number
    side: string
    type: string
    price?: number | null
    status: string
    filledPrice?: number | null
    commission?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingOrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    qty?: FloatFieldUpdateOperationsInput | number
    side?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    filledPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    commission?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: TradingAccountUpdateOneRequiredWithoutOrdersNestedInput
  }

  export type TradingOrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    qty?: FloatFieldUpdateOperationsInput | number
    side?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    filledPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    commission?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingOrderCreateManyInput = {
    id?: string
    accountId: string
    symbol: string
    qty: number
    side: string
    type: string
    price?: number | null
    status: string
    filledPrice?: number | null
    commission?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingOrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    qty?: FloatFieldUpdateOperationsInput | number
    side?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    filledPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    commission?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingOrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    qty?: FloatFieldUpdateOperationsInput | number
    side?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    filledPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    commission?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingPositionCreateInput = {
    id?: string
    symbol: string
    qty: number
    entryPrice: number
    marketPrice: number
    updatedAt?: Date | string
    account: TradingAccountCreateNestedOneWithoutPositionsInput
  }

  export type TradingPositionUncheckedCreateInput = {
    id?: string
    accountId: string
    symbol: string
    qty: number
    entryPrice: number
    marketPrice: number
    updatedAt?: Date | string
  }

  export type TradingPositionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    qty?: FloatFieldUpdateOperationsInput | number
    entryPrice?: FloatFieldUpdateOperationsInput | number
    marketPrice?: FloatFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: TradingAccountUpdateOneRequiredWithoutPositionsNestedInput
  }

  export type TradingPositionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    qty?: FloatFieldUpdateOperationsInput | number
    entryPrice?: FloatFieldUpdateOperationsInput | number
    marketPrice?: FloatFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingPositionCreateManyInput = {
    id?: string
    accountId: string
    symbol: string
    qty: number
    entryPrice: number
    marketPrice: number
    updatedAt?: Date | string
  }

  export type TradingPositionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    qty?: FloatFieldUpdateOperationsInput | number
    entryPrice?: FloatFieldUpdateOperationsInput | number
    marketPrice?: FloatFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingPositionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    qty?: FloatFieldUpdateOperationsInput | number
    entryPrice?: FloatFieldUpdateOperationsInput | number
    marketPrice?: FloatFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemSettingCreateInput = {
    id?: string
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type SystemSettingUncheckedCreateInput = {
    id?: string
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type SystemSettingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemSettingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemSettingCreateManyInput = {
    id?: string
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type SystemSettingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemSettingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomStrategyCreateInput = {
    id?: string
    name: string
    baseType: string
    parameters: JsonNullValueInput | InputJsonValue
    interval: string
    createdAt?: Date | string
    updatedAt?: Date | string
    bots?: TradingBotCreateNestedManyWithoutCustomStrategyInput
  }

  export type CustomStrategyUncheckedCreateInput = {
    id?: string
    name: string
    baseType: string
    parameters: JsonNullValueInput | InputJsonValue
    interval: string
    createdAt?: Date | string
    updatedAt?: Date | string
    bots?: TradingBotUncheckedCreateNestedManyWithoutCustomStrategyInput
  }

  export type CustomStrategyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    baseType?: StringFieldUpdateOperationsInput | string
    parameters?: JsonNullValueInput | InputJsonValue
    interval?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bots?: TradingBotUpdateManyWithoutCustomStrategyNestedInput
  }

  export type CustomStrategyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    baseType?: StringFieldUpdateOperationsInput | string
    parameters?: JsonNullValueInput | InputJsonValue
    interval?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bots?: TradingBotUncheckedUpdateManyWithoutCustomStrategyNestedInput
  }

  export type CustomStrategyCreateManyInput = {
    id?: string
    name: string
    baseType: string
    parameters: JsonNullValueInput | InputJsonValue
    interval: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomStrategyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    baseType?: StringFieldUpdateOperationsInput | string
    parameters?: JsonNullValueInput | InputJsonValue
    interval?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomStrategyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    baseType?: StringFieldUpdateOperationsInput | string
    parameters?: JsonNullValueInput | InputJsonValue
    interval?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingBotCreateInput = {
    id?: string
    name: string
    strategy: string
    parameters: JsonNullValueInput | InputJsonValue
    symbol: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    customStrategy?: CustomStrategyCreateNestedOneWithoutBotsInput
    allocationSession?: AllocationSessionCreateNestedOneWithoutBotsInput
  }

  export type TradingBotUncheckedCreateInput = {
    id?: string
    name: string
    strategy: string
    customStrategyId?: string | null
    parameters: JsonNullValueInput | InputJsonValue
    symbol: string
    active?: boolean
    allocationSessionId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingBotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    strategy?: StringFieldUpdateOperationsInput | string
    parameters?: JsonNullValueInput | InputJsonValue
    symbol?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customStrategy?: CustomStrategyUpdateOneWithoutBotsNestedInput
    allocationSession?: AllocationSessionUpdateOneWithoutBotsNestedInput
  }

  export type TradingBotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    strategy?: StringFieldUpdateOperationsInput | string
    customStrategyId?: NullableStringFieldUpdateOperationsInput | string | null
    parameters?: JsonNullValueInput | InputJsonValue
    symbol?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    allocationSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingBotCreateManyInput = {
    id?: string
    name: string
    strategy: string
    customStrategyId?: string | null
    parameters: JsonNullValueInput | InputJsonValue
    symbol: string
    active?: boolean
    allocationSessionId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingBotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    strategy?: StringFieldUpdateOperationsInput | string
    parameters?: JsonNullValueInput | InputJsonValue
    symbol?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingBotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    strategy?: StringFieldUpdateOperationsInput | string
    customStrategyId?: NullableStringFieldUpdateOperationsInput | string | null
    parameters?: JsonNullValueInput | InputJsonValue
    symbol?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    allocationSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AllocationSessionCreateInput = {
    id?: string
    name: string
    capital: number
    virtualCash: number
    maxDrawdownPct?: number
    enabledMarkets: JsonNullValueInput | InputJsonValue
    provider: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    bots?: TradingBotCreateNestedManyWithoutAllocationSessionInput
  }

  export type AllocationSessionUncheckedCreateInput = {
    id?: string
    name: string
    capital: number
    virtualCash: number
    maxDrawdownPct?: number
    enabledMarkets: JsonNullValueInput | InputJsonValue
    provider: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    bots?: TradingBotUncheckedCreateNestedManyWithoutAllocationSessionInput
  }

  export type AllocationSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capital?: FloatFieldUpdateOperationsInput | number
    virtualCash?: FloatFieldUpdateOperationsInput | number
    maxDrawdownPct?: FloatFieldUpdateOperationsInput | number
    enabledMarkets?: JsonNullValueInput | InputJsonValue
    provider?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bots?: TradingBotUpdateManyWithoutAllocationSessionNestedInput
  }

  export type AllocationSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capital?: FloatFieldUpdateOperationsInput | number
    virtualCash?: FloatFieldUpdateOperationsInput | number
    maxDrawdownPct?: FloatFieldUpdateOperationsInput | number
    enabledMarkets?: JsonNullValueInput | InputJsonValue
    provider?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bots?: TradingBotUncheckedUpdateManyWithoutAllocationSessionNestedInput
  }

  export type AllocationSessionCreateManyInput = {
    id?: string
    name: string
    capital: number
    virtualCash: number
    maxDrawdownPct?: number
    enabledMarkets: JsonNullValueInput | InputJsonValue
    provider: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AllocationSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capital?: FloatFieldUpdateOperationsInput | number
    virtualCash?: FloatFieldUpdateOperationsInput | number
    maxDrawdownPct?: FloatFieldUpdateOperationsInput | number
    enabledMarkets?: JsonNullValueInput | InputJsonValue
    provider?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AllocationSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capital?: FloatFieldUpdateOperationsInput | number
    virtualCash?: FloatFieldUpdateOperationsInput | number
    maxDrawdownPct?: FloatFieldUpdateOperationsInput | number
    enabledMarkets?: JsonNullValueInput | InputJsonValue
    provider?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type HistoricalPriceSymbolIdDateIntervalCompoundUniqueInput = {
    symbolId: string
    date: Date | string
    interval: string
  }

  export type HistoricalPriceCountOrderByAggregateInput = {
    symbolId?: SortOrder
    date?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    interval?: SortOrder
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
    interval?: SortOrder
  }

  export type HistoricalPriceMinOrderByAggregateInput = {
    symbolId?: SortOrder
    date?: SortOrder
    open?: SortOrder
    high?: SortOrder
    low?: SortOrder
    close?: SortOrder
    volume?: SortOrder
    interval?: SortOrder
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

  export type TradingSessionCountOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    accessToken?: SortOrder
    publicToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradingSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    accessToken?: SortOrder
    publicToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradingSessionMinOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    accessToken?: SortOrder
    publicToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type TradingOrderListRelationFilter = {
    every?: TradingOrderWhereInput
    some?: TradingOrderWhereInput
    none?: TradingOrderWhereInput
  }

  export type TradingPositionListRelationFilter = {
    every?: TradingPositionWhereInput
    some?: TradingPositionWhereInput
    none?: TradingPositionWhereInput
  }

  export type TradingOrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TradingPositionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TradingAccountCountOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    name?: SortOrder
    isLive?: SortOrder
    balance?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
  }

  export type TradingAccountAvgOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type TradingAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    name?: SortOrder
    isLive?: SortOrder
    balance?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
  }

  export type TradingAccountMinOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    name?: SortOrder
    isLive?: SortOrder
    balance?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
  }

  export type TradingAccountSumOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type TradingAccountScalarRelationFilter = {
    is?: TradingAccountWhereInput
    isNot?: TradingAccountWhereInput
  }

  export type TradingOrderCountOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    symbol?: SortOrder
    qty?: SortOrder
    side?: SortOrder
    type?: SortOrder
    price?: SortOrder
    status?: SortOrder
    filledPrice?: SortOrder
    commission?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradingOrderAvgOrderByAggregateInput = {
    qty?: SortOrder
    price?: SortOrder
    filledPrice?: SortOrder
    commission?: SortOrder
  }

  export type TradingOrderMaxOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    symbol?: SortOrder
    qty?: SortOrder
    side?: SortOrder
    type?: SortOrder
    price?: SortOrder
    status?: SortOrder
    filledPrice?: SortOrder
    commission?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradingOrderMinOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    symbol?: SortOrder
    qty?: SortOrder
    side?: SortOrder
    type?: SortOrder
    price?: SortOrder
    status?: SortOrder
    filledPrice?: SortOrder
    commission?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradingOrderSumOrderByAggregateInput = {
    qty?: SortOrder
    price?: SortOrder
    filledPrice?: SortOrder
    commission?: SortOrder
  }

  export type TradingPositionCountOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    symbol?: SortOrder
    qty?: SortOrder
    entryPrice?: SortOrder
    marketPrice?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradingPositionAvgOrderByAggregateInput = {
    qty?: SortOrder
    entryPrice?: SortOrder
    marketPrice?: SortOrder
  }

  export type TradingPositionMaxOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    symbol?: SortOrder
    qty?: SortOrder
    entryPrice?: SortOrder
    marketPrice?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradingPositionMinOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    symbol?: SortOrder
    qty?: SortOrder
    entryPrice?: SortOrder
    marketPrice?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradingPositionSumOrderByAggregateInput = {
    qty?: SortOrder
    entryPrice?: SortOrder
    marketPrice?: SortOrder
  }

  export type SystemSettingCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemSettingMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemSettingMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type TradingBotListRelationFilter = {
    every?: TradingBotWhereInput
    some?: TradingBotWhereInput
    none?: TradingBotWhereInput
  }

  export type TradingBotOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CustomStrategyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    baseType?: SortOrder
    parameters?: SortOrder
    interval?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomStrategyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    baseType?: SortOrder
    interval?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomStrategyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    baseType?: SortOrder
    interval?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type CustomStrategyNullableScalarRelationFilter = {
    is?: CustomStrategyWhereInput | null
    isNot?: CustomStrategyWhereInput | null
  }

  export type AllocationSessionNullableScalarRelationFilter = {
    is?: AllocationSessionWhereInput | null
    isNot?: AllocationSessionWhereInput | null
  }

  export type TradingBotCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    strategy?: SortOrder
    customStrategyId?: SortOrder
    parameters?: SortOrder
    symbol?: SortOrder
    active?: SortOrder
    allocationSessionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradingBotMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    strategy?: SortOrder
    customStrategyId?: SortOrder
    symbol?: SortOrder
    active?: SortOrder
    allocationSessionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradingBotMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    strategy?: SortOrder
    customStrategyId?: SortOrder
    symbol?: SortOrder
    active?: SortOrder
    allocationSessionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AllocationSessionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    capital?: SortOrder
    virtualCash?: SortOrder
    maxDrawdownPct?: SortOrder
    enabledMarkets?: SortOrder
    provider?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AllocationSessionAvgOrderByAggregateInput = {
    capital?: SortOrder
    virtualCash?: SortOrder
    maxDrawdownPct?: SortOrder
  }

  export type AllocationSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    capital?: SortOrder
    virtualCash?: SortOrder
    maxDrawdownPct?: SortOrder
    provider?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AllocationSessionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    capital?: SortOrder
    virtualCash?: SortOrder
    maxDrawdownPct?: SortOrder
    provider?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AllocationSessionSumOrderByAggregateInput = {
    capital?: SortOrder
    virtualCash?: SortOrder
    maxDrawdownPct?: SortOrder
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

  export type TradingOrderCreateNestedManyWithoutAccountInput = {
    create?: XOR<TradingOrderCreateWithoutAccountInput, TradingOrderUncheckedCreateWithoutAccountInput> | TradingOrderCreateWithoutAccountInput[] | TradingOrderUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: TradingOrderCreateOrConnectWithoutAccountInput | TradingOrderCreateOrConnectWithoutAccountInput[]
    createMany?: TradingOrderCreateManyAccountInputEnvelope
    connect?: TradingOrderWhereUniqueInput | TradingOrderWhereUniqueInput[]
  }

  export type TradingPositionCreateNestedManyWithoutAccountInput = {
    create?: XOR<TradingPositionCreateWithoutAccountInput, TradingPositionUncheckedCreateWithoutAccountInput> | TradingPositionCreateWithoutAccountInput[] | TradingPositionUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: TradingPositionCreateOrConnectWithoutAccountInput | TradingPositionCreateOrConnectWithoutAccountInput[]
    createMany?: TradingPositionCreateManyAccountInputEnvelope
    connect?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
  }

  export type TradingOrderUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<TradingOrderCreateWithoutAccountInput, TradingOrderUncheckedCreateWithoutAccountInput> | TradingOrderCreateWithoutAccountInput[] | TradingOrderUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: TradingOrderCreateOrConnectWithoutAccountInput | TradingOrderCreateOrConnectWithoutAccountInput[]
    createMany?: TradingOrderCreateManyAccountInputEnvelope
    connect?: TradingOrderWhereUniqueInput | TradingOrderWhereUniqueInput[]
  }

  export type TradingPositionUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<TradingPositionCreateWithoutAccountInput, TradingPositionUncheckedCreateWithoutAccountInput> | TradingPositionCreateWithoutAccountInput[] | TradingPositionUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: TradingPositionCreateOrConnectWithoutAccountInput | TradingPositionCreateOrConnectWithoutAccountInput[]
    createMany?: TradingPositionCreateManyAccountInputEnvelope
    connect?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type TradingOrderUpdateManyWithoutAccountNestedInput = {
    create?: XOR<TradingOrderCreateWithoutAccountInput, TradingOrderUncheckedCreateWithoutAccountInput> | TradingOrderCreateWithoutAccountInput[] | TradingOrderUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: TradingOrderCreateOrConnectWithoutAccountInput | TradingOrderCreateOrConnectWithoutAccountInput[]
    upsert?: TradingOrderUpsertWithWhereUniqueWithoutAccountInput | TradingOrderUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: TradingOrderCreateManyAccountInputEnvelope
    set?: TradingOrderWhereUniqueInput | TradingOrderWhereUniqueInput[]
    disconnect?: TradingOrderWhereUniqueInput | TradingOrderWhereUniqueInput[]
    delete?: TradingOrderWhereUniqueInput | TradingOrderWhereUniqueInput[]
    connect?: TradingOrderWhereUniqueInput | TradingOrderWhereUniqueInput[]
    update?: TradingOrderUpdateWithWhereUniqueWithoutAccountInput | TradingOrderUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: TradingOrderUpdateManyWithWhereWithoutAccountInput | TradingOrderUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: TradingOrderScalarWhereInput | TradingOrderScalarWhereInput[]
  }

  export type TradingPositionUpdateManyWithoutAccountNestedInput = {
    create?: XOR<TradingPositionCreateWithoutAccountInput, TradingPositionUncheckedCreateWithoutAccountInput> | TradingPositionCreateWithoutAccountInput[] | TradingPositionUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: TradingPositionCreateOrConnectWithoutAccountInput | TradingPositionCreateOrConnectWithoutAccountInput[]
    upsert?: TradingPositionUpsertWithWhereUniqueWithoutAccountInput | TradingPositionUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: TradingPositionCreateManyAccountInputEnvelope
    set?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
    disconnect?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
    delete?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
    connect?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
    update?: TradingPositionUpdateWithWhereUniqueWithoutAccountInput | TradingPositionUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: TradingPositionUpdateManyWithWhereWithoutAccountInput | TradingPositionUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: TradingPositionScalarWhereInput | TradingPositionScalarWhereInput[]
  }

  export type TradingOrderUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<TradingOrderCreateWithoutAccountInput, TradingOrderUncheckedCreateWithoutAccountInput> | TradingOrderCreateWithoutAccountInput[] | TradingOrderUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: TradingOrderCreateOrConnectWithoutAccountInput | TradingOrderCreateOrConnectWithoutAccountInput[]
    upsert?: TradingOrderUpsertWithWhereUniqueWithoutAccountInput | TradingOrderUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: TradingOrderCreateManyAccountInputEnvelope
    set?: TradingOrderWhereUniqueInput | TradingOrderWhereUniqueInput[]
    disconnect?: TradingOrderWhereUniqueInput | TradingOrderWhereUniqueInput[]
    delete?: TradingOrderWhereUniqueInput | TradingOrderWhereUniqueInput[]
    connect?: TradingOrderWhereUniqueInput | TradingOrderWhereUniqueInput[]
    update?: TradingOrderUpdateWithWhereUniqueWithoutAccountInput | TradingOrderUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: TradingOrderUpdateManyWithWhereWithoutAccountInput | TradingOrderUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: TradingOrderScalarWhereInput | TradingOrderScalarWhereInput[]
  }

  export type TradingPositionUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<TradingPositionCreateWithoutAccountInput, TradingPositionUncheckedCreateWithoutAccountInput> | TradingPositionCreateWithoutAccountInput[] | TradingPositionUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: TradingPositionCreateOrConnectWithoutAccountInput | TradingPositionCreateOrConnectWithoutAccountInput[]
    upsert?: TradingPositionUpsertWithWhereUniqueWithoutAccountInput | TradingPositionUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: TradingPositionCreateManyAccountInputEnvelope
    set?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
    disconnect?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
    delete?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
    connect?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
    update?: TradingPositionUpdateWithWhereUniqueWithoutAccountInput | TradingPositionUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: TradingPositionUpdateManyWithWhereWithoutAccountInput | TradingPositionUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: TradingPositionScalarWhereInput | TradingPositionScalarWhereInput[]
  }

  export type TradingAccountCreateNestedOneWithoutOrdersInput = {
    create?: XOR<TradingAccountCreateWithoutOrdersInput, TradingAccountUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: TradingAccountCreateOrConnectWithoutOrdersInput
    connect?: TradingAccountWhereUniqueInput
  }

  export type TradingAccountUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: XOR<TradingAccountCreateWithoutOrdersInput, TradingAccountUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: TradingAccountCreateOrConnectWithoutOrdersInput
    upsert?: TradingAccountUpsertWithoutOrdersInput
    connect?: TradingAccountWhereUniqueInput
    update?: XOR<XOR<TradingAccountUpdateToOneWithWhereWithoutOrdersInput, TradingAccountUpdateWithoutOrdersInput>, TradingAccountUncheckedUpdateWithoutOrdersInput>
  }

  export type TradingAccountCreateNestedOneWithoutPositionsInput = {
    create?: XOR<TradingAccountCreateWithoutPositionsInput, TradingAccountUncheckedCreateWithoutPositionsInput>
    connectOrCreate?: TradingAccountCreateOrConnectWithoutPositionsInput
    connect?: TradingAccountWhereUniqueInput
  }

  export type TradingAccountUpdateOneRequiredWithoutPositionsNestedInput = {
    create?: XOR<TradingAccountCreateWithoutPositionsInput, TradingAccountUncheckedCreateWithoutPositionsInput>
    connectOrCreate?: TradingAccountCreateOrConnectWithoutPositionsInput
    upsert?: TradingAccountUpsertWithoutPositionsInput
    connect?: TradingAccountWhereUniqueInput
    update?: XOR<XOR<TradingAccountUpdateToOneWithWhereWithoutPositionsInput, TradingAccountUpdateWithoutPositionsInput>, TradingAccountUncheckedUpdateWithoutPositionsInput>
  }

  export type TradingBotCreateNestedManyWithoutCustomStrategyInput = {
    create?: XOR<TradingBotCreateWithoutCustomStrategyInput, TradingBotUncheckedCreateWithoutCustomStrategyInput> | TradingBotCreateWithoutCustomStrategyInput[] | TradingBotUncheckedCreateWithoutCustomStrategyInput[]
    connectOrCreate?: TradingBotCreateOrConnectWithoutCustomStrategyInput | TradingBotCreateOrConnectWithoutCustomStrategyInput[]
    createMany?: TradingBotCreateManyCustomStrategyInputEnvelope
    connect?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
  }

  export type TradingBotUncheckedCreateNestedManyWithoutCustomStrategyInput = {
    create?: XOR<TradingBotCreateWithoutCustomStrategyInput, TradingBotUncheckedCreateWithoutCustomStrategyInput> | TradingBotCreateWithoutCustomStrategyInput[] | TradingBotUncheckedCreateWithoutCustomStrategyInput[]
    connectOrCreate?: TradingBotCreateOrConnectWithoutCustomStrategyInput | TradingBotCreateOrConnectWithoutCustomStrategyInput[]
    createMany?: TradingBotCreateManyCustomStrategyInputEnvelope
    connect?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
  }

  export type TradingBotUpdateManyWithoutCustomStrategyNestedInput = {
    create?: XOR<TradingBotCreateWithoutCustomStrategyInput, TradingBotUncheckedCreateWithoutCustomStrategyInput> | TradingBotCreateWithoutCustomStrategyInput[] | TradingBotUncheckedCreateWithoutCustomStrategyInput[]
    connectOrCreate?: TradingBotCreateOrConnectWithoutCustomStrategyInput | TradingBotCreateOrConnectWithoutCustomStrategyInput[]
    upsert?: TradingBotUpsertWithWhereUniqueWithoutCustomStrategyInput | TradingBotUpsertWithWhereUniqueWithoutCustomStrategyInput[]
    createMany?: TradingBotCreateManyCustomStrategyInputEnvelope
    set?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
    disconnect?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
    delete?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
    connect?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
    update?: TradingBotUpdateWithWhereUniqueWithoutCustomStrategyInput | TradingBotUpdateWithWhereUniqueWithoutCustomStrategyInput[]
    updateMany?: TradingBotUpdateManyWithWhereWithoutCustomStrategyInput | TradingBotUpdateManyWithWhereWithoutCustomStrategyInput[]
    deleteMany?: TradingBotScalarWhereInput | TradingBotScalarWhereInput[]
  }

  export type TradingBotUncheckedUpdateManyWithoutCustomStrategyNestedInput = {
    create?: XOR<TradingBotCreateWithoutCustomStrategyInput, TradingBotUncheckedCreateWithoutCustomStrategyInput> | TradingBotCreateWithoutCustomStrategyInput[] | TradingBotUncheckedCreateWithoutCustomStrategyInput[]
    connectOrCreate?: TradingBotCreateOrConnectWithoutCustomStrategyInput | TradingBotCreateOrConnectWithoutCustomStrategyInput[]
    upsert?: TradingBotUpsertWithWhereUniqueWithoutCustomStrategyInput | TradingBotUpsertWithWhereUniqueWithoutCustomStrategyInput[]
    createMany?: TradingBotCreateManyCustomStrategyInputEnvelope
    set?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
    disconnect?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
    delete?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
    connect?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
    update?: TradingBotUpdateWithWhereUniqueWithoutCustomStrategyInput | TradingBotUpdateWithWhereUniqueWithoutCustomStrategyInput[]
    updateMany?: TradingBotUpdateManyWithWhereWithoutCustomStrategyInput | TradingBotUpdateManyWithWhereWithoutCustomStrategyInput[]
    deleteMany?: TradingBotScalarWhereInput | TradingBotScalarWhereInput[]
  }

  export type CustomStrategyCreateNestedOneWithoutBotsInput = {
    create?: XOR<CustomStrategyCreateWithoutBotsInput, CustomStrategyUncheckedCreateWithoutBotsInput>
    connectOrCreate?: CustomStrategyCreateOrConnectWithoutBotsInput
    connect?: CustomStrategyWhereUniqueInput
  }

  export type AllocationSessionCreateNestedOneWithoutBotsInput = {
    create?: XOR<AllocationSessionCreateWithoutBotsInput, AllocationSessionUncheckedCreateWithoutBotsInput>
    connectOrCreate?: AllocationSessionCreateOrConnectWithoutBotsInput
    connect?: AllocationSessionWhereUniqueInput
  }

  export type CustomStrategyUpdateOneWithoutBotsNestedInput = {
    create?: XOR<CustomStrategyCreateWithoutBotsInput, CustomStrategyUncheckedCreateWithoutBotsInput>
    connectOrCreate?: CustomStrategyCreateOrConnectWithoutBotsInput
    upsert?: CustomStrategyUpsertWithoutBotsInput
    disconnect?: CustomStrategyWhereInput | boolean
    delete?: CustomStrategyWhereInput | boolean
    connect?: CustomStrategyWhereUniqueInput
    update?: XOR<XOR<CustomStrategyUpdateToOneWithWhereWithoutBotsInput, CustomStrategyUpdateWithoutBotsInput>, CustomStrategyUncheckedUpdateWithoutBotsInput>
  }

  export type AllocationSessionUpdateOneWithoutBotsNestedInput = {
    create?: XOR<AllocationSessionCreateWithoutBotsInput, AllocationSessionUncheckedCreateWithoutBotsInput>
    connectOrCreate?: AllocationSessionCreateOrConnectWithoutBotsInput
    upsert?: AllocationSessionUpsertWithoutBotsInput
    disconnect?: AllocationSessionWhereInput | boolean
    delete?: AllocationSessionWhereInput | boolean
    connect?: AllocationSessionWhereUniqueInput
    update?: XOR<XOR<AllocationSessionUpdateToOneWithWhereWithoutBotsInput, AllocationSessionUpdateWithoutBotsInput>, AllocationSessionUncheckedUpdateWithoutBotsInput>
  }

  export type TradingBotCreateNestedManyWithoutAllocationSessionInput = {
    create?: XOR<TradingBotCreateWithoutAllocationSessionInput, TradingBotUncheckedCreateWithoutAllocationSessionInput> | TradingBotCreateWithoutAllocationSessionInput[] | TradingBotUncheckedCreateWithoutAllocationSessionInput[]
    connectOrCreate?: TradingBotCreateOrConnectWithoutAllocationSessionInput | TradingBotCreateOrConnectWithoutAllocationSessionInput[]
    createMany?: TradingBotCreateManyAllocationSessionInputEnvelope
    connect?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
  }

  export type TradingBotUncheckedCreateNestedManyWithoutAllocationSessionInput = {
    create?: XOR<TradingBotCreateWithoutAllocationSessionInput, TradingBotUncheckedCreateWithoutAllocationSessionInput> | TradingBotCreateWithoutAllocationSessionInput[] | TradingBotUncheckedCreateWithoutAllocationSessionInput[]
    connectOrCreate?: TradingBotCreateOrConnectWithoutAllocationSessionInput | TradingBotCreateOrConnectWithoutAllocationSessionInput[]
    createMany?: TradingBotCreateManyAllocationSessionInputEnvelope
    connect?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
  }

  export type TradingBotUpdateManyWithoutAllocationSessionNestedInput = {
    create?: XOR<TradingBotCreateWithoutAllocationSessionInput, TradingBotUncheckedCreateWithoutAllocationSessionInput> | TradingBotCreateWithoutAllocationSessionInput[] | TradingBotUncheckedCreateWithoutAllocationSessionInput[]
    connectOrCreate?: TradingBotCreateOrConnectWithoutAllocationSessionInput | TradingBotCreateOrConnectWithoutAllocationSessionInput[]
    upsert?: TradingBotUpsertWithWhereUniqueWithoutAllocationSessionInput | TradingBotUpsertWithWhereUniqueWithoutAllocationSessionInput[]
    createMany?: TradingBotCreateManyAllocationSessionInputEnvelope
    set?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
    disconnect?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
    delete?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
    connect?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
    update?: TradingBotUpdateWithWhereUniqueWithoutAllocationSessionInput | TradingBotUpdateWithWhereUniqueWithoutAllocationSessionInput[]
    updateMany?: TradingBotUpdateManyWithWhereWithoutAllocationSessionInput | TradingBotUpdateManyWithWhereWithoutAllocationSessionInput[]
    deleteMany?: TradingBotScalarWhereInput | TradingBotScalarWhereInput[]
  }

  export type TradingBotUncheckedUpdateManyWithoutAllocationSessionNestedInput = {
    create?: XOR<TradingBotCreateWithoutAllocationSessionInput, TradingBotUncheckedCreateWithoutAllocationSessionInput> | TradingBotCreateWithoutAllocationSessionInput[] | TradingBotUncheckedCreateWithoutAllocationSessionInput[]
    connectOrCreate?: TradingBotCreateOrConnectWithoutAllocationSessionInput | TradingBotCreateOrConnectWithoutAllocationSessionInput[]
    upsert?: TradingBotUpsertWithWhereUniqueWithoutAllocationSessionInput | TradingBotUpsertWithWhereUniqueWithoutAllocationSessionInput[]
    createMany?: TradingBotCreateManyAllocationSessionInputEnvelope
    set?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
    disconnect?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
    delete?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
    connect?: TradingBotWhereUniqueInput | TradingBotWhereUniqueInput[]
    update?: TradingBotUpdateWithWhereUniqueWithoutAllocationSessionInput | TradingBotUpdateWithWhereUniqueWithoutAllocationSessionInput[]
    updateMany?: TradingBotUpdateManyWithWhereWithoutAllocationSessionInput | TradingBotUpdateManyWithWhereWithoutAllocationSessionInput[]
    deleteMany?: TradingBotScalarWhereInput | TradingBotScalarWhereInput[]
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type HistoricalPriceCreateWithoutSymbolInput = {
    date: Date | string
    open: number
    high: number
    low: number
    close: number
    volume: number
    interval?: string
  }

  export type HistoricalPriceUncheckedCreateWithoutSymbolInput = {
    date: Date | string
    open: number
    high: number
    low: number
    close: number
    volume: number
    interval?: string
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
    interval?: StringFilter<"HistoricalPrice"> | string
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

  export type TradingOrderCreateWithoutAccountInput = {
    id?: string
    symbol: string
    qty: number
    side: string
    type: string
    price?: number | null
    status: string
    filledPrice?: number | null
    commission?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingOrderUncheckedCreateWithoutAccountInput = {
    id?: string
    symbol: string
    qty: number
    side: string
    type: string
    price?: number | null
    status: string
    filledPrice?: number | null
    commission?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingOrderCreateOrConnectWithoutAccountInput = {
    where: TradingOrderWhereUniqueInput
    create: XOR<TradingOrderCreateWithoutAccountInput, TradingOrderUncheckedCreateWithoutAccountInput>
  }

  export type TradingOrderCreateManyAccountInputEnvelope = {
    data: TradingOrderCreateManyAccountInput | TradingOrderCreateManyAccountInput[]
    skipDuplicates?: boolean
  }

  export type TradingPositionCreateWithoutAccountInput = {
    id?: string
    symbol: string
    qty: number
    entryPrice: number
    marketPrice: number
    updatedAt?: Date | string
  }

  export type TradingPositionUncheckedCreateWithoutAccountInput = {
    id?: string
    symbol: string
    qty: number
    entryPrice: number
    marketPrice: number
    updatedAt?: Date | string
  }

  export type TradingPositionCreateOrConnectWithoutAccountInput = {
    where: TradingPositionWhereUniqueInput
    create: XOR<TradingPositionCreateWithoutAccountInput, TradingPositionUncheckedCreateWithoutAccountInput>
  }

  export type TradingPositionCreateManyAccountInputEnvelope = {
    data: TradingPositionCreateManyAccountInput | TradingPositionCreateManyAccountInput[]
    skipDuplicates?: boolean
  }

  export type TradingOrderUpsertWithWhereUniqueWithoutAccountInput = {
    where: TradingOrderWhereUniqueInput
    update: XOR<TradingOrderUpdateWithoutAccountInput, TradingOrderUncheckedUpdateWithoutAccountInput>
    create: XOR<TradingOrderCreateWithoutAccountInput, TradingOrderUncheckedCreateWithoutAccountInput>
  }

  export type TradingOrderUpdateWithWhereUniqueWithoutAccountInput = {
    where: TradingOrderWhereUniqueInput
    data: XOR<TradingOrderUpdateWithoutAccountInput, TradingOrderUncheckedUpdateWithoutAccountInput>
  }

  export type TradingOrderUpdateManyWithWhereWithoutAccountInput = {
    where: TradingOrderScalarWhereInput
    data: XOR<TradingOrderUpdateManyMutationInput, TradingOrderUncheckedUpdateManyWithoutAccountInput>
  }

  export type TradingOrderScalarWhereInput = {
    AND?: TradingOrderScalarWhereInput | TradingOrderScalarWhereInput[]
    OR?: TradingOrderScalarWhereInput[]
    NOT?: TradingOrderScalarWhereInput | TradingOrderScalarWhereInput[]
    id?: StringFilter<"TradingOrder"> | string
    accountId?: StringFilter<"TradingOrder"> | string
    symbol?: StringFilter<"TradingOrder"> | string
    qty?: FloatFilter<"TradingOrder"> | number
    side?: StringFilter<"TradingOrder"> | string
    type?: StringFilter<"TradingOrder"> | string
    price?: FloatNullableFilter<"TradingOrder"> | number | null
    status?: StringFilter<"TradingOrder"> | string
    filledPrice?: FloatNullableFilter<"TradingOrder"> | number | null
    commission?: FloatFilter<"TradingOrder"> | number
    createdAt?: DateTimeFilter<"TradingOrder"> | Date | string
    updatedAt?: DateTimeFilter<"TradingOrder"> | Date | string
  }

  export type TradingPositionUpsertWithWhereUniqueWithoutAccountInput = {
    where: TradingPositionWhereUniqueInput
    update: XOR<TradingPositionUpdateWithoutAccountInput, TradingPositionUncheckedUpdateWithoutAccountInput>
    create: XOR<TradingPositionCreateWithoutAccountInput, TradingPositionUncheckedCreateWithoutAccountInput>
  }

  export type TradingPositionUpdateWithWhereUniqueWithoutAccountInput = {
    where: TradingPositionWhereUniqueInput
    data: XOR<TradingPositionUpdateWithoutAccountInput, TradingPositionUncheckedUpdateWithoutAccountInput>
  }

  export type TradingPositionUpdateManyWithWhereWithoutAccountInput = {
    where: TradingPositionScalarWhereInput
    data: XOR<TradingPositionUpdateManyMutationInput, TradingPositionUncheckedUpdateManyWithoutAccountInput>
  }

  export type TradingPositionScalarWhereInput = {
    AND?: TradingPositionScalarWhereInput | TradingPositionScalarWhereInput[]
    OR?: TradingPositionScalarWhereInput[]
    NOT?: TradingPositionScalarWhereInput | TradingPositionScalarWhereInput[]
    id?: StringFilter<"TradingPosition"> | string
    accountId?: StringFilter<"TradingPosition"> | string
    symbol?: StringFilter<"TradingPosition"> | string
    qty?: FloatFilter<"TradingPosition"> | number
    entryPrice?: FloatFilter<"TradingPosition"> | number
    marketPrice?: FloatFilter<"TradingPosition"> | number
    updatedAt?: DateTimeFilter<"TradingPosition"> | Date | string
  }

  export type TradingAccountCreateWithoutOrdersInput = {
    id?: string
    provider: string
    name: string
    isLive?: boolean
    balance: number
    currency?: string
    createdAt?: Date | string
    positions?: TradingPositionCreateNestedManyWithoutAccountInput
  }

  export type TradingAccountUncheckedCreateWithoutOrdersInput = {
    id?: string
    provider: string
    name: string
    isLive?: boolean
    balance: number
    currency?: string
    createdAt?: Date | string
    positions?: TradingPositionUncheckedCreateNestedManyWithoutAccountInput
  }

  export type TradingAccountCreateOrConnectWithoutOrdersInput = {
    where: TradingAccountWhereUniqueInput
    create: XOR<TradingAccountCreateWithoutOrdersInput, TradingAccountUncheckedCreateWithoutOrdersInput>
  }

  export type TradingAccountUpsertWithoutOrdersInput = {
    update: XOR<TradingAccountUpdateWithoutOrdersInput, TradingAccountUncheckedUpdateWithoutOrdersInput>
    create: XOR<TradingAccountCreateWithoutOrdersInput, TradingAccountUncheckedCreateWithoutOrdersInput>
    where?: TradingAccountWhereInput
  }

  export type TradingAccountUpdateToOneWithWhereWithoutOrdersInput = {
    where?: TradingAccountWhereInput
    data: XOR<TradingAccountUpdateWithoutOrdersInput, TradingAccountUncheckedUpdateWithoutOrdersInput>
  }

  export type TradingAccountUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isLive?: BoolFieldUpdateOperationsInput | boolean
    balance?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    positions?: TradingPositionUpdateManyWithoutAccountNestedInput
  }

  export type TradingAccountUncheckedUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isLive?: BoolFieldUpdateOperationsInput | boolean
    balance?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    positions?: TradingPositionUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type TradingAccountCreateWithoutPositionsInput = {
    id?: string
    provider: string
    name: string
    isLive?: boolean
    balance: number
    currency?: string
    createdAt?: Date | string
    orders?: TradingOrderCreateNestedManyWithoutAccountInput
  }

  export type TradingAccountUncheckedCreateWithoutPositionsInput = {
    id?: string
    provider: string
    name: string
    isLive?: boolean
    balance: number
    currency?: string
    createdAt?: Date | string
    orders?: TradingOrderUncheckedCreateNestedManyWithoutAccountInput
  }

  export type TradingAccountCreateOrConnectWithoutPositionsInput = {
    where: TradingAccountWhereUniqueInput
    create: XOR<TradingAccountCreateWithoutPositionsInput, TradingAccountUncheckedCreateWithoutPositionsInput>
  }

  export type TradingAccountUpsertWithoutPositionsInput = {
    update: XOR<TradingAccountUpdateWithoutPositionsInput, TradingAccountUncheckedUpdateWithoutPositionsInput>
    create: XOR<TradingAccountCreateWithoutPositionsInput, TradingAccountUncheckedCreateWithoutPositionsInput>
    where?: TradingAccountWhereInput
  }

  export type TradingAccountUpdateToOneWithWhereWithoutPositionsInput = {
    where?: TradingAccountWhereInput
    data: XOR<TradingAccountUpdateWithoutPositionsInput, TradingAccountUncheckedUpdateWithoutPositionsInput>
  }

  export type TradingAccountUpdateWithoutPositionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isLive?: BoolFieldUpdateOperationsInput | boolean
    balance?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: TradingOrderUpdateManyWithoutAccountNestedInput
  }

  export type TradingAccountUncheckedUpdateWithoutPositionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isLive?: BoolFieldUpdateOperationsInput | boolean
    balance?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: TradingOrderUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type TradingBotCreateWithoutCustomStrategyInput = {
    id?: string
    name: string
    strategy: string
    parameters: JsonNullValueInput | InputJsonValue
    symbol: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    allocationSession?: AllocationSessionCreateNestedOneWithoutBotsInput
  }

  export type TradingBotUncheckedCreateWithoutCustomStrategyInput = {
    id?: string
    name: string
    strategy: string
    parameters: JsonNullValueInput | InputJsonValue
    symbol: string
    active?: boolean
    allocationSessionId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingBotCreateOrConnectWithoutCustomStrategyInput = {
    where: TradingBotWhereUniqueInput
    create: XOR<TradingBotCreateWithoutCustomStrategyInput, TradingBotUncheckedCreateWithoutCustomStrategyInput>
  }

  export type TradingBotCreateManyCustomStrategyInputEnvelope = {
    data: TradingBotCreateManyCustomStrategyInput | TradingBotCreateManyCustomStrategyInput[]
    skipDuplicates?: boolean
  }

  export type TradingBotUpsertWithWhereUniqueWithoutCustomStrategyInput = {
    where: TradingBotWhereUniqueInput
    update: XOR<TradingBotUpdateWithoutCustomStrategyInput, TradingBotUncheckedUpdateWithoutCustomStrategyInput>
    create: XOR<TradingBotCreateWithoutCustomStrategyInput, TradingBotUncheckedCreateWithoutCustomStrategyInput>
  }

  export type TradingBotUpdateWithWhereUniqueWithoutCustomStrategyInput = {
    where: TradingBotWhereUniqueInput
    data: XOR<TradingBotUpdateWithoutCustomStrategyInput, TradingBotUncheckedUpdateWithoutCustomStrategyInput>
  }

  export type TradingBotUpdateManyWithWhereWithoutCustomStrategyInput = {
    where: TradingBotScalarWhereInput
    data: XOR<TradingBotUpdateManyMutationInput, TradingBotUncheckedUpdateManyWithoutCustomStrategyInput>
  }

  export type TradingBotScalarWhereInput = {
    AND?: TradingBotScalarWhereInput | TradingBotScalarWhereInput[]
    OR?: TradingBotScalarWhereInput[]
    NOT?: TradingBotScalarWhereInput | TradingBotScalarWhereInput[]
    id?: StringFilter<"TradingBot"> | string
    name?: StringFilter<"TradingBot"> | string
    strategy?: StringFilter<"TradingBot"> | string
    customStrategyId?: StringNullableFilter<"TradingBot"> | string | null
    parameters?: JsonFilter<"TradingBot">
    symbol?: StringFilter<"TradingBot"> | string
    active?: BoolFilter<"TradingBot"> | boolean
    allocationSessionId?: StringNullableFilter<"TradingBot"> | string | null
    createdAt?: DateTimeFilter<"TradingBot"> | Date | string
    updatedAt?: DateTimeFilter<"TradingBot"> | Date | string
  }

  export type CustomStrategyCreateWithoutBotsInput = {
    id?: string
    name: string
    baseType: string
    parameters: JsonNullValueInput | InputJsonValue
    interval: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomStrategyUncheckedCreateWithoutBotsInput = {
    id?: string
    name: string
    baseType: string
    parameters: JsonNullValueInput | InputJsonValue
    interval: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomStrategyCreateOrConnectWithoutBotsInput = {
    where: CustomStrategyWhereUniqueInput
    create: XOR<CustomStrategyCreateWithoutBotsInput, CustomStrategyUncheckedCreateWithoutBotsInput>
  }

  export type AllocationSessionCreateWithoutBotsInput = {
    id?: string
    name: string
    capital: number
    virtualCash: number
    maxDrawdownPct?: number
    enabledMarkets: JsonNullValueInput | InputJsonValue
    provider: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AllocationSessionUncheckedCreateWithoutBotsInput = {
    id?: string
    name: string
    capital: number
    virtualCash: number
    maxDrawdownPct?: number
    enabledMarkets: JsonNullValueInput | InputJsonValue
    provider: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AllocationSessionCreateOrConnectWithoutBotsInput = {
    where: AllocationSessionWhereUniqueInput
    create: XOR<AllocationSessionCreateWithoutBotsInput, AllocationSessionUncheckedCreateWithoutBotsInput>
  }

  export type CustomStrategyUpsertWithoutBotsInput = {
    update: XOR<CustomStrategyUpdateWithoutBotsInput, CustomStrategyUncheckedUpdateWithoutBotsInput>
    create: XOR<CustomStrategyCreateWithoutBotsInput, CustomStrategyUncheckedCreateWithoutBotsInput>
    where?: CustomStrategyWhereInput
  }

  export type CustomStrategyUpdateToOneWithWhereWithoutBotsInput = {
    where?: CustomStrategyWhereInput
    data: XOR<CustomStrategyUpdateWithoutBotsInput, CustomStrategyUncheckedUpdateWithoutBotsInput>
  }

  export type CustomStrategyUpdateWithoutBotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    baseType?: StringFieldUpdateOperationsInput | string
    parameters?: JsonNullValueInput | InputJsonValue
    interval?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomStrategyUncheckedUpdateWithoutBotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    baseType?: StringFieldUpdateOperationsInput | string
    parameters?: JsonNullValueInput | InputJsonValue
    interval?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AllocationSessionUpsertWithoutBotsInput = {
    update: XOR<AllocationSessionUpdateWithoutBotsInput, AllocationSessionUncheckedUpdateWithoutBotsInput>
    create: XOR<AllocationSessionCreateWithoutBotsInput, AllocationSessionUncheckedCreateWithoutBotsInput>
    where?: AllocationSessionWhereInput
  }

  export type AllocationSessionUpdateToOneWithWhereWithoutBotsInput = {
    where?: AllocationSessionWhereInput
    data: XOR<AllocationSessionUpdateWithoutBotsInput, AllocationSessionUncheckedUpdateWithoutBotsInput>
  }

  export type AllocationSessionUpdateWithoutBotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capital?: FloatFieldUpdateOperationsInput | number
    virtualCash?: FloatFieldUpdateOperationsInput | number
    maxDrawdownPct?: FloatFieldUpdateOperationsInput | number
    enabledMarkets?: JsonNullValueInput | InputJsonValue
    provider?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AllocationSessionUncheckedUpdateWithoutBotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capital?: FloatFieldUpdateOperationsInput | number
    virtualCash?: FloatFieldUpdateOperationsInput | number
    maxDrawdownPct?: FloatFieldUpdateOperationsInput | number
    enabledMarkets?: JsonNullValueInput | InputJsonValue
    provider?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingBotCreateWithoutAllocationSessionInput = {
    id?: string
    name: string
    strategy: string
    parameters: JsonNullValueInput | InputJsonValue
    symbol: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    customStrategy?: CustomStrategyCreateNestedOneWithoutBotsInput
  }

  export type TradingBotUncheckedCreateWithoutAllocationSessionInput = {
    id?: string
    name: string
    strategy: string
    customStrategyId?: string | null
    parameters: JsonNullValueInput | InputJsonValue
    symbol: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingBotCreateOrConnectWithoutAllocationSessionInput = {
    where: TradingBotWhereUniqueInput
    create: XOR<TradingBotCreateWithoutAllocationSessionInput, TradingBotUncheckedCreateWithoutAllocationSessionInput>
  }

  export type TradingBotCreateManyAllocationSessionInputEnvelope = {
    data: TradingBotCreateManyAllocationSessionInput | TradingBotCreateManyAllocationSessionInput[]
    skipDuplicates?: boolean
  }

  export type TradingBotUpsertWithWhereUniqueWithoutAllocationSessionInput = {
    where: TradingBotWhereUniqueInput
    update: XOR<TradingBotUpdateWithoutAllocationSessionInput, TradingBotUncheckedUpdateWithoutAllocationSessionInput>
    create: XOR<TradingBotCreateWithoutAllocationSessionInput, TradingBotUncheckedCreateWithoutAllocationSessionInput>
  }

  export type TradingBotUpdateWithWhereUniqueWithoutAllocationSessionInput = {
    where: TradingBotWhereUniqueInput
    data: XOR<TradingBotUpdateWithoutAllocationSessionInput, TradingBotUncheckedUpdateWithoutAllocationSessionInput>
  }

  export type TradingBotUpdateManyWithWhereWithoutAllocationSessionInput = {
    where: TradingBotScalarWhereInput
    data: XOR<TradingBotUpdateManyMutationInput, TradingBotUncheckedUpdateManyWithoutAllocationSessionInput>
  }

  export type HistoricalPriceCreateManySymbolInput = {
    date: Date | string
    open: number
    high: number
    low: number
    close: number
    volume: number
    interval?: string
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
    interval?: StringFieldUpdateOperationsInput | string
  }

  export type HistoricalPriceUncheckedUpdateWithoutSymbolInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: FloatFieldUpdateOperationsInput | number
    high?: FloatFieldUpdateOperationsInput | number
    low?: FloatFieldUpdateOperationsInput | number
    close?: FloatFieldUpdateOperationsInput | number
    volume?: FloatFieldUpdateOperationsInput | number
    interval?: StringFieldUpdateOperationsInput | string
  }

  export type HistoricalPriceUncheckedUpdateManyWithoutSymbolInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    open?: FloatFieldUpdateOperationsInput | number
    high?: FloatFieldUpdateOperationsInput | number
    low?: FloatFieldUpdateOperationsInput | number
    close?: FloatFieldUpdateOperationsInput | number
    volume?: FloatFieldUpdateOperationsInput | number
    interval?: StringFieldUpdateOperationsInput | string
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

  export type TradingOrderCreateManyAccountInput = {
    id?: string
    symbol: string
    qty: number
    side: string
    type: string
    price?: number | null
    status: string
    filledPrice?: number | null
    commission?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingPositionCreateManyAccountInput = {
    id?: string
    symbol: string
    qty: number
    entryPrice: number
    marketPrice: number
    updatedAt?: Date | string
  }

  export type TradingOrderUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    qty?: FloatFieldUpdateOperationsInput | number
    side?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    filledPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    commission?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingOrderUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    qty?: FloatFieldUpdateOperationsInput | number
    side?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    filledPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    commission?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingOrderUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    qty?: FloatFieldUpdateOperationsInput | number
    side?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    filledPrice?: NullableFloatFieldUpdateOperationsInput | number | null
    commission?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingPositionUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    qty?: FloatFieldUpdateOperationsInput | number
    entryPrice?: FloatFieldUpdateOperationsInput | number
    marketPrice?: FloatFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingPositionUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    qty?: FloatFieldUpdateOperationsInput | number
    entryPrice?: FloatFieldUpdateOperationsInput | number
    marketPrice?: FloatFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingPositionUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    qty?: FloatFieldUpdateOperationsInput | number
    entryPrice?: FloatFieldUpdateOperationsInput | number
    marketPrice?: FloatFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingBotCreateManyCustomStrategyInput = {
    id?: string
    name: string
    strategy: string
    parameters: JsonNullValueInput | InputJsonValue
    symbol: string
    active?: boolean
    allocationSessionId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingBotUpdateWithoutCustomStrategyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    strategy?: StringFieldUpdateOperationsInput | string
    parameters?: JsonNullValueInput | InputJsonValue
    symbol?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    allocationSession?: AllocationSessionUpdateOneWithoutBotsNestedInput
  }

  export type TradingBotUncheckedUpdateWithoutCustomStrategyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    strategy?: StringFieldUpdateOperationsInput | string
    parameters?: JsonNullValueInput | InputJsonValue
    symbol?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    allocationSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingBotUncheckedUpdateManyWithoutCustomStrategyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    strategy?: StringFieldUpdateOperationsInput | string
    parameters?: JsonNullValueInput | InputJsonValue
    symbol?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    allocationSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingBotCreateManyAllocationSessionInput = {
    id?: string
    name: string
    strategy: string
    customStrategyId?: string | null
    parameters: JsonNullValueInput | InputJsonValue
    symbol: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingBotUpdateWithoutAllocationSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    strategy?: StringFieldUpdateOperationsInput | string
    parameters?: JsonNullValueInput | InputJsonValue
    symbol?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customStrategy?: CustomStrategyUpdateOneWithoutBotsNestedInput
  }

  export type TradingBotUncheckedUpdateWithoutAllocationSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    strategy?: StringFieldUpdateOperationsInput | string
    customStrategyId?: NullableStringFieldUpdateOperationsInput | string | null
    parameters?: JsonNullValueInput | InputJsonValue
    symbol?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingBotUncheckedUpdateManyWithoutAllocationSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    strategy?: StringFieldUpdateOperationsInput | string
    customStrategyId?: NullableStringFieldUpdateOperationsInput | string | null
    parameters?: JsonNullValueInput | InputJsonValue
    symbol?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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