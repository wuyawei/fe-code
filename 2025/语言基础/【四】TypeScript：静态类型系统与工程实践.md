## 四、TypeScript：静态类型系统与工程实践

TypeScript (TS) 是 JavaScript 的一个**超集 (Superset)**，由微软开发并维护。它在 JavaScript 的基础上添加了**静态类型系统**以及其他一些基于 ECMAScript 未来提案的特性。最终，TypeScript 代码会被编译成纯 JavaScript 代码在浏览器或 Node.js 环境中运行。引入静态类型旨在提高代码的健壮性、可读性、可维护性，并增强开发工具（如 IDE）的功能。

### 4.1 TypeScript 基础与类型系统

#### 4.1.1 为什么使用 TypeScript?

-   **静态类型检查 (Static Type Checking)**: 在**编译阶段**就能发现许多常见的类型错误（如拼写错误、传递错误类型的参数、访问不存在的属性等），减少运行时的 Bug，提高代码质量。
-   **代码可读性与可维护性 (Readability & Maintainability)**: 类型注解就像是代码的文档，清晰地表达了变量、函数参数、返回值的预期类型，使代码意图更明确，更易于理解和长期维护。
-   **更好的工具支持 (Tooling)**: 强大的类型系统使得 IDE 能够提供更精准的**智能提示 (IntelliSense)**、**自动补全**、**代码导航**和**重构**功能，极大地提升了开发效率。
-   **面向大型项目**: 对于复杂、多人协作的大型项目，类型系统带来的约束和清晰度尤为重要。
-   **渐进式引入**: TypeScript 可以与 JavaScript 代码共存，允许项目逐步迁移。

#### 4.1.2 基本类型 (Basic Types)

TypeScript 继承了 JavaScript 的原始类型，并为其提供了明确的类型注解。

-   `string`: 文本字符串。`let name: string = "Alice";`
-   `number`: 数字 (整数和浮点数)。`let age: number = 30;`
-   `boolean`: 布尔值 (`true` 或 `false`)。`let isActive: boolean = true;`
-   `null`: 表示空值。`let data: null = null;` (作为独立类型意义不大，常用于联合类型)
-   `undefined`: 表示未定义。`let description: undefined = undefined;` (同上)
-   `symbol`: 独一无二的值。`let id: symbol = Symbol("key");`
-   `bigint`: 任意精度整数。`let largeNumber: bigint = 12345678901234567890n;`
-   **数组 (Array)**: 有两种表示方式：
    -   `Type[]`: `let numbers: number[] = [1, 2, 3];`
    -   `Array<Type>` (泛型语法): `let names: Array<string> = ["Alice", "Bob"];`
-   **元组 (Tuple)**: 表示一个**已知元素数量和类型**的数组，各元素类型不必相同。
    ```typescript
    let user: [string, number, boolean] = ["Charlie", 25, true];
    // user[0].substr(1); // OK
    // user[1] = "David"; // Error: Type 'string' is not assignable to type 'number'.
    // 访问越界元素会使用联合类型（不推荐）
    ```
-   **枚举 (Enum)**: 为一组数值常量赋予友好的名字。默认情况下，成员从 0 开始编号。可以手动指定值（数值或字符串）。
    ```typescript
    enum Color { Red, Green, Blue } // Red = 0, Green = 1, Blue = 2
    let c: Color = Color.Green; // 1

    enum Direction { Up = "UP", Down = "DOWN", Left = "LEFT", Right = "RIGHT" }
    let dir: Direction = Direction.Left; // "LEFT"
    ```

#### 4.1.3 特殊类型 (Special Types)

-   **`any`**: 表示任意类型。使用 `any` 会**完全绕过 TypeScript 的类型检查**。应尽量避免使用 `any`，因为它会失去 TypeScript 带来的类型安全优势。仅在无法确定类型或从旧 JS 代码迁移时少量使用。
    ```typescript
    let looselyTyped: any = 4;
    looselyTyped.ifItExists(); // OK at compile time, but will fail at runtime
    looselyTyped = "hello";   // OK
    ```
-   **`unknown`** (TS 3.0): 类型安全的 `any`。表示一个未知类型的值。可以将任何类型的值赋给 `unknown`，但不能将 `unknown` 类型的值赋给除了 `any` 和 `unknown` 之外的任何类型，也不能直接对其进行操作（如访问属性、调用方法）。必须先进行**类型收窄 (Type Narrowing)**（如使用 `typeof`, `instanceof` 或类型断言）才能安全使用。**推荐使用 `unknown` 替代 `any`**。
    ```typescript
    let surelyTyped: unknown = 4;
    // surelyTyped.toFixed(); // Error: Object is of type 'unknown'.
    if (typeof surelyTyped === 'number') {
      surelyTyped.toFixed(); // OK, type narrowed to number
    }
    ```
-   **`void`**: 表示没有任何类型。通常用作不返回任何值的函数的返回值类型。
    ```typescript
    function logMessage(message: string): void {
      console.log(message);
      // return undefined; // implicitly returns undefined
    }
    ```
-   **`never`**: 表示**永不存在**的值的类型。通常用于：
    -   总是抛出异常的函数的返回值类型。
    -   永远不会有返回值的函数表达式（如无限循环）。
    -   在类型收窄后，逻辑上不可能出现的变量类型。
    ```typescript
    function error(message: string): never {
      throw new Error(message);
    }
    function infiniteLoop(): never {
      while (true) {}
    }
    ```

#### 4.1.4 类型推断 (Type Inference)

在没有明确指定类型注解的情况下，TypeScript 编译器会尝试根据变量的初始化值或其他上下文信息**自动推断**出变量的类型。

```typescript
let message = "Hello, TypeScript!"; // 推断为 string
let count = 0;                     // 推断为 number
let isActive = false;              // 推断为 boolean

// 函数返回值类型也可以被推断
function add(a: number, b: number) { // 返回值被推断为 number
  return a + b;
}

// 上下文类型推断 (Contextual Typing)
window.onclick = function(event) { // event 参数被推断为 MouseEvent
  console.log(event.button);
};
```
推荐在明确变量用途或函数签名时添加类型注解，但在类型明显（如直接初始化）时可以利用类型推断简化代码。

#### 4.1.5 类型断言 (Type Assertion)

有时开发者比 TypeScript 编译器更了解某个值的具体类型。类型断言允许开发者**手动指定**一个值的类型，**覆盖**编译器的推断。它**不会**在运行时进行任何特殊的检查或数据转换，仅仅是在编译阶段告诉编译器“相信我，我知道这个类型是什么”。

有两种语法形式：

1.  **尖括号语法 (`<Type>value`)**:
    ```typescript
    let someValue: unknown = "this is a string";
    let strLength: number = (<string>someValue).length;
    ```
    **注意**: 在 JSX/TSX 文件中，尖括号语法会与 JSX 标签冲突，因此**不推荐在 `.tsx` 文件中使用**。
2.  **`as` 语法 (`value as Type`)**:
    ```typescript
    let someValue: unknown = "this is a string";
    let strLength: number = (someValue as string).length;
    ```
    `as` 语法在任何场景下都可用，是**更推荐**的方式。

**警告**: 滥用类型断言会破坏类型安全。只有在确实需要且能确保类型正确的情况下才使用它。如果类型断言错误，可能导致运行时错误。通常，优先考虑使用类型守卫等方式进行类型收窄。

### 4.2 TypeScript 进阶类型与特性

#### 4.2.1 接口 (Interfaces)

接口用于定义**对象的结构契约 (Shape)**，描述对象应该包含哪些属性以及它们的类型。它是一种强大的方式来定义代码库中的规范。

-   **定义对象结构**:
    ```typescript
    interface User {
      readonly id: number; // 只读属性
      name: string;
      age?: number; // 可选属性
      email?: string | null; // 联合类型
      isAdmin: boolean;
      sayHello(): void; // 方法
    }

    function printUser(user: User): void {
      console.log(`ID: ${user.id}, Name: ${user.name}, Admin: ${user.isAdmin}`);
      user.sayHello();
      // user.id = 123; // Error: Cannot assign to 'id' because it is a read-only property.
    }

    let user1: User = {
      id: 1,
      name: "Alice",
      isAdmin: true,
      sayHello: () => console.log("Hello!"),
      // age 属性可选，可以不提供
    };
    printUser(user1);
    ```
-   **函数类型接口**: 定义函数的参数和返回值类型。
    ```typescript
    interface SearchFunc {
      (source: string, subString: string): boolean;
    }
    let mySearch: SearchFunc = (src, sub) => src.search(sub) > -1;
    console.log(mySearch("hello world", "world")); // true
    ```
-   **可索引类型 (Indexable Types)**: 定义可以通过索引（数字或字符串）访问的类型。
    ```typescript
    interface StringArray {
      [index: number]: string; // 数字索引签名
    }
    let myArray: StringArray = ["Bob", "Fred"];
    let first = myArray[0]; // Bob

    interface NumberDictionary {
      [key: string]: number; // 字符串索引签名
      length: number; // 可以同时有明确的属性
      // name: string; // Error: Property 'name' of type 'string' is not assignable to string index type 'number'.
    }
    ```
-   **类实现接口 (`implements`)**: 类可以声明它实现了一个或多个接口，强制类包含接口定义的所有成员。
    ```typescript
    interface ClockInterface {
      currentTime: Date;
      setTime(d: Date): void;
    }
    class Clock implements ClockInterface {
      currentTime: Date = new Date();
      setTime(d: Date) { this.currentTime = d; }
      constructor(h: number, m: number) {}
    }
    ```
-   **接口继承 (`extends`)**: 一个接口可以继承另一个或多个接口，获得父接口的所有成员。
    ```typescript
    interface Shape { color: string; }
    interface PenStroke { penWidth: number; }
    interface Square extends Shape, PenStroke { sideLength: number; }

    let square: Square = { color: "blue", penWidth: 5.0, sideLength: 10 };
    ```
-   **接口 vs. 类型别名 (Type Aliases)**: (见 4.2.2)

#### 4.2.2 类型别名 (Type Aliases)

使用 `type` 关键字可以为任何类型创建一个新的名字（别名）。

```typescript
type Point = { x: number; y: number; };
type ID = string | number; // 联合类型
type UserID = ID;         // 别名的别名
type Callback = (data: string) => void; // 函数类型
type Tree<T> = {          // 泛型类型别名
  value: T;
  left?: Tree<T>;
  right?: Tree<T>;
};

let p: Point = { x: 10, y: 20 };
let userId: UserID = "user-123";
let myCallback: Callback = (message) => console.log(message);
```

**接口 (Interface) vs. 类型别名 (Type Alias)**:

-   **相似点**: 都可以用来描述对象的形状或函数签名。
-   **主要区别**:
    -   **扩展**: 接口可以使用 `extends` 来扩展其他接口或类。类型别名可以使用交叉类型 (`&`) 来模拟扩展。
    -   **同名合并 (Declaration Merging)**: 接口可以定义多次，并会被自动合并。类型别名不可以同名。
        ```typescript
        interface Box { height: number; }
        interface Box { width: number; } // OK, Box 现在有 height 和 width
        // type Box = { height: number; }; // Error: Duplicate identifier 'Box'.
        // type Box = { width: number; };
        ```
    -   **实现 (Implements)**: 类可以 `implements` 接口，但不能 `implements` 类型别名 (虽然可以实现类型别名定义的结构)。
    -   **描述非对象类型**: 类型别名可以为原始类型、联合类型、元组等任何类型创建别名，接口主要用于描述对象结构。
-   **选择**:
    -   优先使用 `interface` 定义对象结构和类的契约，因为它更符合传统面向对象的概念，并且支持声明合并。
    -   当需要定义联合类型、交叉类型、元组、原始类型的别名，或者需要更复杂的类型操作（如使用映射类型）时，使用 `type`。

#### 4.2.3 函数类型

(已在接口和类型别名中涉及)

可以明确定义函数的参数类型和返回值类型。

```typescript
function add(x: number, y: number): number { // 参数和返回值类型注解
  return x + y;
}

let subtract: (baseValue: number, decrement: number) => number =
  function(x, y) {
    return x - y;
  };

// 可选参数 (?) 必须在必选参数之后
function buildName(firstName: string, lastName?: string): string {
  return lastName ? `${firstName} ${lastName}` : firstName;
}

// 默认参数
function calculate(a: number, b: number = 10): number {
  return a * b;
}

// 剩余参数 (...)
function sum(...nums: number[]): number {
  return nums.reduce((total, num) => total + num, 0);
}

// 函数重载 (Overloads): 为同一个函数提供多个函数类型定义，用于实现基于不同参数类型或数量返回不同结果的函数。
// 实现签名必须兼容所有重载签名。
function formatData(data: string): string; // 重载签名 1
function formatData(data: number[]): string[]; // 重载签名 2
function formatData(data: any): any { // 实现签名 (参数类型通常用 any 或联合类型)
  if (typeof data === 'string') {
    return data.toUpperCase();
  } else if (Array.isArray(data)) {
    return data.map(String);
  }
}
formatData("hello"); // 调用重载 1，返回 "HELLO"
formatData([1, 2, 3]); // 调用重载 2，返回 ["1", "2", "3"]
// formatData(true); // Error: No overload matches this call.
```

#### 4.2.4 类 (Classes)

TypeScript 在 ES6 类的基础上增加了类型注解和访问修饰符。

-   **访问修饰符 (Access Modifiers)**:
    -   `public` (默认): 任何地方都可以访问。
    -   `private`: 只能在类的内部访问。
    -   `protected`: 只能在类的内部及其子类中访问。
-   **`readonly` 修饰符**: 属性只能在声明时或构造函数中初始化，之后不能修改。
-   **参数属性 (Parameter Properties)**: 在构造函数参数前添加访问修饰符或 `readonly`，可以自动创建同名属性并赋值。
    ```typescript
    class Animal {
      // public name: string; // 传统写法
      protected age: number;
      private secret: string = 'shhh';

      // 参数属性: public name 自动创建并赋值
      constructor(public name: string, age: number, readonly species: string) {
        // this.name = name; // 传统写法
        this.age = age;
        this.species = species; // readonly 可以在构造函数内赋值
      }

      public move(distance: number = 0): void {
        console.log(`${this.name} moved ${distance}m.`);
        console.log(`Age: ${this.age}`); // protected 可在内部访问
        console.log(`Secret: ${this.secret}`); // private 可在内部访问
      }
    }

    class Dog extends Animal {
      constructor(name: string) {
        super(name, 2, "Canine"); // 调用父类构造函数
      }
      public bark(): void {
        console.log("Woof! Woof!");
        console.log(`Age from Dog: ${this.age}`); // protected 可在子类访问
        // console.log(`Secret from Dog: ${this.secret}`); // Error: Property 'secret' is private...
      }
      public getSpecies(): string {
          // this.species = 'Feline'; // Error: Cannot assign to 'species' because it is a read-only property.
          return this.species;
      }
    }

    const dog = new Dog("Buddy");
    dog.move(10);
    dog.bark();
    console.log(dog.name); // public 可在外部访问
    // console.log(dog.age); // Error: Property 'age' is protected...
    // console.log(dog.secret); // Error: Property 'secret' is private...
    console.log(dog.species); // readonly 可以访问
    ```
-   **抽象类 (Abstract Classes)**: 不能被实例化的基类，用于定义通用结构和必须由子类实现的抽象方法。
    ```typescript
    abstract class Department {
      constructor(public name: string) {}
      printName(): void { console.log(`Department name: ${this.name}`); }
      abstract printMeeting(): void; // 必须在派生类中实现
    }
    class AccountingDepartment extends Department {
      constructor() { super("Accounting and Auditing"); }
      printMeeting(): void { console.log("The Accounting Department meets each Monday at 10am."); }
    }
    // let department: Department; // Error: Cannot create an instance of an abstract class.
    let department: Department = new AccountingDepartment();
    department.printName();
    department.printMeeting();
    ```

#### 4.2.5 联合类型 (`|`) 与 交叉类型 (`&`)

-   **联合类型 (Union Types)**: 表示一个值可以是**几种类型之一**。使用 `|` 分隔。
    ```typescript
    let id: string | number;
    id = 101;    // OK
    id = "user-101"; // OK
    // id = true;   // Error

    function printId(inputId: string | number) {
      // 使用联合类型的值时，只能访问所有类型共有的成员
      // console.log(inputId.toUpperCase()); // Error: Property 'toUpperCase' does not exist on type 'string | number'.
      if (typeof inputId === 'string') {
        console.log(inputId.toUpperCase()); // OK, 类型收窄为 string
      } else {
        console.log(inputId); // OK, 类型收窄为 number
      }
    }
    ```
-   **交叉类型 (Intersection Types)**: 将多个类型**合并**为一个类型，新类型具有所有类型的成员。使用 `&` 分隔。常用于合并接口或类型别名。
    ```typescript
    interface Loggable {
      log(message: string): void;
    }
    interface Serializable {
      serialize(): string;
    }

    type Persistent = Loggable & Serializable; // 交叉类型

    let obj: Persistent = {
      log: (msg) => console.log(msg),
      serialize: () => JSON.stringify({ data: "some data" })
    };
    obj.log("Data saved.");
    console.log(obj.serialize());
    ```

#### 4.2.6 字面量类型 (Literal Types)

限制变量只能取某几个**特定的字符串、数字或布尔值**。常与联合类型一起使用，构成所谓的“标签联合类型”或“可辨识联合类型”。

```typescript
type CardinalDirection = "North" | "East" | "South" | "West";
let direction: CardinalDirection;
direction = "North"; // OK
// direction = "N";    // Error

type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
let roll: DiceRoll = 3; // OK

// 可辨识联合类型 (Discriminated Unions)
interface Square { kind: "square"; size: number; }
interface Rectangle { kind: "rectangle"; width: number; height: number; }
interface Circle { kind: "circle"; radius: number; }

type Shape = Square | Rectangle | Circle; // 使用共同的 'kind' 属性区分

function area(s: Shape): number {
  switch (s.kind) {
    case "square": return s.size * s.size;
    case "rectangle": return s.width * s.height;
    case "circle": return Math.PI * s.radius ** 2;
    default:
      const _exhaustiveCheck: never = s; // 检查是否覆盖了所有 case
      return _exhaustiveCheck;
  }
}
```

#### 4.2.7 泛型 (Generics)

创建**可重用**的组件（函数、类、接口、类型别名），使其能够处理**多种类型**，而不是单一类型，同时保持类型安全。使用 `<T>` (或其他大写字母) 表示类型参数。

-   **泛型函数**:
    ```typescript
    function identity<T>(arg: T): T { // T 是类型参数
      return arg;
    }
    let output1 = identity<string>("myString"); // 显式指定 T 为 string
    let output2 = identity("myString");        // 类型推断 T 为 string
    let output3 = identity<number>(123);       // 显式指定 T 为 number

    function loggingIdentity<T>(arg: T[]): T[] { // 泛型约束 T 是数组
    // function loggingIdentity<T>(arg: Array<T>): Array<T> { // 另一种写法
      console.log(arg.length);
      return arg;
    }
    ```
-   **泛型接口**:
    ```typescript
    interface GenericIdentityFn<T> {
      (arg: T): T;
    }
    let myIdentity: GenericIdentityFn<number> = identity;
    ```
-   **泛型类**:
    ```typescript
    class GenericNumber<T> {
      zeroValue: T | undefined;
      add: ((x: T, y: T) => T) | undefined;
    }
    let myGenericNumber = new GenericNumber<number>();
    myGenericNumber.zeroValue = 0;
    myGenericNumber.add = function(x, y) { return x + y; };
    ```
-   **泛型约束 (Generic Constraints)**: 使用 `extends` 关键字限制类型参数必须符合某个结构。
    ```typescript
    interface Lengthwise { length: number; }

    function loggingIdentityConstrained<T extends Lengthwise>(arg: T): T {
      console.log(arg.length); // OK, T 保证有 length 属性
      return arg;
    }
    loggingIdentityConstrained("hello"); // OK, string has length
    loggingIdentityConstrained([1, 2, 3]); // OK, array has length
    // loggingIdentityConstrained(123); // Error: Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.
    ```
-   **在泛型约束中使用类型参数**:
    ```typescript
    function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
      return obj[key];
    }
    let x = { a: 1, b: "hello", c: true };
    getProperty(x, "a"); // 返回类型 number
    getProperty(x, "b"); // 返回类型 string
    // getProperty(x, "d"); // Error: Argument of type '"d"' is not assignable to parameter of type '"a" | "b" | "c"'.
    ```

#### 4.2.8 高级类型 (Advanced Types / Type Gymnastics)

利用 TypeScript 类型系统的能力进行更复杂的类型操作和推断。

-   **类型守卫 (Type Guards)**: 在特定作用域内**收窄 (narrow)** 变量类型的表达式。
    -   `typeof`: 检查原始类型 (`string`, `number`, `boolean`, `symbol`, `bigint`, `undefined`, `function`)。
    -   `instanceof`: 检查对象是否是某个类的实例。
    -   `in`: 检查对象（及其原型链）是否存在某个属性。
    -   **自定义类型守卫 (User-Defined Type Guards)**: 使用 `parameterName is Type` 形式的**类型谓词**作为返回类型的函数。
        ```typescript
        interface Fish { swim(): void; }
        interface Bird { fly(): void; }

        function isFish(pet: Fish | Bird): pet is Fish { // 类型谓词: pet is Fish
          return (pet as Fish).swim !== undefined;
        }

        function move(pet: Fish | Bird) {
          if (isFish(pet)) {
            pet.swim(); // OK, pet is narrowed to Fish
          } else {
            pet.fly(); // OK, pet is narrowed to Bird
          }
        }
        ```
-   **条件类型 (Conditional Types)**: `T extends U ? X : Y`。根据类型 `T` 是否可分配给 `U` 来选择类型 `X` 或 `Y`。常用于创建根据输入类型变化的类型。
    -   **分布式条件类型**: 当 `T` 是联合类型时，条件类型会**分布**到联合类型的每个成员上。`T extends U ? X : Y` 会变成 `(A extends U ? X : Y) | (B extends U ? X : Y) | ...` (如果 T 是 `A | B | ...`)。
    -   **内置条件类型**:
        -   `Exclude<T, U>`: 从 `T` 中排除可分配给 `U` 的类型。
        -   `Extract<T, U>`: 从 `T` 中提取可分配给 `U` 的类型。
        -   `NonNullable<T>`: 从 `T` 中排除 `null` 和 `undefined`。
        -   `ReturnType<T>`: 获取函数类型 `T` 的返回值类型。
        -   `Parameters<T>`: 获取函数类型 `T` 的参数类型组成的元组。
        -   `InstanceType<T>`: 获取构造函数类型 `T` 的实例类型。
    -   **`infer` 关键字**: 在条件类型的 `extends` 子句中，可以使用 `infer` 声明一个类型变量，用于**推断**类型。
        ```typescript
        type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
        type Num = GetReturnType<() => number>; // type Num = number
        type Str = GetReturnType<(x: string) => string>; // type Str = string

        type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
        type PromiseData = UnpackPromise<Promise<string>>; // type PromiseData = string
        type NonPromiseData = UnpackPromise<number>;     // type NonPromiseData = number
        ```
-   **映射类型 (Mapped Types)**: 基于一个现有类型，通过转换其属性来创建新类型。语法类似索引签名 `[P in K]: Type`。
    -   `P in K`: 遍历类型 `K` (通常是 `keyof T`) 中的每个属性名 `P`。
    -   `+/-readonly`, `+/-?`: 添加或移除只读和可选修饰符。
    -   **内置映射类型**:
        -   `Partial<T>`: 将 `T` 的所有属性变为可选。`[P in keyof T]?: T[P]`
        -   `Required<T>`: 将 `T` 的所有属性变为必选。`[P in keyof T]-?: T[P]`
        -   `Readonly<T>`: 将 `T` 的所有属性变为只读。`readonly [P in keyof T]: T[P]`
        -   `Pick<T, K>`: 从 `T` 中选取一组属性 `K` (联合类型)。`[P in K]: T[P]`
        -   `Omit<T, K>`: 从 `T` 中移除一组属性 `K`。
        -   `Record<K, T>`: 创建一个对象类型，其属性键为 `K` (联合类型或字面量类型)，属性值为 `T`。`[P in K]: T`
    ```typescript
    interface Todo { title: string; description: string; completed: boolean; }
    type PartialTodo = Partial<Todo>; // { title?: string; description?: string; completed?: boolean; }
    type ReadonlyTodo = Readonly<Todo>; // { readonly title: string; readonly description: string; readonly completed: boolean; }
    type TodoPreview = Pick<Todo, "title" | "completed">; // { title: string; completed: boolean; }
    type StringProps = Record<'prop1' | 'prop2', string>; // { prop1: string; prop2: string; }
    ```
-   **索引类型 (Indexed Types)**:
    -   **`keyof T` (索引类型查询)**: 获取类型 `T` 的所有**公有**属性名的**联合类型**。
        ```typescript
        interface Point { x: number; y: number; }
        type PointKeys = keyof Point; // type PointKeys = "x" | "y"
        ```
    -   **`T[K]` (索引访问类型)**: 获取类型 `T` 的属性 `K` 的类型。`K` 必须是 `keyof T` 的子类型。
        ```typescript
        type TypeOfX = Point["x"]; // type TypeOfX = number
        type TypeOfPointProp = Point[keyof Point]; // type TypeOfPointProp = number (因为 x 和 y 都是 number)
        ```
-   **`typeof` 操作符**: 在**类型上下文**中使用 `typeof` 可以获取一个变量或属性的类型。
    ```typescript
    let s = "hello";
    let n: typeof s; // type n = string

    const person = { name: "Alice", age: 30 };
    type PersonType = typeof person; // { name: string; age: number; }

    function format(data: PersonType): string {
      return `${data.name} (${data.age})`;
    }
    ```

### 4.3 TypeScript 配置与实践

#### 4.3.1 `tsconfig.json`

TypeScript 项目的核心配置文件，用于指定编译选项和项目包含的文件。

-   **作用**: 告知 TypeScript 编译器如何编译 `.ts` 文件。当目录下存在 `tsconfig.json` 时，运行 `tsc` 命令会自动加载该配置。
-   **常用编译选项 (compilerOptions)**:
    -   `target`: 指定编译输出的 ECMAScript 目标版本 (如 `"ES5"`, `"ES2016"`, `"ESNext"`)。
    -   `module`: 指定生成的模块系统代码 (`"CommonJS"`, `"ES6"`, `"ES2020"`, `"NodeNext"` 等)。
    -   `lib`: 指定编译时需要包含的库文件声明 (如 `"DOM"`, `"ES2015"`, `"ScriptHost"`)。
    -   `strict`: 启用所有严格类型检查选项 (包括 `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictPropertyInitialization` 等)。**强烈推荐开启**。
    -   `outDir`: 指定编译后输出 JS 文件的目录。
    -   `rootDir`: 指定 TypeScript 源文件的根目录。
    -   `sourceMap`: 生成 `.map` 文件，用于调试时映射回原始 TS 代码。
    -   `declaration`: 生成相应的 `.d.ts` 声明文件。
    -   `declarationMap`: 为 `.d.ts` 文件生成 sourcemap。
    -   `esModuleInterop`: 允许通过 ES6 模块语法导入 CommonJS 模块 (自动添加辅助代码)。推荐开启。
    -   `allowJs`: 允许编译 JavaScript 文件。
    -   `checkJs`: 在 `.js` 文件中报告错误 (需配合 `allowJs`)。
    -   `jsx`: 指定 JSX 代码生成方式 (`"preserve"`, `"react"`, `"react-jsx"` 等)。
    -   `noEmit`: 不生成输出文件 (只进行类型检查)。
    -   `skipLibCheck`: 跳过对所有声明文件 (`.d.ts`) 的类型检查 (可以加快编译速度)。
-   **文件包含/排除**:
    -   `include`: 指定需要编译的文件或目录列表 (支持 glob 模式)。
    -   `exclude`: 指定**不**需要编译的文件或目录列表 (优先级高于 `include`)。
    -   `files`: 指定一个明确的文件列表。

#### 4.3.2 声明文件 (`.d.ts`)

当使用纯 JavaScript 编写的库时，TypeScript 无法自动获取其类型信息。声明文件 (`.d.ts`) 就是用来**描述**这些 JavaScript 代码（或其他环境，如 DOM API）的**类型信息**的，它只包含类型注解，没有具体实现。

-   **来源**:
    -   **库自带**: 许多现代库已经使用 TypeScript 编写或自带了 `.d.ts` 文件。
    -   **DefinitelyTyped**: 一个庞大的社区维护的仓库，为成千上万的 JavaScript 库提供了高质量的声明文件。可以通过 npm 安装 `@types/<library-name>` 包来获取 (如 `npm install --save-dev @types/lodash`)。
    -   **手动编写**: 如果找不到现成的声明文件，可以自己编写。
-   **语法**: 使用 `declare` 关键字来声明变量、函数、类、模块等。
    ```typescript
    // my-js-lib.d.ts
    declare module 'my-js-lib' { // 声明模块
      export const version: string; // 声明导出的变量
      export function doSomething(options: Options): void; // 声明导出的函数
      export interface Options { // 声明接口
        value: number;
        name?: string;
      }
      // ... 其他声明
    }
    // 或者声明全局变量/函数 (不推荐)
    // declare var myGlobalVar: number;
    // declare function myGlobalFunc(arg: string): boolean;
    ```
-   **三斜线指令 (`///`)**: 用于引用其他声明文件，如 `<reference types="..." />` 或 `<reference path="..." />`。

#### 4.3.3 与 JavaScript 共存

TypeScript 设计上允许与 JavaScript 代码库平滑集成。

-   **渐进式迁移**:
    -   在 `tsconfig.json` 中设置 `allowJs: true`，允许 TS 项目中包含 `.js` 文件。
    -   设置 `checkJs: true`，让 TS 编译器尝试检查 `.js` 文件中的错误（基于 JSDoc 注释或推断）。
    -   可以逐步将 `.js` 文件重命名为 `.ts` 或 `.tsx` 并添加类型注解。
-   **使用 JSDoc 添加类型**: 对于不想完全迁移到 TS 的 `.js` 文件，可以使用 JSDoc 注释来为 JavaScript 代码提供类型信息，TypeScript 编译器能够理解这些注释。
    ```javascript
    // @ts-check (可选，在 VS Code 等编辑器中启用更强的 JS 类型检查)

    /**
     * Adds two numbers.
     * @param {number} a The first number.
     * @param {number} b The second number.
     * @returns {number} The sum of the two numbers.
     */
    function add(a, b) {
      return a + b;
    }
    ```

#### 4.3.4 在框架中的应用

TypeScript 已被主流前端框架广泛支持和推荐。

-   **React**:
    -   Create React App 或 Vite 等脚手架提供 TS 模板。
    -   类型化 Props (`interface Props { ... }`, `React.FC<Props>`)。
    -   类型化 State (`useState<StateType>(initialState)`)。
    -   类型化 Hooks (`useRef<ElementType>(null)`)。
    -   `.tsx` 文件用于编写带 JSX 的 TS 代码。
-   **Vue**:
    -   Vue 3 对 TypeScript 有一流的支持（Vue 2 支持相对有限）。
    -   使用 `<script setup lang="ts">` (组合式 API) 或 `defineComponent` (选项式 API)。
    -   类型化 Props (`defineProps<Props>`)。
    -   类型化 Emits (`defineEmits<(e: 'change', id: number) => void>()`)。
    -   类型化 `ref`, `reactive` 等。
-   **Angular**: 默认使用 TypeScript 作为开发语言，深度集成。

使用 TypeScript 可以显著提高使用这些框架开发大型应用时的代码质量和开发体验。

#### 4.3.5 工程实践

-   **开启 `strict` 模式**: 在 `tsconfig.json` 中启用 `strict: true` 是最佳实践，它开启了一系列严格的类型检查规则，能最大限度地发挥 TS 的优势。
-   **使用 ESLint 和 Prettier**:
    -   **ESLint**: 代码质量和风格检查工具。使用 `@typescript-eslint/parser` 解析 TS 代码，并配合 `@typescript-eslint/eslint-plugin` 提供的 TS 相关规则。
    -   **Prettier**: 代码格式化工具，确保团队代码风格一致。
    -   将它们集成到开发流程和 CI/CD 中。
-   **编写清晰的类型**: 使用有意义的接口和类型别名，避免过度复杂的“类型体操”（除非必要），保持类型定义的简洁和可读。
-   **利用工具**: 充分利用 IDE 提供的类型检查、重构、自动导入等功能。
-   **类型驱动开发 (Type-Driven Development)**: 在开始编写逻辑之前，先定义好数据结构和函数签名（接口、类型别名），让类型引导开发过程。

TypeScript 通过其强大的静态类型系统，为现代 JavaScript 开发带来了更高的可靠性、可维护性和开发效率，已成为构建复杂前端应用的事实标准之一。