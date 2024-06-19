const x = 'test';

type Type = {
    property2: any; // You can use "any" for untyped properties
    nestedObject: {
        nestedProperty2: string[];
        // Nested object can have properties
        nestedProperty1: boolean;
    };
    property3: string;
    property1: number;
    // Property names are not sorted alphabetically
};

interface MyUnsortedInterface {
    property1: number;
    nestedObject: {
        nestedProperty2: string[];
        // Nested object can have properties
        nestedProperty1: boolean;
    };
    property2: any; // You can use "any" for untyped properties
    // Property names are not sorted alphabetically
    property3: string;
}
