



interface MyUnsortedInterface {
  // Property names are not sorted alphabetically
  property3: string;
  property1: number;
  nestedObject: {
    nestedProperty2: string[];
    // Nested object can have properties
    nestedProperty1: boolean;
  };
  property2: any; // You can use "any" for untyped properties
}