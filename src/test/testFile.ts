type Type = {
    nestedObject: {
        nestedProperty2: string[];
        // Nested object can have properties
        nestedProperty1: boolean;
    };
    property1: number;
    property2: any; // You can use "any" for untyped properties
    // Property names are not sorted alphabetically
    property3: string;
};

interface MyUnsortedInterface {
    nestedObject: {
        nestedProperty2: string[];
        // Nested object can have properties
        nestedProperty1: boolean;
    };
    property1: number;
    property2: any; // You can use "any" for untyped properties
    // Property names are not sorted alphabetically
    property3: string;
}
